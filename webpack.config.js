const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');


const entry = './' + require('./package.json').main;
let outputFilename = path.basename(entry).replace(/(\.[^/.]+)$/, '.dist$1'); // Add .dist prefix to extension

const config = {
  mode: process.env.NODE_ENV || 'development', // Run in development by default
  entry, // Copy the entry point from package.json
  target: 'node', // Tell webpack to compile for node
  externalsPresets: {
    node: true // Ignore built-in modules
  },
  devtool: 'source-map', // Generate source maps
  resolve: {
    extensions: ['.js'], // Allow imports that exclude .js extension
  },
  output: {
    filename: outputFilename,
    path: path.resolve(__dirname + '/server'),
  },
  plugins: [new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false })]
};

module.exports = config;