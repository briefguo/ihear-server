const remoteServer = 'http://172.16.0.19:3008'
const targetDir = './data.backup'

module.exports = {
  // 静态资源配置
  resource: {
    [`${remoteServer}/svg`]: [{
      target: `${targetDir}/svg.html`,
      format: json => json.data
    }],
    [`${remoteServer}/menu`]: [{
      target: `${targetDir}/menus.json`,
      format: json => JSON.stringify(json.data.menus)
    }, {
      target: `${targetDir}/projects.json`,
      format: json => JSON.stringify(json.data.projects)
    }],
    [`${remoteServer}/api`]: [{
      target: `${targetDir}/api.json`,
      format: json => JSON.stringify(json.data)
    }],
    [`${remoteServer}/config`]: [{
      target: `${targetDir}/config.json`,
      format: json => JSON.stringify(json)
    }],
  },
}
