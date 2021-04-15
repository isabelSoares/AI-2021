const electronConfigs = require('./webpack.electron.js');
const reactConfigs = require('./webpack.react.js');
const path = require("path");

module.exports = [
  electronConfigs,
  reactConfigs
];