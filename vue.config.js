const FontminPlugin = require('fontmin-webpack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const _ = require('lodash')
const path = require('path');
const VERSION = '1.0.0'
const BUILD_TYPE = 'PROD'
const isProduction = process.env.NODE_ENV === 'production'
let config = {
  runtimeCompiler: true,
  configureWebpack: {
    resolve:{
      alias:{
        '@':path.resolve(__dirname, './src'),
        '@i':path.resolve(__dirname, './src/assets'),
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        VERSION: "'" + VERSION +"'",
        BUILD_TYPE: "'" + BUILD_TYPE +"'",
      }),
      new FontminPlugin({
        autodetect: true, // automatically pull unicode characters from CSS
        glyphs: [/* extra glyphs to include */],
      }),
      new CaseSensitivePathsPlugin(),
      new LodashModuleReplacementPlugin({
        shorthands: true,
        paths: true,
        collections: true,
        coercions: true
      }),
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      // 配置compression-webpack-plugin压缩
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8,
      })
    ]
  }
}

if(process.env.NODE_ENV === 'production') {
  config = _.merge(config, {
    outputDir: 'dist/' + VERSION,
    publicPath: "/",
    productionSourceMap: false,
    configureWebpack: {
      optimization: {
        minimizer: [
          new TerserPlugin({
            sourceMap: false, // Must be set to true if using source-maps in production
            terserOptions: {
              compress: {
                drop_console: false,
              },
            },
          }),
        ],
      },
    }
  })
}
module.exports = config