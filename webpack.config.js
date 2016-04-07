const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

const PATHS = {
  //React: path.join(__dirname, 'node_modules/react/dist/react.min.js'),
  //ReactDOM: path.join(__dirname, 'node_modules/react/lib/react-dom.min.js'),
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
  style: path.join(__dirname, 'app/main.css')
}

var config = {
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack demo',
      inject: 'body',
      template: 'index.ejs'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: PATHS.app
      },
      {
        test: /\.jsx?$/,
        loader: 'babel?cacheDirectory',
        /*query: {
          cacheDirectory: true,
          presets: ['react', 'es2015', 'survivejs-kanban']
        },*/
        /*loaders: [
          'babel?cacheDirectory,presets[]=react,presets[]=es2015,presets[]=survivejs-kanban'
        ],*/
        include: PATHS.app
      }
    ]
  },
}

switch (TARGET) {
  case 'start':
    Object.assign(config, {
      devServer: {
        contentBase: PATHS.build,
        // Enable history API fallback so HTML5 History API based
        // routing works. This is a good default that will come
        // in handy in more complicated setups.
        historyApiFallback: true,
        devtool: 'eval-source-map',
        hot: true,
        inline: true,
        progress: true,
        // Display only errors to reduce the amount of output.
        stats: 'errors-only',
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT || 8080
      }
    })
    /*config.module.noParse = [
      PATHS.React, PATHS.ReactDOM
    ];
    config.resolve = {
      alias: {
        react: PATHS.React,
        'react-dom': PATHS.ReactDOM
      }
    };*/
    config.plugins = config.plugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true
      })
    ])
    break;
  case 'build':
    config.plugins = config.plugins.concat([
      // Setting DefinePlugin affects React library size!
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ])
    break;
  default:
    break;
}
module.exports = config 
