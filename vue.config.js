module.exports = {
  lintOnSave: 'warning',
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            "tabs-bar-margin": "0",
            "form-item-margin-bottom": "4px",
          },
          javascriptEnabled: true,
        }
      }
    }
  },
  devServer: {
    port: 8200,
    disableHostCheck: true,
    proxy: {
      "/backend": {
        "target": 'http://localhost:9000/'
      }
    }
  }
}