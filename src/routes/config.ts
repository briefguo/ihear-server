'use strict'

import fs from 'fs'
import path from 'path'
import Config from '../domain/Config/ConfigModel'
import Router, { IRouterContext } from 'koa-router'

export default (router: Router) => {
  router
    .get('/config-sync', async function(ctx: IRouterContext) {
      const _configPath = path.resolve(__dirname, '../../data/config.json')
      let configString = fs.readFileSync(_configPath, 'utf-8')

      const results = await Config.find({ '__v': 0 })
      if (results.length > 0) {
        ctx.body = await Config.update({ '__v': 0 }, { ...JSON.parse(configString) })
      } else {
        ctx.body = await Config.create({ ...JSON.parse(configString) })
      }
    })
    // 获取API列表
    .get('/config', async function(ctx: IRouterContext) {
      const results = await Config.find()
      ctx.body = results[0]
    })
    .put('/config/:newConfig', async function(ctx: IRouterContext) {
      try {
        const newConfig = ctx.params.newConfig
        ctx.body = await Config.update({ '__v': 0 }, { modulePaths: JSON.parse(newConfig).modulePaths })
      } catch (e) {
        ctx.body = { code: -1, data: e }
      }
    })
}
