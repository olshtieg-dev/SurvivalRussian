const http = require('http');
const { WebSocketServer, WebSocket } = require('ws');

const MAX_MESSAGE_LENGTH = 512;
const HEARTBEAT_WINDOW_MS = 30000;
const HISTORY_LIMIT = 40;
const CHAT_PATHNAME = '/ws/chat';

function createClientId() {
  return Math.random().toString(36).slice(2, 8);
}

function createEventKey(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function sanitizeText(raw) {
  if (typeof raw !== 'string') return '';
  return raw.replace(/\r/g, '').slice(0, MAX_MESSAGE_LENGTH);
}

function createChatSocketLayer() {
  const clients = new Set();
  const history = [];
  const wss = new WebSocketServer({ noServer: true });

  function sendJson(ws, payload) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  }

  function broadcast(payload) {
    const serialized = JSON.stringify(payload);

    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(serialized);
      }
    }
  }

  function appendHistoryEntry(entry) {
    history.push(entry);

    if (history.length > HISTORY_LIMIT) {
      history.shift();
    }
  }

  function broadcastPresence() {
    broadcast({ type: 'presence', count: clients.size });
  }

  function createSystemEntry(systemType, id) {
    return {
      type: 'system',
      key: createEventKey(systemType),
      systemType,
      id,
      sentAt: Date.now(),
    };
  }

  function disconnectClient(ws) {
    if (!clients.has(ws)) return;

    clients.delete(ws);

    const leaveEntry = createSystemEntry('leave', ws.id);
    appendHistoryEntry(leaveEntry);
    broadcast({ type: 'leave', id: ws.id, sentAt: leaveEntry.sentAt });
    broadcast(leaveEntry);
    broadcastPresence();
  }

  wss.on('connection', (ws) => {
    ws.id = createClientId();
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    clients.add(ws);
    sendJson(ws, {
      type: 'hello',
      id: ws.id,
      presenceCount: clients.size,
      history,
    });
    broadcastPresence();

    const joinEntry = createSystemEntry('join', ws.id);
    appendHistoryEntry(joinEntry);
    broadcast(joinEntry);

    ws.on('message', (raw) => {
      let data;

      try {
        data = JSON.parse(raw.toString());
      } catch (error) {
        sendJson(ws, { type: 'error', message: 'Invalid payload.' });
        return;
      }

      if (data.type === 'draft') {
        broadcast({
          type: 'draft',
          id: ws.id,
          text: sanitizeText(data.text),
        });
        return;
      }

      if (data.type === 'commit') {
        const text = sanitizeText(data.text).trim();

        if (!text) return;

        const entry = {
          type: 'commit',
          key: createEventKey('commit'),
          id: ws.id,
          text,
          sentAt: Date.now(),
        };

        appendHistoryEntry(entry);
        broadcast(entry);
        broadcast({
          type: 'draft',
          id: ws.id,
          text: '',
        });
      }
    });

    ws.on('close', () => disconnectClient(ws));
    ws.on('error', () => disconnectClient(ws));
  });

  const heartbeatInterval = setInterval(() => {
    for (const ws of clients) {
      if (ws.isAlive === false) {
        ws.terminate();
        continue;
      }

      ws.isAlive = false;
      ws.ping();
    }
  }, HEARTBEAT_WINDOW_MS);

  wss.on('close', () => clearInterval(heartbeatInterval));

  function handleUpgrade(req, socket, head) {
    let pathname = '';

    try {
      pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
    } catch (error) {
      socket.destroy();
      return false;
    }

    if (pathname !== CHAT_PATHNAME) {
      return false;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });

    return true;
  }

  function close(done) {
    clearInterval(heartbeatInterval);
    wss.close(() => {
      if (done) done();
    });
  }

  return {
    handleUpgrade,
    close,
  };
}

function attachChatSocketServer(server, options = {}) {
  const { fallbackUpgradeHandler } = options;
  const chatLayer = createChatSocketLayer();

  server.on('upgrade', (req, socket, head) => {
    if (chatLayer.handleUpgrade(req, socket, head)) {
      return;
    }

    if (fallbackUpgradeHandler) {
      fallbackUpgradeHandler(req, socket, head);
      return;
    }

    socket.destroy();
  });

  return chatLayer;
}

function startStandaloneChatServer(options = {}) {
  const port = parseInt(options.port || process.env.CHAT_PORT || process.env.PORT || '3001', 10);
  const host = options.host || process.env.CHAT_HOST || process.env.HOST || '0.0.0.0';
  const displayHost = host === '::' ? 'localhost' : host;
  const server = http.createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('ok');
      return;
    }

    res.writeHead(426, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Upgrade Required');
  });

  const chatLayer = attachChatSocketServer(server);

  server.listen(port, host, () => {
    console.log(`> Chat socket listening at ws://${displayHost}:${port}${CHAT_PATHNAME}`);
  });

  return {
    close(done) {
      chatLayer.close(() => {
        server.close(() => {
          if (done) done();
        });
      });
    },
    server,
  };
}

module.exports = {
  CHAT_PATHNAME,
  attachChatSocketServer,
  startStandaloneChatServer,
};
