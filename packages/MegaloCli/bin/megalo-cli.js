#!/usr/bin/env node
// 上面一行很关键 这段话的意思是让使用 node 进行脚本的解释程序，那下面的就可以使用 node 的语法了

const program = require('commander');
const chalk = require('chalk');
const utils = require('./utils');
const watendVersion = require('../package.json').engines.node;

// 检测 node 版本是否符合规范
utils.checkNodeVersion(watendVersion, 'megalo-cli');

// 添加自定义 help 提示  megalo-cli --help
program
  .name(chalk.yellowBright('megalo-cli 脚手架'))
  .version(require('../package.json').version, '-v --version')
  .usage(chalk.blueBright('<command> [options]'));

program
  .command('create <template-name> <project-name>')
  .description('基于模板创建一个新的项目')
  .action((templateName, projectName) => {
    validateArgsLength(process.argv.length, 5);
    console.log(require('../lib/template/Creator'));
    require('../lib/template/easy-create')(
      lowerCase(templateName),
      projectName
    );
  });

program.parse(process.argv);

function validateArgsLength(curLength, length) {
  if (curLength > length) {
    console.log(chalk.red('\n 提示: 参数超过预期长度, 多余部分自动忽略'));
  }
}

function lowerCase(name) {
  return name.toLowerCase();
}
