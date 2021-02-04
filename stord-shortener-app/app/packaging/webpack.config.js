const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin      = require('eslint-webpack-plugin');
const webpack           = require('webpack')

module.exports = {
  mode  : 'development',
  entry : [
    'webpack-dev-server/client?http://localhost:9000',
    'webpack/hot/only-dev-server',
    './src/app/main.tsx',
  ],
  module: {
    rules: [
      {
        test : /\.tsx?$/,
        use  : [
          'awesome-typescript-loader'
        ]
      },
      {
        test : /\.static\.scss/,
        use  : [
          'style-loader',
          'css-loader',
          {
            loader  : 'sass-loader',
            options : {
              implementation : require('sass'),
              sassOptions    : {
                includePaths: [
                  'resources'
                ]
              }
            },
          }
        ]
      },
      {
        test : /\.s[ac]ss$/i,
        exclude: /\.static\.scss/,
        use  : [
          'style-loader',
          'css-loader?modules=true',
          {
            loader  : 'sass-loader',
            options : {
              implementation : require('sass'),
              sassOptions    : {
                includePaths: [
                  'resources'
                ]
              }
            },
          }
        ]
      },
      {
        test : /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use  : [
          {
            loader  : 'file-loader',
            options : {
              name       : '[name].[ext]',
              outputPath : 'fonts/'
            }
          }
        ]
      }
    ]
  },
  devtool   : 'inline-source-map',
  devServer : {
    contentBase      : './src',
    disableHostCheck : true,
    host             : '0.0.0.0',
    hot              : true,
    port             : 9000,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title    : 'stord-shortener',
      template : 'src/index.html'
    }),
    new ESLintPlugin({
      overrideConfigFile : 'packaging/eslint.json',
      useEslintrc        : false
    })
  ],
  resolve: {
    extensions : ['.js', '.jsx', '.ts', '.tsx', '.json', 'css', '.scss'],
    modules    : [ 'node_modules',  'src/styles', 'src/app', 'src/ui', 'src', 'resources' ]
  }
};
