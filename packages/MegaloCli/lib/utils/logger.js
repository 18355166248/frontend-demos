const chalk = require('chalk');
const readline = require('readline');

function format(label, msg) {
  return `\n${label}\n${msg}`;
}

exports.clearConsole = (title) => {
  // Node.js 是否在终端上下文中运行 ( 判断是否是在终端环境 )
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank);
    // 在终端移动光标到标准输出流的起始坐标位置, 然后清除给定的TTY流
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    if (title) {
      console.log(title);
    }
  }
};

exports.log = (msg) => {
  console.log(msg);
};

exports.error = (msg) => {
  console.error(format(chalk.bgRed('ERROR'), chalk.red(msg)));
};

exports.warn = (msg, tag) => {
  console.warn(
    format(
      chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''),
      chalk.yellow(msg)
    )
  );
};
