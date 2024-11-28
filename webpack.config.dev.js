const path = require('path');

module.exports = {
  ...require('./webpack.config.js'),
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // dist 폴더를 static으로 제공
    },
    hot: true,
    port: 3000,
  },
  mode: 'development',
};
