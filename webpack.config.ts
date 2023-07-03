import path from "path";
import webpack from "webpack";

const config: webpack.Configuration = {
  entry: {
    app: "./src/app.ts",
  },
  output: {
    path: path.resolve(process.cwd(), "dist"),
    filename: "app.bundle.js", // Output file name for the compiled bundle
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};

export default config;
