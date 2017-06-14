const remoteServer = 'http://localhost:3008'

module.exports = {
  // 静态资源配置
  resource: {
    [`${remoteServer}/svg`]: [{
      target: './data/svg.html',
      format: json => json.data
    }],
    [`${remoteServer}/menu`]: [{
      target: './data/menus.json',
      format: json => JSON.stringify(json.data.menus)
    }, {
      target: './data/projects.json',
      format: json => JSON.stringify(json.data.projects)
    }],
    [`${remoteServer}/api`]: [{
      target: './data/api.json',
      format: json => JSON.stringify(json.data)
    }],
    [`${remoteServer}/config`]: [{
      target: './data/config.json',
      format: json => JSON.stringify(json)
    }],
  },
}
