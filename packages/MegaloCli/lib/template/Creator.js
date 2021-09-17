const EventEmitter = require('events');
const { readTemplateJson } = require('../utils/readTemplateJson.js');

module.exports = class Creator extends EventEmitter {
  constructor(name, projectName) {
    super();
    this.name = name; // 目录名
    this.context = process.env.MEGALO_CLI_CONTEXT = projectName; // 目录路径
    console.log(123, name, projectName);
  }

  async create() {
    const { name, context } = this;
    const templateJSON = readTemplateJson();
    const gitRepoUrl = templateJSON[process.env.MEGALO_CLI_TEMPLATE_NAME];
    console.log(gitRepoUrl);
  }
};
