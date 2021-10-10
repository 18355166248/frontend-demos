const ora = require('ora');
const chalk = require('chalk');
const { red } = require('chalk');

const spinner = ora({
  color: 'green'
});

let lastMsg = null;

exports.startSpinner = (symbol, msg) => {
  if (!msg) {
    msg = symbol;
    symbol = chalk.green('√');
  }
  if (lastMsg) {
    // 清除上次的spinner
    spinner.stop();
  }

  spinner.text = msg;
  lastMsg = {
    symbol,
    text: msg
  };
  spinner.start();
};

exports.stopSpinner = () => {
  spinner.stop();
};
