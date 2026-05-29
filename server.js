const http = require('http');
const next = require('next');
const { attachChatSocketServer } = require('./chatSocketServer');
const { parseLauncherArgs } = require('./lib/launcherArgs');

const launchOptions = parseLauncherArgs();
const port = parseInt(launchOptions.port || process.env.PORT || '3000', 10);
const host = launchOptions.host || process.env.HOST || '::';
const displayHost = host === '::' ? 'localhost' : host;
const distDir = launchOptions.distDir || process.env.NEXT_DIST_DIR || '.next';
const dev =
  process.env.NODE_ENV !== 'production' && process.env.npm_lifecycle_event !== 'start';
const useWebpack = launchOptions.forceWebpack || process.env.NEXT_FORCE_WEBPACK === '1';

console.log('> Next dev server boot');
console.log(`> host: ${displayHost}`);
console.log(`> port: ${port}`);
console.log(`> dev mode: ${dev ? 'yes' : 'no'}`);
console.log(`> distDir: ${distDir}`);
console.log(`> webpack override: ${useWebpack ? 'enabled' : 'disabled'}`);

const app = next({
  dev,
  hostname: host,
  port,
  distDir,
  ...(useWebpack ? { webpack: true } : {}),
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  attachChatSocketServer(server, {
    fallbackUpgradeHandler: app.getUpgradeHandler(),
  });

  server.listen(port, host, () => {
    console.log(`> Ready on http://${displayHost}:${port}`);
    console.log(`> Chat socket listening at ws://${displayHost}:${port}/ws/chat`);
  });

  // Start the Durak websocket server in-process so online play works under
  // `npm run dev`. dev-wsl.js runs its own standalone instance and sets
  // DURAK_EXTERNAL=1 to skip this embedded one (avoids a port clash on 4001).
  if (process.env.DURAK_EXTERNAL !== '1') {
    const { startDurakServer } = require('./server/durak-server');
    const appOrigin = `http://${displayHost}:${port}`;
    startDurakServer({
      origins: [appOrigin, `http://127.0.0.1:${port}`, `http://localhost:${port}`],
    }).catch((error) => {
      console.error('> Durak server failed to start (online play disabled):', error.message);
    });
  }
});
