const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
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
        // Parse host and port from env so this is easy to customize.
        //
        // If you use Vagrant or Cloud9, set
        // host: process.env.HOST || '0.0.0.0';
        //
        // 0.0.0.0 is available to all network devices unlike default
        // localhost
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 8080
      }
    })
    config.plugins = config.plugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true // --save
      })
    ])
    break;
  case 'build':
    break;
  default:
    break;
}
module.exports = config 
