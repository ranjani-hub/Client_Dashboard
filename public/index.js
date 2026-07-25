// Static Vercel entrypoint fallback
import fs from 'node:fs';
import path from 'node:path';

export default function handler(req, res) {
  const htmlPath = path.resolve(process.cwd(), 'index.html');
  if (fs.existsSync(htmlPath)) {
    res.setHeader('Content-Type', 'text/html');
    return res.end(fs.readFileSync(htmlPath, 'utf8'));
  }
  res.end('OK');
}
