const { startSpinner, stopSpinner } = require('../utils/spinner');
const templateGitRepo = require('../config/templateGitRepo.json');
const chalk = require('chalk');
const program = require('commander');
const path = require('path');
const validatePackageName = require('validate-npm-package-name');
const fs = require('fs');
const inquirer = require('inquirer');
const { exec } = require('child_process');
const Creator = require('./Creator');

// 流程: 校验模板是否存在 -> 获取创建项目的目录 -> 校验包名是否符合npm包名规范 -> 判断目录是否存在
async function create(templateName, projectName) {
  // 校验模板是否存在
  if (!templateGitRepo[templateName]) {
    console.log();
    console.log(chalk.red(`未找到${templateName}模板`));
    console.log();
    program.outputHelp();
    return;
  }

  // 获取 node 进程工种目录
  const cwd = process.cwd();
  // 判断是否是当期目录
  const isCurrentDir = projectName === '.';
  // 获取项目名
  const name = isCurrentDir ? path.relative('../', cwd) : projectName;
  // 正真的目录地址
  const targetDir = path.resolve(cwd, projectName);
  // 校验项目名(包名)是否合法
  const validateErr = validatePackageName(name);
  if (!validateErr.validForNewPackages) {
    // 打印错误
    console.error(chalk.red(`不合法的包名: ${name}`));
    validateErr.errors &&
      validateErr.errors.forEach((error) => {
        console.error(chalk.red.dim.italic(`Error: ${error}`));
      });
    validateErr.warnings &&
      validateErr.warnings.forEach((error) => {
        console.error(chalk.red.dim.italic(`Error: ${error}`));
      });
    process.exit(1);
  }

  // 同步的方法检测目录是否存在。
  // 2种情况: 1.已经存在目录 2.目录重新创建
  if (fs.existsSync(targetDir)) {
    if (isCurrentDir) {
      // 当前目录创建
      const { ok } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'ok',
          message: `确定当前目录生成项目: ${name}`,
          default: true
        }
      ]);
      if (!ok) return;
    } else {
      // 目录已经存在
      // 判断是否执行三种操作: 覆盖(删除) 合并 取消
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: '请选择需要的操作',
          choices: [
            { name: '覆盖', value: 'overwrite' },
            { name: '合并', value: 'merge' },
            { name: '取消', value: 'cancel' }
          ],
          filter(val) {
            return val.toLowerCase();
          }
        }
      ]);

      if (action === 'cancel') return;
      else if (action === 'overwrite') {
        console.log(`\n 删除文件夹: ${targetDir}`);
        await exec(`rm -rf ${targetDir}`);
      }
    }
  }

  // 需要重新创建 提供用户提示
  process.env.MEGALO_CLI_TEMPLATE_NAME = templateName;
  const creator = new Creator(name, targetDir);
  await creator.create();
}

module.exports = (templateName, projectName) => {
  return create(templateName, projectName).catch((e) => {
    stopSpinner();
    console.log(e);
    process.exit(1);
  });
};
