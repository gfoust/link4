const path = require('path');

module.exports = [
  {
    entry: {
      link4: './main.tsx',
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      alias: {
        'src': path.resolve('./src'),
      },
    },
    context: path.resolve('./src'),
    output: {
      filename: '[name].js',
      globalObject: 'this',
    },
    module: {
      rules: [
        {
          test: /\.worker\.[tj]s?$/,
          loader: 'worker-loader',
          options: {
            name: '[name].js',
          }
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
        },
        {
          test: /\.scss$/,
          loader: 'style-loader',
        },
        {
          test: /\.scss$/,
          loader: 'css-loader',
        },
        {
          test: /\.scss$/,
          loader: 'postcss-loader',
          options: {
            config: {
              path: __dirname,
            }
          },
        },
        {
          test: /\.scss$/,
          loader: 'sass-loader',
        },
        {
          test: /\.(svg|eot|woff|ttf|svg|woff2)$/,
          use: [
              {
                  loader: 'file-loader',
                  options: {
                      name: '[path][name].[ext]',
                  }
              }
          ]
        }
      ],
    },
  },
  {
    entry: {
      'ai.worker': './services/ai.worker.ts',
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      alias: {
        'src': path.resolve('./src'),
      },
    },
    context: path.resolve('./src'),
    output: {
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
        },
      ]
    },
  },
];
