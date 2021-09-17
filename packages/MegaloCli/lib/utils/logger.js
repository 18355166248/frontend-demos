exports.clearConsole = (title) => {
  // Node.js 是否在终端上下文中运行 ( 判断是否是在终端环境 )
  if (process.stdout.isTTY) {
    console.log(process.stdout.rows);
  }
};
