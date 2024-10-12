const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NG_APP_API_URL: JSON.stringify(process.env.NG_APP_API_URL)
      }
    })
  ]
};