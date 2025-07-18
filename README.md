# GIF Mosaic Gallery

A collaborative project where students contribute GIFs to create animated mosaics for their cohorts.

## How It Works

1. Students submit GIF URLs through JSON files in their cohort's directory
2. GitHub Actions automatically processes submissions when merged to main
3. A TypeScript script downloads GIFs and creates a 4K video mosaic
4. The mosaic is uploaded to S3 and displayed on the GitHub Pages site

## Contributing a GIF

### 1. Fork this repository

### 2. Create your submission file

Navigate to your cohort's directory under `submissions/` (e.g., `submissions/C11/`) and create a new JSON file with your GitHub username:

```json
{
  "url": "https://media.giphy.com/media/YOUR-GIF-ID/giphy.gif",
  "author": "your-github-username"
}
```

### 3. Submit a Pull Request

Once your PR is merged, the mosaic will be automatically regenerated with your GIF included!

## Technical Details

- **Output:** 1920x1920 WebM video
- **Duration**: 10-second loop
- **Grid**: Dynamic sizing based on number of submissions
- **Hosting**: Videos stored on S3, site hosted on GitHub Pages

## Setup for Maintainers

### Prerequisites

- Node.js 18+
- AWS S3 bucket with public read access
- GitHub repository secrets:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION`
  - `S3_BUCKET_NAME`

### Local Development

```bash
# Install dependencies
npm install

# Process GIFs locally (requires AWS credentials)
npm run process-gifs

# Run the website locally
npm run dev
```

### Adding New Cohorts

Simply create a new directory under `submissions/` with the cohort identifier (e.g., `submissions/C12/`).

## Architecture

- **TypeScript**: Processing scripts and type safety
- **Astro + React**: Static site generation with interactive components
- **GitHub Actions**: Automated processing on merge
- **AWS S3**: Video storage
- **ffmpeg**: Video processing

## Rate Limiting & Best Practices

- GIFs are downloaded with rate limiting protection (100ms delay between downloads)
- Downloads happen in batches of 5 concurrent requests
- Failed downloads are retried with exponential backoff
- Downloaded GIFs are cached locally to avoid re-downloading
- Consider using Giphy API keys for production use