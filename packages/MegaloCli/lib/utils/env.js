const { execSync } = require('child_process');
const LRU = require('lru-cache');

let _hasGit;
const _projectGit = new LRU({
  max: 10, // 缓存大小
  maxAge: 1000 // 缓存时间
});

exports.hasGit = () => {
  if (_hasGit) return _hasGit;

  try {
    execSync('git --version', { stdio: 'ignore' });
    return (this.hasGit = true);
  } catch (error) {
    return (_hasGit = false);
  }
};

exports.hasProjectGit = (cwd) => {
  if (_projectGit.has(cwd)) {
    return _projectGit.get(cwd);
  }
  let result;
  try {
    execSync('git status', { stdio: 'ignore', cwd });
    result = true;
  } catch (error) {
    result = false;
  }

  _projectGit.set(cwd, result);

  return result;
};
