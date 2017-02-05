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
  disable:false,
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
  new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor_a', 'vendor_b'],
    filename: 'js/[name].js',
    minChunks: Infinity
  }),
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
    }),
    compiledCss
  )
} else  {
  webpackPlugins.push(
    new DashboardPlugin(),
    new webpack.HotModuleReplacementPlugin()
  )
}

module.exports = {
  devtool: isProduction ? 'eval' : 'source-map',
  context: path.resolve(__dirname, './src/'),
  entry: ['./js/main.js',
     './css/main.css',
    // {
    //   vendor_a: [
    //     'babel-polyfill',
    //     'redux-thunk',
    //     'redux',
    //   ]
    // },
    // {
    //   vendor_b: [
    //     'react',
    //     'react-dom'
    //   ]
    // }
  ],
  output: {
    path: path.resolve(__dirname, './assets/'),
    publicPath: '/',
    filename: '/js/[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, './src/js'),
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
        test: /\.css$/,
        exclude: /node_modules/,
        use:  isProduction ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?modules=false&importLoaders=1!postcss-loader?syntax=postcss-scss',
        }) : ['style-loader', 'css-loader?modules=false&importLoaders=1!postcss-loader?syntax=postcss-scss'],
      }
    ]
  },
  plugins: webpackPlugins,
  devServer: {
    historyApiFallback: true,
    contentBase: (isProduction ? path.join(__dirname, './public/') : path.join(__dirname, './src/')),
    publicPath: '/js/',
    port: 1111,
    compress: isProduction,
    inline: !isProduction,
    hot: !isProduction,
    host: '0.0.0.0',
    stats: {
      assets: true,
      children: false,
      chunks: true,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: '\u001b[32m'
      }
    }
  }
}
