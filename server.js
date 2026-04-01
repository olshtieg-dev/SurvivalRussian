const http = require('http');
const next = require('next');
const { attachChatSocketServer } = require('./chatSocketServer');

const port = parseInt(process.env.PORT || '3000', 10);
const host = process.env.HOST || '::';
const displayHost = host === '::' ? 'localhost' : host;
const dev =
  process.env.NODE_ENV !== 'production' && process.env.npm_lifecycle_event !== 'start';
const useWebpack = process.env.NEXT_FORCE_WEBPACK === '1';

const app = next({
  dev,
  hostname: host,
  port,
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
});
