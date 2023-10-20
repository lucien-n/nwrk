import moment from "moment";
import chalk from "chalk";

const log = console.log;

const getTime = () => {
  return `[${moment().format("YYYY-MM-DD HH:mm:ss")}]`;
};

export const logger = {
  error: (...args: any[]) => {
    log(
      `${[chalk.bgRed(chalk.bold(" ERRO "))]} ${chalk.gray(getTime())}`,
      ...args
    );
  },

  warn: (...args: any[]) => {
    log(
      `${[chalk.bgYellow(chalk.bold(" WARN "))]} ${chalk.gray(getTime())}`,
      ...args
    );
  },

  info: (...args: any[]) => {
    log(
      `${[chalk.bgCyan(chalk.bold(" INFO "))]} ${chalk.gray(getTime())}`,
      ...args
    );
  },

  success: (...args: any[]) => {
    log(
      `${[chalk.bgGreenBright(chalk.bold(" SUCC "))]} ${chalk.gray(getTime())}`,
      ...args
    );
  },
};
