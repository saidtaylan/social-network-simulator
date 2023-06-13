import cluster from 'cluster'
//import { cpus } from 'os'

export const clusterify = (startApp: (APP_PORT: number) => void, APP_PORT: number) => {

  //const numCPUs = cpus().length
  if (cluster.isPrimary) {
    for (let i = 0; i < 1; i += 1) {
      cluster.fork();
    }

    cluster.on('exit', () => {
      cluster.fork();
    });
  } else {
    startApp(APP_PORT + (cluster.worker?.id || 1) - 1)
  }
}