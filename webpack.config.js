const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: {path: path.join(__dirname, "build"), filename: "index.bundle.js"},
  mode: process.env.NODE_ENV || "development",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      fs: false
    }
  },
  devServer: {contentBase: path.join(__dirname, "src")},
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      {
        test: /\.(css)$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(scss)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.lib$/i,
        use: 'raw-loader',
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/react", "@babel/preset-env"],
            },
          },
          {
            loader: "react-svg-loader",
            options: {
              jsx: true // true outputs JSX tags
            }
          }
        ]
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
    }),
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            {
              source: path.resolve(__dirname, "src", "faust", "*.*"),
              destination: path.resolve(__dirname, "build", "faust")
            },
            {
              source: path.resolve(__dirname, "src", "faust", "*.wasm"),
              destination: path.resolve(__dirname, "build")
            },
            {
              source: path.resolve(__dirname, "src", "faust", "*.data"),
              destination: path.resolve(__dirname, "build")
            }
          ]
        }
      }
    }),
  ],
};
