const { spawn } = require('child_process');

const port = process.env.PORT || '3000';
const host = process.env.HOST || '0.0.0.0';

const child = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: port,
    HOST: host,
    NEXT_FORCE_WEBPACK: '1',
  },
});

child.on('error', (error) => {
  console.error('Failed to start WSL dev server:', error.message);
  process.exitCode = 1;
});

let shuttingDown = false;

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  if (child && !child.killed) {
    child.kill('SIGINT');
  }

  setTimeout(() => {
    process.exit(exitCode);
  }, 300);
}

child.on('exit', (code) => {
  shutdown(code ?? 0);
});

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
