const EventEmitter = require('events');
const chalk = require('chalk');
const { readTemplateJson } = require('../utils/readTemplateJson.js');
const { clearConsole } = require('../utils/clearConsole');
const { log, error, warn } = require('../utils/logger');
const { stopSpinner, startSpinner } = require('../utils/spinner.js');
const fetchRemotePreset = require('../utils/loadRemotePreset');
const fs = require('fs-extra');
const execa = require('execa');
const { selectBranches } = require('../utils/git');
const { hasGit, hasProjectGit } = require('../utils/env.js');

module.exports = class Creator extends EventEmitter {
  constructor(name, projectName) {
    super();
    this.name = name; // 目录名
    this.context = process.env.MEGALO_CLI_CONTEXT = projectName; // 目录路径
  }

  // 创建项目
  async create() {
    const { name, context } = this;
    const templateJSON = readTemplateJson(); // 读取模板数据
    const gitRepoUrl = templateJSON[process.env.MEGALO_CLI_TEMPLATE_NAME]; // 获取模板的请求地址配置
    let tmpdir, branch;
    await clearConsole(); // 清空终端
    log(`🔆 ${chalk.yellow(this.context)} 下创建项目`);

    // Todo: 获取git模板分支 只支持github
    try {
      stopSpinner();
      startSpinner('🔪', '正在获取分支....');
      branch = await selectBranches(gitRepoUrl.download);
    } catch (e) {
      stopSpinner();
      error(chalk.red(e));
      throw e;
    }

    // 下载模板
    try {
      stopSpinner();
      startSpinner('🔪', '正在下载模板....');

      tmpdir = await fetchRemotePreset(`${gitRepoUrl.download}#${branch}`);
    } catch (e) {
      stopSpinner();
      error(`git下载失败: ${chalk.cyan(gitRepoUrl.download)}`);
      throw e;
    }

    // 拷贝下载的模板到 context 文件夹下
    try {
      fs.copySync(tmpdir, context);
    } catch (err) {
      return console.error(chalk.red.dim(`Error: ${e}`)); // chalk.dim 暗一点的颜色
    }

    // git初始化
    const shouldInitGit = this.shouldInitGit();

    // 拉取好代码初始化git
    if (shouldInitGit) {
      stopSpinner();
      startSpinner('🍁', '初始化 git ');
      await this.run('git init');
    }

    let gitCommitFailed = false;
    // 提交第一个commit
    if (shouldInitGit) {
      await this.run('git add -A');
      try {
        await this.run('git', ['commit', '-m', 'feat: init']);
      } catch (error) {
        gitCommitFailed = true;
      }
    }

    stopSpinner();
    log(`🌹 ${name} 项目创建成功!!!`);

    if (gitCommitFailed) {
      warn(
        'Skipped git commit due to missing username and email in git config.\n' +
          'You will need to perform the initial commit yourself.\n'
      );
    }
  }

  run(command, args) {
    if (!args) {
      [command, ...args] = command.split(/\s+/);
    }
    return execa(command, args, { cwd: this.context });
  }

  shouldInitGit() {
    if (!hasGit) return false;
    return !hasProjectGit(this.context);
  }
};
