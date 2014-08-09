module.exports = {
  entry: './src/index.jsx',

  output: {
    path: './dist',
    filename: 'index.js'
  },

  module: {
    loaders: [
      {test: /\.css$/,  loader: 'style-loader!css-loader'},
      {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
      {test: /\.jsx$/,  loader: 'jsx-loader?harmony&insertPragma=React.DOM'},
      {test: /\.woff$/, loader: 'url-loader?limit=10000&minetype=application/font-woff'},
      {test: /\.ttf$/,  loader: 'file-loader'},
      {test: /\.eot$/,  loader: 'file-loader'},
      {test: /\.svg$/,  loader: 'file-loader'}
    ]
  },

  devtool: 'source-map-eval'
};
