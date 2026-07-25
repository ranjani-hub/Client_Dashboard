// Static / Serverless Vercel entrypoint fallback
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function handler(req, res) {
  const htmlPath = path.resolve(__dirname, 'index.html');
  if (fs.existsSync(htmlPath)) {
    res.setHeader('Content-Type', 'text/html');
    return res.end(fs.readFileSync(htmlPath, 'utf8'));
  }
  res.end('OK');
}
