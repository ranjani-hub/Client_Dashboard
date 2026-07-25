import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');

const candidateSrcs = [
  path.resolve(projectRoot, 'artifacts/client-dashboard/build'),
  path.resolve(projectRoot, 'artifacts/client-dashboard/dist'),
  path.resolve(process.cwd(), 'build'),
  path.resolve(process.cwd(), 'dist'),
];

const src = candidateSrcs.find(p => fs.existsSync(p));

if (src) {
  console.log(`Copying build output from: ${src}`);

  const commonJsIndex = `// Static / Serverless Vercel entrypoint fallback (CommonJS)
const fs = require('fs');
const path = require('path');

function handler(req, res) {
  const possiblePaths = [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'build', 'index.html'),
    path.join(process.cwd(), 'index.html'),
    path.join(process.cwd(), 'build', 'index.html'),
  ];
  for (const htmlPath of possiblePaths) {
    if (fs.existsSync(htmlPath)) {
      if (res && typeof res.setHeader === 'function') {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.end(fs.readFileSync(htmlPath, 'utf8'));
      }
      return fs.readFileSync(htmlPath, 'utf8');
    }
  }
  if (res && typeof res.end === 'function') {
    res.end('OK');
  }
}

module.exports = handler;
module.exports.default = handler;
`;

  const esmIndex = `// Static / Serverless Vercel entrypoint fallback (ESM)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function handler(req, res) {
  const possiblePaths = [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'build', 'index.html'),
    path.join(process.cwd(), 'index.html'),
    path.join(process.cwd(), 'build', 'index.html'),
  ];
  for (const htmlPath of possiblePaths) {
    if (fs.existsSync(htmlPath)) {
      if (res && typeof res.setHeader === 'function') {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.end(fs.readFileSync(htmlPath, 'utf8'));
      }
      return fs.readFileSync(htmlPath, 'utf8');
    }
  }
  if (res && typeof res.end === 'function') {
    res.end('OK');
  }
}
`;

  const targets = [
    path.resolve(projectRoot, 'build'),
    path.resolve(projectRoot, 'dist'),
    path.resolve(projectRoot, 'public'),
    path.resolve(projectRoot, 'artifacts/client-dashboard/build'),
    path.resolve(projectRoot, 'artifacts/client-dashboard/dist'),
    path.resolve(projectRoot, 'artifacts/client-dashboard/public'),
  ];

  const writeEntrypoints = (dir) => {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.js'), commonJsIndex);
    fs.writeFileSync(path.join(dir, 'index.cjs'), commonJsIndex);
    fs.writeFileSync(path.join(dir, 'index.mjs'), esmIndex);
    fs.writeFileSync(path.join(dir, 'app.js'), commonJsIndex);
    fs.writeFileSync(path.join(dir, 'server.js'), commonJsIndex);
  };

  for (const target of targets) {
    fs.mkdirSync(target, { recursive: true });
    if (target !== src) {
      fs.cpSync(src, target, { recursive: true, force: true });
    }
    writeEntrypoints(target);
  }
  writeEntrypoints(src);
  console.log('Successfully copied build assets and generated entrypoints.');
} else {
  console.error('Build directory not found in candidate paths:', candidateSrcs);
  process.exit(1);
}
