import chalk from 'chalk';

export const colors = {
  GREEN: chalk.green,
  RED: chalk.red,
  YELLOW: chalk.yellow,
  NC: (text: string) => text // No color (for consistency with original script)
};