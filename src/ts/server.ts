import cluster from 'cluster'
import { cpus } from 'os'
import startApp from './app'

/* const numCPUs = cpus().length
if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    cluster.fork();
  });
} else {
  startApp(+(process.env.APP_PORT as string) + (cluster.worker!.id) - 1);
} */

startApp(3000)