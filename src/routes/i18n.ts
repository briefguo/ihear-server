'use strict'

import fs from 'fs'
import path from 'path'
import Router, { IRouterContext } from 'koa-router'
import I18n from '../domain/I18n/I18nModel'

export default (router: Router) => {
  router
    //同步数据库
    .get('/i18n-sync', async function(ctx: IRouterContext) {
      
    })

    /**
     * 获取指定项目的语言包
     * 参数params：
     *   {
     *     project: 'partner',  可选，项目id，不传则返回所有记录
     *     key: 'xxxx.xxxx',    可选，语言包项key，精确查找
     *     lang: 'zh' | 'en',   可选，语言类型，不传返回所有类型
     *   }
     */
    .get('/i18n/:params', async function(ctx: IRouterContext) {
      try {
        const params = JSON.parse(ctx.params.params)
        console.log(params)
        const data = (await I18n.find({ ...params }))
        ctx.body = { code: 1, data, msg: params.project }
      } catch (e) {
        ctx.body = { code: -1, data: 'file_not_found', err: e }
      }
    })

    // 删除语言包项
    .delete('/i18n/:projectId/:key', async function(ctx: IRouterContext) {
      try {
        const project = ctx.params.projectId
        const key = ctx.params.key
        ctx.body = await I18n.remove({ project, key })
      } catch (e) {
        ctx.body = { code: -1, data: 'file_not_found', err: e }
      }
    })

    /**
     * 导入数据
     */
    .put('/i18n/import/:data', async function(ctx: IRouterContext){
      try {
        const params = JSON.parse(ctx.params.data)
        const project = params.projectId
        const lang = params.lang
        const langData = JSON.parse(params.data)

        //解析、插入数据
        const keys = Object.keys(langData)
        keys.map(async (key)=>{
          const result = (await I18n.find({ project, key, lang }))
          if(result.length>0){
            I18n.update({ project, key, lang }, { value: langData[key] })
          }else{
            I18n.create({ project, key, lang, value: langData[key] })
          }
        })

        ctx.body = { code:1, msg: 'success' }
      } catch (e) {
        ctx.body = { code: -1, data: e }
      }
    })

    /**
     * 新建或更新一条语言包项
     * 参数data:
     *   {
     *     zh: '中文翻译',
     *     en: 'english translation'
     *   }
     */
    .put('/i18n/:projectId/:key/:data', async function(ctx: IRouterContext) {
      try {
        const key = ctx.params.key
        const project = ctx.params.projectId
        const newData = JSON.parse(ctx.params.data)

        const langs = Object.keys(newData)
        langs.map(async (lang)=>{
          const result = (await I18n.find({ project, key, lang }))
          if(result.length>0){
            await I18n.update({ project, key, lang }, { value: newData[lang] })
          }else{
            await I18n.create({ project, key, lang, value: newData[lang] })
          }
        })

        ctx.body = { code:1, msg: 'success' }
      } catch (e) {
        ctx.body = { code: -1, data: e }
      }
    })
}
