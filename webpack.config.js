const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const debugMode = process.env.NODE_ENV !== 'production';

const plugins = [
  new webpack.DefinePlugin({
    'process.env.API_BASE_URL': JSON.stringify('/api/v1'),
    'process.env.JSON_WEB_TOKEN_SECRETE': JSON.stringify(process.env.JSON_WEB_TOKEN_SECRETE),
  }),
];

module.exports = {
  entry: [
    path.join(__dirname, '/client/index.jsx'),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        },
      }, {
        test: /\.(sass|scss|css)$/,
        loader: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            query: {
              optipng: {
                optimizationLevel: 7,
              },
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              pngquant: {
                quality: '75-90',
                speed: 3,
              },
            },
          },
        ],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  plugins: debugMode ? plugins : plugins.concat([
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  ]),
  resolve: {
    extensions: ['.jsx', '.js'],
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.PORT}`,
        secure: false,
      },
    },
    historyApiFallback: true,
  },
};
