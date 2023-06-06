const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const startApp = require('./app');

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    cluster.fork();
  });
} else {
  startApp(+process.env.APP_PORT + cluster.worker.id - 1);
}
