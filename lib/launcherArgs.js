function coerceValue(value) {
  if (value === undefined) return '';
  return String(value);
}

function splitList(value) {
  return coerceValue(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseLauncherArgs(argv = process.argv.slice(2)) {
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg || !arg.startsWith('--')) {
      continue;
    }

    const [flag, inlineValue] = arg.split(/=(.*)/s, 2);
    const readValue = () => {
      if (inlineValue !== undefined) {
        return inlineValue;
      }

      const next = argv[index + 1];
      if (next && !next.startsWith('--')) {
        index += 1;
        return next;
      }

      return '';
    };

    switch (flag) {
      case '--port':
        options.port = readValue();
        break;
      case '--host':
        options.host = readValue();
        break;
      case '--distDir':
        options.distDir = readValue();
        break;
      case '--dataDir':
        options.dataDir = readValue();
        break;
      case '--origins':
        options.origins = splitList(readValue());
        break;
      case '--origin':
        options.origins = [...(options.origins || []), coerceValue(readValue()).trim()].filter(Boolean);
        break;
      case '--forceWebpack':
      case '--webpack':
        options.forceWebpack = true;
        break;
      case '--dev':
        options.dev = true;
        break;
      default:
        break;
    }
  }

  return options;
}

module.exports = {
  parseLauncherArgs,
  splitList,
};
