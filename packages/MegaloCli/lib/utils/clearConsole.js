const { clearConsole } = require('./logger');

let local = require('../../package.json').version;

exports.clearConsole = function (checUpdate) {
  clearConsole(local);
};
