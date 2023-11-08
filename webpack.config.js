const path = require('path');

module.exports = {
  entry: {
    headlight: './src/heatlight/headlight_gsap.js',
    car: './src/car/car_gsap.js',
    a6_avant: './src/a6_avant/car_gsap.js'
  }, //打包入口文件(如果是单个入口就是字符串，如果是多个入口就需要配置成对象)
  output: { //打包输出文件
      path: path.join(__dirname, 'dist'),
      filename: 'audi-[name].js'
  },
  // output: {
  //   path: path.resolve(__dirname, 'dist'),
  //   filename: 'audi-headlight.js',
  // },
  devServer: {
    // static: {
    //     directory: path.join(__dirname, 'public'),
    // },
    // compress: true,
    static: './',
    port: '5173'
  }
};