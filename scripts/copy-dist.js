import fs from 'node:fs';
import path from 'node:path';

const src = path.resolve(process.cwd(), 'dist');

if (fs.existsSync(src)) {
  const targets = [
    path.resolve(process.cwd(), 'public'),
    path.resolve(process.cwd(), '../../dist'),
    path.resolve(process.cwd(), '../../public'),
  ];

  for (const target of targets) {
    fs.mkdirSync(target, { recursive: true });
    fs.cpSync(src, target, { recursive: true, force: true });
  }
  console.log('Successfully copied dist assets to all target build folders.');
} else {
  console.error('Build directory dist does not exist.');
}
