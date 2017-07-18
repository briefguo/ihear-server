/*eslint-disable no-console*/
'use strict'

import Config from '../domain/Config/ConfigModel'

export default (router) => {
  router
    .get('/config-sync', async function (ctx) {
      const fs = require('fs')
      const path = require('path')
      const __configPath = path.resolve(__dirname, '../../data/config.json')
      let configString = fs.readFileSync(__configPath, 'utf-8')

      const results = await Config.find({ "__v": 0 })
      if (results.length > 0) {
        ctx.body = await Config.update({ "__v": 0 }, { ...JSON.parse(configString) })
      } else {
        ctx.body = await Config.create({ ...JSON.parse(configString) })
      }
    })
    // 获取API列表
    .get('/config', async function (ctx) {
      const results = await Config.find()
      ctx.body = results[0]
    })
    .put('/config/:newConfig', async function (ctx) {
      try {
        const newConfig = ctx.params.newConfig
	console.log(newConfig,{...JSON.parse(newConfig)})
	ctx.body = await Config.update({ "__v": 0 }, { modulePaths: JSON.parse(newConfig).modulePaths })
      } catch (e) {
        ctx.body = { code: -1, data: e }
      }
    })
}
