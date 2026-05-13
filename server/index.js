const { startDurakServer } = require('./durak-server');

startDurakServer().catch((error) => {
  console.error('Failed to start Durak server:', error);
  process.exit(1);
});
