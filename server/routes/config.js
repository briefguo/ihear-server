/*eslint-disable no-console*/
'use strict'

import fs from 'fs'
import path from 'path'

const __configPath = path.resolve(__dirname, '../../data/config.json')

function getConfigFile() {
  return fs.readFileSync(__configPath, 'utf-8')
}

export default (router) => {
  router
    // 获取API列表
    .get('/config', async function (ctx) {
      let configString = getConfigFile()
      ctx.body = configString
    })
    .put('/config/:newConfig', async function (ctx) {
      try {
        const newConfig = ctx.params.newConfig
        fs.writeFile(`${__configPath}`, newConfig, (err) => {
          if (err) throw err
          console.log('It\'s saved!')
        })
        ctx.body = { code: 1, data: 'ok' }
      } catch (e) {
        ctx.body = { code: -1, data: e }
      }
    })
}
