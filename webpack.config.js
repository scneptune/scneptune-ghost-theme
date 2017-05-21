const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const postScss= require('postcss-scss')
const nodeEnv = process.env.NODE_ENV || 'development'
const isProduction = nodeEnv === 'production';

const compiledCss = new ExtractTextPlugin({
  filename: '/css/[name].css',
  allChunks: true
})

const webpackPlugins = [
  new webpack.NamedModulesPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv)
    }
  }),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.LoaderOptionsPlugin({
    debug: true,
    options: {
      postcss: [
        precss(),
        autoprefixer({
          browsers: [
            'last 3 version',
            'ie >= 10',
          ],
        })
      ],
      context: path.join(__dirname, './src/'),
    },
  }),
  compiledCss
]

if (isProduction) {
  webpackPlugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
      },
      output: {
        comments: true
      }
    })
  )
}

module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname, 'src'),
  watch: !isProduction,
  entry: {
    application: path.resolve(__dirname, 'src/js/application.js'),
    main: path.resolve(__dirname, 'src/css/main.css'),
  },
  output: {
    path: path.resolve(__dirname, 'assets'),
    publicPath: '/',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'src/js'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }, {
        test: /\.(jpe?g|gif|png|svg)$/i,
        use: 'file-loader?name=/image/[name].[ext]'
      },
      {
        test: /\.(precss|css)$/,
        exclude: /node_modules/,
        use: compiledCss.extract({
          fallback: 'style-loader',
          use: 'css-loader?modules=false&import=true&importLoaders=1!postcss-loader?syntax=postcss-scss&sourceMap=inline',
        })
      }
    ]
  },
  plugins: webpackPlugins
}
