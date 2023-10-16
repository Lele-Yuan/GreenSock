const path = require('path');

module.exports = {
  entry: './src/headlight_gsap.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'audi-headlight.js',
  },
  devServer: {
    // static: {
    //     directory: path.join(__dirname, 'public'),
    // },
    // compress: true,
    static: './',
    port: '5173'
  }
};