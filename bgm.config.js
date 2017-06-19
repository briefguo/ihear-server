module.exports = {
  remoteServer: 'http://172.16.0.19:3008',
  targetDir: './data',
  // 静态资源配置
  resource: {
    '/svg': [{
      target: `svg.html`,
      format: json => json.data
    }],
    '/menu': [{
      target: `menus.json`,
      format: json => JSON.stringify(json.data.menus)
    }, {
      target: `projects.json`,
      format: json => JSON.stringify(json.data.projects)
    }],
    '/api': [{
      target: `api.json`,
      format: json => JSON.stringify(json.data)
    }],
    '/config': [{
      target: `config.json`,
      format: json => JSON.stringify(json)
    }],
    // '/images': (json) => json.map(item => ({
    //   type: 'blob',
    //   origin: item,
    //   options: () => ({ flag: 'a' }),
    //   target: `${item.replace('http://172.16.0.19:3008/','')}`,
    // })),
  },
}
