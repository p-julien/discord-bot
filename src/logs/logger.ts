import chalk from 'chalk';

export class Logger {
  static info(message: any) {
    const datetime = getDate();
    const level = chalk.bgGreen.whiteBright.bold(' I ');
    console.log(`${datetime} ${level} ${chalk.green(message)}`);
  }

  static verbose(message: any) {
    const datetime = getDate();
    const level = chalk.bgBlue.whiteBright.bold(' D ');
    console.log(`${datetime} ${level} ${chalk.blue(message)}`);
  }

  static error(error: any) {
    const datetime = getDate();
    const level = chalk.bgRed.whiteBright.bold(' E ');

    if (error.stack === undefined)
      return console.error(`${datetime} ${level} ${chalk.red(error)}`);

    console.error(`${datetime} ${level} ${chalk.red(error.stack)}`);
  }
}

const getDate = () => chalk.grey(`[${new Date().toLocaleString()}]`);
