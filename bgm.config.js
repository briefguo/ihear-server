module.exports = {
  remoteServer: 'http://172.16.0.19:3008',
  // 静态资源配置
  resource: {
    '/svg': [{
      targetPath: `data/svg-mgt.html`,
      format: json => json.data
    }],
    // '/svg/partner': [{
    //   targetPath: `data/svg-partner.html`,
    //   format: json => json.data
    // }],
    // '/svg/mgt': [{
    //   targetPath: `data/svg-mgt.html`,
    //   format: json => json.data
    // }],
    '/menu': [{
      targetPath: `data/menus.json`,
      format: json => JSON.stringify(json.data.menus)
    }, {
      targetPath: `data/projects.json`,
      format: json => JSON.stringify(json.data.projects)
    }],
    '/api': [{
      targetPath: `data/api.json`,
      format: json => JSON.stringify(json.data)
    }],
    '/config': [{
      targetPath: `data/config.json`,
      format: json => JSON.stringify(json)
    }],
    '/images': (json) => json.allImages.map(item => ({
      type: 'blob',
      originPath: `${item}`,
      targetPath: `data/${item}`,
    })),
  },
}
