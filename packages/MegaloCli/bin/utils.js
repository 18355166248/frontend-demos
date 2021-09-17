const semver = require('semver');
const chalk = require('chalk');

function checkNodeVersion(wanted, cliName) {
  const is = semver.satisfies(process.version, wanted);
  if (!is) {
    console.log(
      chalk.red(
        `当前 node 版本是 ${process.version}, 但是 ${cliName} 脚手架要求的Node版本 ${wanted}, 请更新你的版本`
      )
    );
    process.exit(1);
  }
}

module.exports = {
  checkNodeVersion
};
