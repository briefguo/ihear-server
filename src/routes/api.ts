'use strict'

import fs from 'fs'
import path from 'path'
import Router, { IRouterContext } from 'koa-router'
import Api from '../domain/Api/ApiModel'

export default (router: Router) => {
  router
    .get('/api-sync', async function(ctx: IRouterContext) {
      const _apiPath = path.resolve(__dirname, '../../data/api.json')
      const apiObject = JSON.parse(fs.readFileSync(_apiPath, 'utf-8'))

      try {
        Object.keys(apiObject).map(item => {
          Api.create({ ...apiObject[item] })
        })
        ctx.body = { code: 1, data: 'ok' }
      } catch (e) {
        ctx.body = { code: -1, data: 'fail', err: e }
      }
    })

    // 获取API列表
    .get('/api', async function(ctx: IRouterContext) {
      try {
        const data = await Api.find()
        ctx.body = { code: 1, data }
      } catch (e) {
        ctx.body = { code: -1, data: 'file_not_found', err: e }
      }
    })

    // 获取API列表
    .get('/api/:projectId', async function(ctx: IRouterContext) {
      try {
        const project = ctx.params.projectId
        const data = (await Api.find()).filter((item: any) => item.project === project)
        ctx.body = { code: 1, data, msg: ctx.params.projectId }
      } catch (e) {
        ctx.body = { code: -1, data: 'file_not_found', err: e }
      }
    })

    // 根据ID获取单条API
    .get('/api/:projectId/:name', async function(ctx: IRouterContext) {
      const name = ctx.params.name
      try {
        const data = await Api.find({ name })
        ctx.body = { code: 1, data }
      } catch (e) {
        ctx.body = { code: -1, data: 'file_not_found', err: e }
      }
    })

    // 删除API
    .delete('/api/:id', async function(ctx: IRouterContext) {
      try {
        const _id = ctx.params.id
        ctx.body = await Api.remove({ _id })
      } catch (e) {
        ctx.body = { code: -1, data: 'file_not_found', err: e }
      }
    })

    // 新建或更新一条API
    .put('/api/:name/:data', async function(ctx: IRouterContext) {
      try {
        const name = ctx.params.name
        const newData = JSON.parse(ctx.params.data)
        const project = newData.projectId

        const results = (await Api.find({ name })).filter((item: any) => item.project === project)

        if (results.length > 0) {
          ctx.body = await Api.update({ name }, { ...newData, name })
        } else {
          ctx.body = await Api.create({
            ...newData,
            name: ctx.params.name
          })
        }
      } catch (err) {
        ctx.body = { code: -1, data: err }
      }

    })
}
