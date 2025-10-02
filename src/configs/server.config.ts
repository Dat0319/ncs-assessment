import newrelic from 'newrelic';
import logger from '../utils/logger';

export default function (): void {
  const others = [
    'SIGINT',
    'SIGTERM',
    'uncaughtException',
    'unhandledRejection',
  ];
  others.forEach((eventType) => {
    process.on(eventType, exitRouter);
  });

  async function exitRouter(exitCode) {
    if (exitCode.stack) {
      logger.error(exitCode.stack);
    } else {
      logger.info(`[System] ExitCode ${exitCode}.`);
      return process.exit();
    }

    newrelic.shutdown({ collectPendingData: true }, () => {
      process.exit();
    });
  }

  function exitHandler(exitCode: number) {
    logger.info(`[System] ExitCode ${exitCode}.`);
    logger.info('[System] Exiting finally.');
  }

  process.on('exit', exitHandler);
}
