const { spawn } = require('child_process');

const nextPort = process.env.PORT || '3000';
const chatPort = process.env.CHAT_PORT || '3001';
const host = process.env.HOST || '0.0.0.0';

function spawnChild(command, args, extraEnv = {}) {
  return spawn(command, args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      ...extraEnv,
    },
  });
}

const nextProcess = spawnChild(
  'npx',
  ['next', 'dev', '--webpack', '--hostname', host, '--port', nextPort],
  {
    NEXT_PUBLIC_CHAT_WS_PORT: chatPort,
  }
);

const chatProcess = spawnChild('node', ['chat-server.js'], {
  CHAT_PORT: chatPort,
  CHAT_HOST: host,
});

let shuttingDown = false;

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of [nextProcess, chatProcess]) {
    if (child && !child.killed) {
      child.kill('SIGINT');
    }
  }

  setTimeout(() => {
    process.exit(exitCode);
  }, 300);
}

nextProcess.on('exit', (code) => {
  shutdown(code ?? 0);
});

chatProcess.on('exit', (code) => {
  shutdown(code ?? 0);
});

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
