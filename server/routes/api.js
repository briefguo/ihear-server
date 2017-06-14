/*eslint-disable no-console*/
'use strict'

import fs from 'fs'
import path from 'path'

const __apiPath = path.resolve(__dirname, '../../data/api.json')

export default (router) => {
  router
    // 获取API列表
    .get('/api', async function (ctx) {
      const apiPath = __apiPath
      const apiObject = JSON.parse(fs.readFileSync(apiPath, 'utf-8'))

      const apiData = Object.keys(apiObject).map(item => {
        return apiObject[item]
      })
      try {
        ctx.body = { code: 1, data: apiData }
      } catch (e) {
        ctx.body = { code: -1, data: 'file_not_found', err: e }
      }
    })
    // 根据ID获取单条API
    .get('/api/:name', async function (ctx) {
      const apiPath = __apiPath
      const apiObject = JSON.parse(fs.readFileSync(apiPath, 'utf-8'))

      const apiName = ctx.params.name
      ctx.body = apiObject[apiName]
    })
    // 新建或更新一条API
    .put('/api/:name/:data', async function (ctx) {
      const apiPath = __apiPath
      const apiObject = JSON.parse(fs.readFileSync(apiPath, 'utf-8'))
      const newData = JSON.parse(ctx.params.data)
      const apiName = ctx.params.name

      function saveOneByName(key, data) {
        const newApiData = Object.assign(apiObject, {
          [key]: {
            ...apiObject[key],
            ...data,
            name: key,
          }
        })

        return new Promise(function (resolve, reject) {
          try {
            fs.writeFile(apiPath, JSON.stringify(newApiData), (err) => {
              if (err) throw err
              console.log('It\'s saved!')
            })
          } catch (e) {
            reject(false)
          }
          resolve(true)
        })
      }
      const isSave = await saveOneByName(apiName, newData)
      ctx.body = { code: 1, data: isSave }
    })
    // 删除API
    .get('/api/:name/delete', async function (ctx) {
      const apiPath = __apiPath
      const apiObject = JSON.parse(fs.readFileSync(apiPath, 'utf-8'))

      function deleteOneByName(key) {
        const newApiData = Object.assign({}, apiObject)

        return new Promise(function (resolve, reject) {
          if (newApiData[key]) {
            delete newApiData[key]
          } else {
            reject(false)
            return
          }

          try {
            fs.writeFile(apiPath, JSON.stringify(newApiData), (err) => {
              if (err) throw err
              console.log('It\'s saved!')
            })
          } catch (e) {
            reject(false)
          }
          resolve(true)
        })
      }
      const apiName = ctx.params.name
      const isDelete = await deleteOneByName(apiName)
      ctx.body = { code: 1, data: isDelete }
    })
}
