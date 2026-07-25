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

  const targets = [
    path.resolve(projectRoot, 'build'),
    path.resolve(projectRoot, 'dist'),
    path.resolve(projectRoot, 'public'),
    path.resolve(projectRoot, 'artifacts/client-dashboard/build'),
    path.resolve(projectRoot, 'artifacts/client-dashboard/dist'),
    path.resolve(projectRoot, 'artifacts/client-dashboard/public'),
  ];

  for (const target of targets) {
    fs.mkdirSync(target, { recursive: true });
    if (target !== src) {
      fs.cpSync(src, target, { recursive: true, force: true });
    }
  }
  console.log('Successfully copied build assets to all target build folders.');
} else {
  console.error('Build directory not found in candidate paths:', candidateSrcs);
  process.exit(1);
}
