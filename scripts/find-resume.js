const fs = require('fs');
const path = require('path');

const resumeDir = path.join(__dirname, '../src/assets/resume');
const infoPath = path.join(resumeDir, 'resume-info.json');

// Ensure directory exists
if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}

// Find any PDF in the folder
const files = fs.readdirSync(resumeDir);
const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));

const filename = pdfFiles.length > 0 ? pdfFiles[0] : '';

// Write it to a JSON file that the Angular app can read at runtime
fs.writeFileSync(infoPath, JSON.stringify({ filename }));
console.log(`[Resume Linker] Detected resume: ${filename || 'None found'}`);
