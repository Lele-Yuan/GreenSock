const path = require('path');

module.exports = {
  entry: {
    // headlight: './src/heatlight/headlight_gsap.js',
    // car: './src/car/car_gsap.js',
    // a6_avant: './src/a6_avant/car_gsap.js'
    // sq7_electric: './src/sq7/electric/index.js',
    // sq7_carface: './src/sq7/carface/index.js'
    // homepage: './src/indexPage/index.js'
    form: './src/form/index.js'
  }, //打包入口文件(如果是单个入口就是字符串，如果是多个入口就需要配置成对象)
  output: { //打包输出文件
      path: path.join(__dirname, 'dist'),
      filename: 'audi-[name].js'
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.js$/,
  //       exclude: /node_modules/,
  //       use: {
  //         loader: 'babel-loader', // 如果你的代码使用了ES6+语法，你可能需要babel-loader
  //       },
  //     },
  //   ],
  // },
  // resolve: {
  //   extensions: ['.js'], // 自动解析确定的扩展
  // },
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