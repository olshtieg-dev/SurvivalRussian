const { spawn } = require('child_process');

const nodeBinary = process.env.NODE_BINARY || 'node.exe';
const port = process.env.PORT || '3000';
const host = process.env.HOST || '0.0.0.0';
const distDir = process.env.NEXT_DIST_DIR || '.next-wsl';
const durakPort = process.env.DURAK_PORT || '4001';
const appOrigin = `http://localhost:${port}`;

let shuttingDown = false;
const children = [];

console.log('> WSL merged launcher');
console.log(`> node: ${nodeBinary}`);
console.log(`> app host: ${host}`);
console.log(`> app port: ${port}`);
console.log(`> app distDir: ${distDir}`);
console.log(`> durak port: ${durakPort}`);

function spawnChild(label, args) {
  console.log(`> starting ${label}...`);

  const child = spawn(nodeBinary, args, {
    stdio: 'inherit',
    shell: false,
  });

  child.on('error', (error) => {
    console.error(`Failed to start ${label}:`, error.message);
    shutdown(1);
  });

  child.on('exit', (code, signal) => {
    if (shuttingDown) return;

    const reason = signal ? `signal ${signal}` : `code ${code ?? 0}`;
    console.error(`> ${label} exited unexpectedly (${reason})`);
    shutdown(code ?? 1);
  });

  children.push(child);
  return child;
}

spawnChild('app', ['server.js', '--port', port, '--host', host, '--distDir', distDir, '--forceWebpack']);
spawnChild('durak', [
  'server/index.js',
  '--port',
  durakPort,
  '--host',
  '0.0.0.0',
  '--origins',
  `${appOrigin},http://127.0.0.1:${port},http://0.0.0.0:${port}`,
]);

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (child && !child.killed) {
      child.kill('SIGINT');
    }
  }

  setTimeout(() => {
    process.exit(exitCode);
  }, 300);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
