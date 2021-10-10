const fs = require('fs-extra');
const chalk = require('chalk');

// The repository parameter defaults to the master branch, but you can specify a branch or tag as a URL fragment like owner/name#my-branch. Feel free to submit an issue or pull request for additional host options.
module.exports = async function fetchRemotePreset(name, clone = false) {
  const os = require('os');
  const path = require('path');
  const download = require('download-git-repo');

  // 生成临时目录 os.tmpdir() 用于获取操作系统临时文件的默认目录路径
  const tmpdir = path.resolve(os.tmpdir(), 'megali-cli');
  if (clone) {
    await fs.remove();
  }
  return new Promise((resolve, reject) => {
    download(name, tmpdir, { clone }, (err) => {
      if (err) return reject(err);
      return resolve(tmpdir);
    });
  });
};
