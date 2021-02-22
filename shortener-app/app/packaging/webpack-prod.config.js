const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode  : 'production',
  entry : [
    './src/app/main.tsx',
  ],
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[chunkhash].js'
  },
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
              sassOptions    : {
                functions: require('node-sass-json-vars'),
                configPath:  'resources/sass.json',
                includePaths : [
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
              implementation : require('node-sass'),
              sassOptions    : {
                functions: require('node-sass-json-vars'),
                configPath:  'resources/sass.json',
                includePaths : [
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
      },
      {
        test : /\.(jpg|jpeg|png)(\?v=\d+\.\d+\.\d+)?$/,
        use  : [
          {
            loader  : 'file-loader',
            options : {
              name       : '[name].[ext]',
              outputPath : 'images/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title    : 'shortener',
      template : 'src/index.html'
    })
  ],
  resolve: {
    extensions : ['.js', '.jsx', '.ts', '.tsx', '.json', 'css', '.scss', '.woff', '.woff2'],
    modules    : [ 'node_modules',  'src/styles', 'src/app', 'src/ui', 'src', 'resources' ]
  }
};
