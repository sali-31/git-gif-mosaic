import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { promisify } from 'util';
import { exec } from 'child_process';

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);
const execAsync = promisify(exec);

interface GifSubmission {
  url: string;
  author?: string;
}

interface CohortMetadata {
  cohortId: string;
  name: string;
  createdAt: string;
  videoUrl?: string;
}

const SUBMISSIONS_DIR = path.join(__dirname, '..', '..', 'submissions');
const DOWNLOADS_DIR = path.join(__dirname, '..', '..', 'downloads');
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'output');
const PUBLIC_DIR = path.join(__dirname, '..', '..', 'public');
const OUTPUT_WIDTH = 1920;
const OUTPUT_HEIGHT = 1920;
const DURATION_SECONDS = 10;

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function ensureDirectories() {
  for (const dir of [DOWNLOADS_DIR, OUTPUT_DIR, PUBLIC_DIR]) {
    await mkdir(dir, { recursive: true });
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadGif(url: string, cohort: string, filename: string, retryCount = 0): Promise<string | null> {
  const cohortDownloadDir = path.join(DOWNLOADS_DIR, cohort);
  await mkdir(cohortDownloadDir, { recursive: true });
  
  const outputPath = path.join(cohortDownloadDir, filename);
  
  if (fs.existsSync(outputPath)) {
    // Check if existing file is valid
    const stats = fs.statSync(outputPath);
    if (stats.size < 1000) { // Less than 1KB is likely invalid
      console.log(`Removing invalid cached GIF: ${filename}`);
      fs.unlinkSync(outputPath);
    } else {
      console.log(`GIF already downloaded: ${filename}`);
      return outputPath;
    }
  }

  try {
    console.log(`Downloading GIF: ${url}`);
    const response = await axios.get(url, { 
      responseType: 'arraybuffer',
      timeout: 30000, // 30 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GIF-Mosaic-Bot/1.0)'
      }
    });
    
    // Check if response is valid
    if (response.data.byteLength < 1000) {
      console.log(`Invalid GIF (too small): ${url}`);
      return null;
    }
    
    // Check if it's actually a GIF or image
    const buffer = Buffer.from(response.data);
    const header = buffer.toString('hex', 0, 4);
    
    // GIF header: 47494638 (GIF8)
    // PNG header: 89504e47
    // JPEG header: ffd8ff
    if (!header.startsWith('474946') && !header.startsWith('89504e') && !header.startsWith('ffd8ff')) {
      console.log(`Invalid image format: ${url}`);
      return null;
    }
    
    await writeFile(outputPath, response.data);
    
    // Add a small delay to be respectful of rate limits
    await sleep(100); // 100ms delay between downloads
    
    return outputPath;
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.log(`GIF not found (404): ${url}`);
      return null;
    }
    if (error.response?.status === 403) {
      console.log(`GIF forbidden (403): ${url}`);
      return null;
    }
    if (error.response?.status === 429 || error.code === 'ECONNRESET') {
      // Rate limited or connection reset
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`Rate limited, waiting ${delay}ms before retry...`);
        await sleep(delay);
        return downloadGif(url, cohort, filename, retryCount + 1);
      }
    }
    console.error(`Failed to download ${url}: ${error.message}`);
    return null;
  }
}

function calculateGrid(numItems: number): { cols: number; rows: number } {
  // Calculate optimal grid size based on number of items
  // Aim for a roughly square grid that fits all items
  const aspectRatio = OUTPUT_WIDTH / OUTPUT_HEIGHT; // 1:1 square
  
  // For special cases
  if (numItems === 1) return { cols: 1, rows: 1 };
  if (numItems === 2) return { cols: 2, rows: 1 };
  if (numItems === 3) return { cols: 3, rows: 1 };
  if (numItems === 4) return { cols: 2, rows: 2 };
  
  // Calculate ideal number of columns for aspect ratio
  let bestCols = 1;
  let bestWaste = numItems; // Start with worst case
  
  // Try different column counts to find the one with least wasted space
  for (let testCols = 2; testCols <= Math.ceil(Math.sqrt(numItems * aspectRatio * 1.5)); testCols++) {
    const testRows = Math.ceil(numItems / testCols);
    const waste = (testCols * testRows) - numItems;
    
    // Prefer layouts that are not too tall (rows should not be much more than cols)
    const aspectPenalty = testRows > testCols * 1.5 ? 10 : 0;
    const totalWaste = waste + aspectPenalty;
    
    if (totalWaste < bestWaste) {
      bestWaste = totalWaste;
      bestCols = testCols;
    }
  }
  
  const rows = Math.ceil(numItems / bestCols);
  return { cols: bestCols, rows };
}

async function createMosaicWithFFmpeg(gifPaths: string[], cohort: string): Promise<string> {
  const cohortOutputDir = path.join(OUTPUT_DIR, cohort);
  await mkdir(cohortOutputDir, { recursive: true });
  
  const outputPath = path.join(cohortOutputDir, 'mosaic.webm');
  
  // Calculate dynamic grid size
  const { cols: MOSAIC_COLUMNS, rows: MOSAIC_ROWS } = calculateGrid(gifPaths.length);
  console.log(`Creating ${MOSAIC_COLUMNS}x${MOSAIC_ROWS} grid for ${gifPaths.length} GIFs`);
  
  const tileWidth = Math.floor(OUTPUT_WIDTH / MOSAIC_COLUMNS);
  const tileHeight = Math.floor(OUTPUT_HEIGHT / MOSAIC_ROWS);
  
  // Build the filter complex for FFmpeg using xstack
  let filterComplex = '';
  let inputArgs = '';
  const totalTiles = gifPaths.length; // Only create as many tiles as we have GIFs
  const inputs: string[] = [];
  
  // Add input arguments and scale filters for actual GIFs
  for (let i = 0; i < gifPaths.length; i++) {
    inputArgs += `-stream_loop -1 -i "${gifPaths[i]}" `;
    filterComplex += `[${i}:v]scale=${tileWidth}:${tileHeight}:force_original_aspect_ratio=increase,crop=${tileWidth}:${tileHeight},setsar=1[v${i}];`;
    inputs.push(`[v${i}]`);
  }
  
  // Build the xstack grid layout
  const layout: string[] = [];
  let tileIndex = 0;
  
  for (let row = 0; row < MOSAIC_ROWS; row++) {
    for (let col = 0; col < MOSAIC_COLUMNS; col++) {
      if (tileIndex < gifPaths.length) {
        if (tileIndex === 0) {
          layout.push('0_0');
        } else {
          layout.push(`${col * tileWidth}_${row * tileHeight}`);
        }
        tileIndex++;
      }
    }
  }
  
  // Create background to fill the full resolution
  filterComplex = `color=black:${OUTPUT_WIDTH}x${OUTPUT_HEIGHT}:d=${DURATION_SECONDS}[bg];` + filterComplex;
  
  // Handle single GIF case differently
  if (gifPaths.length === 1) {
    // For a single GIF, just overlay it on the background
    filterComplex += `[bg][v0]overlay=0:0[out]`;
  } else {
    // Create the xstack filter for multiple GIFs
    filterComplex += `${inputs.join('')}xstack=inputs=${totalTiles}:layout=${layout.join('|')}[mosaic];`;
    // Overlay the mosaic on the background to ensure full resolution
    filterComplex += `[bg][mosaic]overlay=0:0[out]`;
  }
  
  // Build the complete FFmpeg command
  // Use faster encoding settings for quicker processing
  const ffmpegCmd = [
    'ffmpeg',
    inputArgs,
    '-filter_complex', `"${filterComplex}"`,
    '-map', '"[out]"',
    '-c:v', 'libvpx-vp9',
    '-b:v', '1M',
    '-cpu-used', '8', // Fastest encoding
    '-deadline', 'realtime', // Fastest preset
    '-pix_fmt', 'yuv420p',
    '-t', DURATION_SECONDS.toString(),
    '-y',
    `"${outputPath}"`
  ].join(' ');
  
  console.log(`Creating mosaic for cohort ${cohort}...`);
  console.log('This may take a few minutes...');
  
  try {
    await execAsync(ffmpegCmd, { 
      maxBuffer: 1024 * 1024 * 50, // 50MB buffer
      timeout: 1000 * 60 * 10 // 10 minute timeout
    });
  } catch (error: any) {
    if (error.killed && error.signal === 'SIGTERM') {
      console.error('FFmpeg process timed out. Consider using smaller GIFs or fewer tiles.');
    }
    throw error;
  }
  
  return outputPath;
}

async function uploadToS3(filePath: string, key: string): Promise<string> {
  const fileContent = await readFile(filePath);
  const bucketName = process.env.S3_BUCKET_NAME;
  
  if (!bucketName) {
    console.log(`Skipping S3 upload - S3_BUCKET_NAME not set. File saved locally at: ${filePath}`);
    return filePath;
  }
  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
    ContentType: 'video/webm',
    ACL: 'public-read'
  });

  await s3Client.send(command);
  
  return `https://${bucketName}.s3.amazonaws.com/${key}`;
}

async function updateCohortMetadata(cohortId: string, videoUrl: string) {
  const metadataPath = path.join(PUBLIC_DIR, 'cohorts.json');
  
  let cohorts: CohortMetadata[] = [];
  
  if (fs.existsSync(metadataPath)) {
    const content = await readFile(metadataPath, 'utf-8');
    cohorts = JSON.parse(content);
  }
  
  const existingIndex = cohorts.findIndex(c => c.cohortId === cohortId);
  const cohortData: CohortMetadata = {
    cohortId,
    name: cohortId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    createdAt: new Date().toISOString(),
    videoUrl
  };
  
  if (existingIndex >= 0) {
    cohorts[existingIndex] = cohortData;
  } else {
    cohorts.push(cohortData);
  }
  
  await writeFile(metadataPath, JSON.stringify(cohorts, null, 2));
}

async function processCohort(cohortDir: string) {
  const cohortId = path.basename(cohortDir);
  console.log(`Processing cohort: ${cohortId}`);
  
  const submissionFiles = await readdir(cohortDir);
  const jsonFiles = submissionFiles.filter(f => f.endsWith('.json'));
  
  if (jsonFiles.length === 0) {
    console.log(`No submissions found for cohort ${cohortId}`);
    return;
  }
  
  console.log(`Found ${jsonFiles.length} submissions for cohort ${cohortId}`);
  
  // Download all GIFs with concurrency control
  const gifPaths: string[] = [];
  const BATCH_SIZE = 5; // Download 5 GIFs concurrently
  let validDownloads = 0;
  let failedDownloads = 0;
  
  for (let i = 0; i < jsonFiles.length; i += BATCH_SIZE) {
    const batch = jsonFiles.slice(i, i + BATCH_SIZE);
    const batchPromises = batch.map(async (file, batchIndex) => {
      const fileIndex = i + batchIndex;
      const filePath = path.join(cohortDir, file);
      const content = await readFile(filePath, 'utf-8');
      const submission: GifSubmission = JSON.parse(content);
      
      return downloadGif(submission.url, cohortId, `gif_${fileIndex}.gif`);
    });
    
    const batchResults = await Promise.all(batchPromises);
    
    // Filter out null results (failed downloads)
    for (const result of batchResults) {
      if (result !== null) {
        gifPaths.push(result);
        validDownloads++;
      } else {
        failedDownloads++;
      }
    }
    
    if (i % 20 === 0 && i > 0) {
      console.log(`Progress: ${i} of ${jsonFiles.length} processed (${validDownloads} valid, ${failedDownloads} failed)`);
    }
  }
  
  console.log(`Download complete: ${validDownloads} valid GIFs, ${failedDownloads} failed`);
  
  if (gifPaths.length === 0) {
    console.log(`No valid GIFs found for cohort ${cohortId}`);
    return;
  }
  
  // Create mosaic video using FFmpeg
  const videoPath = await createMosaicWithFFmpeg(gifPaths, cohortId);
  console.log(`Video created for cohort ${cohortId}: ${videoPath}`);
  
  // Upload to S3
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const s3Key = `mosaics/${cohortId}/mosaic.webm`;
  const s3Url = await uploadToS3(videoPath, s3Key);
  console.log(`Uploaded to S3 for cohort ${cohortId}: ${s3Url}`);
  
  // Update metadata
  await updateCohortMetadata(cohortId, s3Url);
}

async function main() {
  try {
    // Check for required commands
    try {
      await execAsync('which ffmpeg');
    } catch (error) {
      console.error('Error: ffmpeg must be installed');
      console.error('Install with: sudo apt-get install ffmpeg');
      process.exit(1);
    }
    
    await ensureDirectories();
    
    // Check if a specific cohort was provided via command line
    const specificCohort = process.argv[2];
    
    if (specificCohort) {
      // Process only the specified cohort
      const cohortPath = path.join(SUBMISSIONS_DIR, specificCohort);
      
      if (!fs.existsSync(cohortPath)) {
        console.error(`Cohort directory not found: ${specificCohort}`);
        process.exit(1);
      }
      
      const dirStat = await stat(cohortPath);
      if (!dirStat.isDirectory()) {
        console.error(`Not a directory: ${specificCohort}`);
        process.exit(1);
      }
      
      console.log(`Processing single cohort: ${specificCohort}`);
      await processCohort(cohortPath);
    } else {
      // Process all cohorts
      const cohortDirs = await readdir(SUBMISSIONS_DIR);
      
      for (const dir of cohortDirs) {
        const dirPath = path.join(SUBMISSIONS_DIR, dir);
        const dirStat = await stat(dirPath);
        
        if (dirStat.isDirectory()) {
          await processCohort(dirPath);
        }
      }
      
      console.log('All cohorts processed successfully');
    }
    
  } catch (error) {
    console.error('Error processing GIFs:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}