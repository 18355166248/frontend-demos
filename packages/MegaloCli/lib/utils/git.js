const request = require('request');
const inquirer = require('inquirer');
const { stopSpinner } = require('./spinner');

/**
 * 获取github分支列表
 * @param {项目} name 用户名/项目名
 */
const getGitBranches = function (name) {
  return new Promise((resolve, reject) => {
    if (!name || typeof name !== 'string')
      reject('getGitBranches 的 name 不能为空');
    request(
      {
        url: `https://api.github.com/repos/${name}/branches`,
        method: 'get',
        headers: {
          'content-type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36'
        }
      },
      (err, response, body) => {
        if (!err && response && response.statusCode == 200) {
          body = JSON.parse(body);
          if (Array.isArray(body)) {
            return resolve(
              body.filter((item) => !item.name.startsWith('dependabot/'))
            );
          }
          return reject(response);
        }

        return reject(err);
      }
    );
  });
};

// 选择分支
exports.selectBranches = async function (name) {
  return new Promise((resolve, reject) => {
    return getGitBranches(name)
      .then(async (res) => {
        res = res.map((item) => item.name);
        // 可视化选择分支
        stopSpinner();
        const { action } = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: '请选择需要下载的分支',
            choices: res,
            filter(val) {
              return val.toLowerCase();
            }
          }
        ]);

        resolve(action);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
