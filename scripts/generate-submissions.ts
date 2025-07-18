import * as fs from 'fs';
import * as path from 'path';

// Popular GIF IDs from Giphy - these are commonly used reaction GIFs
const gifIds = [
  'JIX9t2j0ZTN9S', 'xT5LMHxhOfscxPfIfm', '3o7aCRloybJlXpNjSU', '26tPplGWjN0xLybiU',
  'l3q2K5jinAlChoCLS', '3oEjI6SIIHBdRxXI40', '3ohhwxmNcPvwyRqYKI', '26ybwvTX4DTkwst6U',
  'VbnUQpnihPSIgIXuZv', 'xTiTnBMEz7zAKs57LG', 'l41lFw057lAJQMwg0', '3o7TKB3oifq46DDhOE',
  '26gsspfbt1HfVQ9va', '3oEjHI8WJv4x6UPDB6', 'l0MYt5jPR6QX5pnqM', '14aUO0Mf7dWDXW',
  '3o7TKF1fSIs1R19B8k', 'xTiTnMhJTwNXDe2Fun', '26BRzozg4TCBXv6QU', 'l4FGI1OHJW0BLy2fS',
  '3o6Zt481isNVuQI1l6', 'l3vR85PnGsBwu1PFK', '3oEduKP4VaI77iLqm8', 'xT9IgzoKnwFNmISR8I',
  '26gsjCZpPolPr3sBy', 'l0HlvtIPzPdt2usKs', '3o6gDWzmAzrpi5DQU8', 'xT9IgDEI1iZyb2wqo8',
  '26uf2JHNV0Tq3ugkE', 'l3q2Sb7FtY2YUTI4w', 'xT0xeJpnrWC4XWblEk', '3og0INyCmHlNylks9O',
  'xTiTnGeUsWOEe1IXKM', 'l0MYGb1LuZ3n7dRnO', '3o7aCTfyhYawdOXcFW', '26gssIytJvy1b1THO',
  'l3vRfNA1JEwqBxRKg', '3ohzdIuqJoo8QdKlnW', 'LXONhtCmN32YU', '3o7TKU8RvQuomFfUUU',
  'xT9IgH8i0Oe3tvaWCQ', 'l0HU5bbgdW6qzJsmQ', '3o6Zt6KHxJTbXCnSvu', 'xTiTnwgQ8Wjs1sUB4k',
  'l3q2K5nci7r5tuTUA', '26gsjL7MPL2fKm1lS', '3o7TKVUn7iM8FMEU24', 'xT5LMWLyNQxkbzaHuM',
  'l4FGni1OHJW4g1lLy', '3oEjHV0z8S4kU0UHss', 'xT0xem7ZlZ2DOznMDm', '26uf43dkw9ByWsjLi',
  'l3vR3EeNR7HMNwYvu', '3o7TKTDn976rzVgky4', 'xTiTnHXbRoaZ1B1Mo8', '3o6ZtaO9BZHcOjmErm',
  '26BRBupa6nU3U0puc', 'l4FGs8qydTJ5gvL2w', '3og0IvGtnDyPHCRaAU', 'xT9IgG50Fb7Mi0prBC',
  '26gsr1x5EDPgj6zE4', 'l3vR1tookIhM8nCHS', '3o7TKziIuXtAI2vtPa', 'xTiTnLbLr0QBfzGM5G',
  '3o6Zt9y2JCjc450T3q', 'l4FGI8UEVvUOyqKQM', '26BRDvCpnEukGhmHC', 'xTiTnJ3BooiDs8dL7W',
  'l3vRlT2k49qNsAInu', '3o7TKK2pUd5LIF3LPO', 'xT9IgFy0vP7EZ7RqU0', '26BRQaiZM0IeyoFa0',
  '3o7TKOeFS0QZL3XYJq', 'l4FGp6wKxMULON88U', '3o6ZsYzuHpmxb4uDUA', 'xT5LMESsx1kPGLRedq',
  'l3vRkGgMfvANIFtE4', '26BRuo6sLetdllPAQ', '3o7TKAXkWwJBawSsza', 'xTiTnBEtLUlxj5UUSc'
];

// Function to create a cohort directory with many submissions
async function generateSubmissions(cohortName: string, count: number) {
  const cohortDir = path.join(__dirname, '..', 'submissions', cohortName);
  
  // Create cohort directory if it doesn't exist
  if (!fs.existsSync(cohortDir)) {
    fs.mkdirSync(cohortDir, { recursive: true });
  }
  
  // Generate submission files
  for (let i = 0; i < count; i++) {
    const gifId = gifIds[i % gifIds.length]; // Cycle through available GIF IDs
    const submission = {
      url: `https://media.giphy.com/media/${gifId}/giphy.gif`,
      author: `student_${i + 1}`
    };
    
    const fileName = `student_${i + 1}.json`;
    const filePath = path.join(cohortDir, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(submission, null, 2));
    
    if (i % 50 === 0) {
      console.log(`Created ${i + 1} submissions...`);
    }
  }
  
  console.log(`Successfully created ${count} submissions in ${cohortName}`);
}

// Create 200 submissions for a new cohort
const cohortName = 'C12-large';
const submissionCount = 200;

generateSubmissions(cohortName, submissionCount).catch(console.error);