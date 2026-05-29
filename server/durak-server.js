const fs = require('fs');
const path = require('path');
const { FlatFile, Server } = require('boardgame.io/server');
const { createMatch } = require('boardgame.io/internal');
const { parseLauncherArgs } = require('../lib/launcherArgs');
const {
  DEFAULT_RULE_MODE,
  DEFAULT_SEAT_NAMES,
  GAME_NAME,
  PROFESSIONAL_MATCH_ID,
  RULE_MODES,
  STANDARD_MATCH_ID,
  durakGame,
} = require('../lib/durak/game');
const DEFAULT_PORT = parseInt(process.env.DURAK_PORT || '4001', 10);
const DEFAULT_HOST = process.env.DURAK_HOST || '0.0.0.0';
const DEFAULT_ORIGINS = (process.env.DURAK_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000,http://0.0.0.0:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const DEFAULT_DATA_DIR =
  process.env.DURAK_DATA_DIR || path.join(__dirname, 'data', 'durak');

function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function ensureDurakMatch(db, matchID, ruleMode) {
  const matches = await db.listMatches({ gameName: GAME_NAME });
  if (matches.includes(matchID)) return false;

  const setupData = { ruleMode };
  const match = createMatch({
    game: durakGame,
    numPlayers: 3,
    setupData,
    unlisted: false,
  });

  if ('setupDataError' in match) {
    throw new Error(match.setupDataError);
  }

  const metadata = match.metadata;
  metadata.setupData = setupData;
  metadata.players = metadata.players || {};

  for (let index = 0; index < 3; index += 1) {
    metadata.players[index] = {
      ...metadata.players[index],
      id: index,
      name: DEFAULT_SEAT_NAMES[index] || `Игрок ${index + 1}`,
    };
  }

  await db.createMatch(matchID, {
    initialState: match.initialState,
    metadata,
  });

  return true;
}

async function ensureDurakMatches(db) {
  const standardCreated = await ensureDurakMatch(db, STANDARD_MATCH_ID, DEFAULT_RULE_MODE);
  const professionalCreated = await ensureDurakMatch(db, PROFESSIONAL_MATCH_ID, 'Professional');

  console.log(
    `> Durak matches ready: ${STANDARD_MATCH_ID}${standardCreated ? ' (created)' : ' (existing)'}, ${PROFESSIONAL_MATCH_ID}${professionalCreated ? ' (created)' : ' (existing)'}`
  );
}

async function startDurakServer(options = {}) {
  const launchOptions = parseLauncherArgs();
  const resolvedOptions = {
    port: options.port || launchOptions.port || DEFAULT_PORT,
    host: options.host || launchOptions.host || DEFAULT_HOST,
    dataDir: options.dataDir || launchOptions.dataDir || DEFAULT_DATA_DIR,
    origins: options.origins || launchOptions.origins || DEFAULT_ORIGINS,
  };

  const port = parseInt(resolvedOptions.port, 10);
  const host = resolvedOptions.host;
  const displayHost = host === '0.0.0.0' ? 'localhost' : host;
  const origins = Array.isArray(resolvedOptions.origins)
    ? resolvedOptions.origins
    : String(resolvedOptions.origins)
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
  const dataDir = resolvedOptions.dataDir;

  ensureDirectory(dataDir);
  console.log('> Durak server boot');
  console.log(`> host: ${host}`);
  console.log(`> port: ${port}`);
  console.log(`> origins: ${origins.join(', ')}`);
  console.log(`> dataDir: ${dataDir}`);

  const db = new FlatFile({ dir: dataDir });
  await db.connect();
  await ensureDurakMatches(db);

  const bgServer = Server({
    games: [durakGame],
    db,
    origins,
    apiOrigins: origins,
    authenticateCredentials: () => true,
  });

  const servers = await bgServer.run({ port });

  console.log(`> Durak websocket server listening on ws://${displayHost}:${port}/${GAME_NAME}`);
  console.log(`> Durak persistence: ${dataDir}`);

  return {
    ...servers,
    db,
    stop: async () => {
      if (servers.apiServer) {
        servers.apiServer.close();
      }
      if (servers.appServer) {
        servers.appServer.close();
      }
    },
  };
}

module.exports = {
  DEFAULT_DATA_DIR,
  DEFAULT_HOST,
  DEFAULT_ORIGINS,
  DEFAULT_PORT,
  PROFESSIONAL_MATCH_ID,
  STANDARD_MATCH_ID,
  ensureDurakMatch,
  ensureDurakMatches,
  startDurakServer,
};
