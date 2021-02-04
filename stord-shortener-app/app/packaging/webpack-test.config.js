const path = require('path');
const SRC_DIR = path.join(process.cwd(), 'src');
const webpack = require('webpack')
module.exports = {
  context: SRC_DIR,
  mode: 'development',
  module: {
    rules: [
      {
        test : /\.tsx?$/,
        exclude : [/(node_modules)/],
        use  : [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader',

          }
        ]
      },
      {
        test: /\.static\.scss/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                includePaths: [
                  'resources'
                ]
              }
            },
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /\.static\.scss/,
        use: [
          'style-loader',
          'css-loader?modules=true',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                includePaths: [
                  'resources'
                ]
              }
            },
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', 'css', '.scss'],
    modules: ['node_modules', 'src/styles', 'src/app', 'src/ui', 'src', 'resources'],
    fallback: {
      "util": require.resolve("util/")
    }
  }
};
