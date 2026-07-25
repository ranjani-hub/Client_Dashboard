import fs from 'node:fs';
import path from 'node:path';

const src = path.resolve(process.cwd(), 'build');

if (fs.existsSync(src)) {
  const targets = [
    path.resolve(process.cwd(), 'dist'),
    path.resolve(process.cwd(), 'public'),
    path.resolve(process.cwd(), '../../build'),
    path.resolve(process.cwd(), '../../dist'),
    path.resolve(process.cwd(), '../../public'),
  ];

  const dummyIndex = `// Static Vercel entrypoint fallback
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
`;

  for (const target of targets) {
    if (target !== src) {
      fs.mkdirSync(target, { recursive: true });
      fs.cpSync(src, target, { recursive: true, force: true });
      fs.writeFileSync(path.join(target, 'index.js'), dummyIndex);
    }
  }
  fs.writeFileSync(path.join(src, 'index.js'), dummyIndex);
  console.log('Successfully copied build assets to all target build folders.');
} else {
  console.error('Build directory build does not exist.');
}
