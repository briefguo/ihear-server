'use strict'

import _ from 'lodash'
import Router, { IRouterContext } from 'koa-router'
import {
  I18nLangModel,
  I18nModuleModel,
  I18nItemModel
} from '../domain/I18n/I18nModel'
import mongoose from 'mongoose'

//错误码定义
const ERRORS = {
  101: 'invalid params',
  102: 'unknown error',
  103: 'create fail',
  104: 'update fail',
  105: 'query fail',
  106: 'delete fail',
  107: 'repeat',
  108: 'not exist'
}

export default (router: Router) => {
  router
    /**
     * 获取系统支持的语言列表
     */
    .get('/i18n/langs', async function (ctx: IRouterContext) {
      try {
        const langs = await I18nLangModel.find()
        const data = langs.map((item: any) => ({ code: item.code, desc: item.desc }))
        ctx.body = { code: 1, data, msg: 'success' }
      } catch (e) {
        ctx.body = { code: 105, msg: ERRORS[105] }
      }
    })

    /**
     * 获取指定项目的格式化后的所有语言包
     */
    .get('/i18n/export/:projectId', async function (ctx: IRouterContext) {
      try {
        const project = ctx.params.projectId
        const items = await I18nItemModel.find().populate({ path: "module", match: { project } })
        const langs = await I18nLangModel.find()

        // 格式化数据
        let res: any = {}
        langs.map((item: any) => {
          res[item.code] = {}
        })

        items.filter((item: any) => item.module != null)
          .map((item: any) => {
            const { key, value, lang, module } = item
            res[lang][module.name + '.' + key] = value
          })

        ctx.body = { code: 1, data: res, msg: project }
      } catch (e) {
        ctx.body = { code: 105, msg: ERRORS[105] }
      }
    })

    /**
     * 获取指定项目下的模块列表
     */
    .get('/i18n/module/:projectId', async function (ctx: IRouterContext) {
      try {
        const project = ctx.params.projectId
        const data = await I18nModuleModel.find({ project })
        // 格式化数据
        let res: Object[] = []
        data.map((item: any) => {
          const { _id, name, project, createTime } = item
          res.push({
            id: _id,
            name,
            project,
            createTime
          })
        })
        ctx.body = { code: 1, data: res, msg: project }
      } catch (e) {
        ctx.body = { code: 105, msg: ERRORS[105] }
      }
    })

    /**
     * 新增指定项目下的模块
     * 参数要求
     * {
     *   project,   //必须
     *   name       //必须
     * }
     */
    .post('/i18n/module/create', async function (ctx: IRouterContext) {
      try {
        const { fields } = ctx.request.body
        const { project, name } = fields
        //参数检测
        if (!project || !name) {
          ctx.body = { code: 101, msg: ERRORS[101] }
          return
        }
        //记录是否存在
        const isExist = await I18nModuleModel.find({ project, name }).count()
        if (isExist) {
          ctx.body = { code: 107, msg: ERRORS[107] }
          return
        }
        //创建
        await I18nModuleModel.create({ project, name, createTime: (new Date()).getTime() })
        ctx.body = { code: 1, msg: 'created' }
      } catch (e) {
        ctx.body = { code: 103, msg: ERRORS[103] }
      }
    })

    /**
     * 更新指定模块
     * 参数要求
     * {
     *   moduleId,  //必须
     *   name       //必须
     * }
     */
    .post('/i18n/module/update', async function (ctx: IRouterContext) {
      try {
        const { fields } = ctx.request.body
        const { moduleId, name } = fields
        //参数检测
        if (!moduleId || !name) {
          ctx.body = { code: 101, msg: ERRORS[101] }
          return
        }

        //更新
        const module = mongoose.Types.ObjectId(moduleId)
        const res = await I18nModuleModel.update({ _id: module }, { name, createTime: (new Date()).getTime() })
        if (res.nModified) {
          ctx.body = { code: 1, msg: 'updated' }
        } else {
          ctx.body = { code: 104, msg: ERRORS[104] }
        }
      } catch (e) {
        ctx.body = { code: 104, msg: ERRORS[104] }
      }
    })

    /**
     * 收藏/取消收藏模块
     */
    // .post('/18n/module/fav', async function(ctx: IRouterContext){
    //   try {
    //     const { fields } = ctx.request.body
    //     ctx.body = { code: 1, msg: 'updated' }
    //   } catch (e) {
    //     ctx.body = { code: 104, msg: ERRORS[104] }
    //   }
    // })

    /**
     * 删除语言包模块
     * 参数要求
     * {
     *   moduleId   //必须
     * }
     */
    .delete('/i18n/module/:moduleId', async function (ctx: IRouterContext) {
      try {
        const id = mongoose.Types.ObjectId(ctx.params.moduleId)
        await I18nModuleModel.remove({ _id: id })
        //同时删除i18n_items的记录
        await I18nItemModel.remove({ module: id })
        ctx.body = { code: 1, data: null, msg: 'deleted' }
      } catch (e) {
        ctx.body = { code: 106, msg: ERRORS[106] }
      }
    })


    /**
     * 获取指定模块下的语言包项列表
     */
    .get('/i18n/item/:moduleId', async function (ctx: IRouterContext) {
      try {
        const module = mongoose.Types.ObjectId(ctx.params.moduleId)
        const data = await I18nItemModel.find({ module })
        // 格式化数据
        let res: Object[] = []
        data.map((item: any) => {
          const { _id, key, value, lang, createTime } = item
          res.push({
            id: _id,
            key,
            value,
            lang,
            createTime
          })
        })
        ctx.body = { code: 1, data: res, msg: module }
      } catch (e) {
        ctx.body = { code: -1, msg: e }
      }
    })

    /**
     * 根据key获取指定语言包项
     */
    .get('/i18n/item/:moduleId/:key', async function (ctx: IRouterContext) {
      try {
        const module = mongoose.Types.ObjectId(ctx.params.moduleId)
        const key = ctx.params.key
        const data = await I18nItemModel.find({ module, key })
        // 格式化数据
        let res: Object[] = []
        data.map((item: any) => {
          const { _id, key, value, lang, createTime } = item
          res.push({
            id: _id,
            key,
            value,
            lang,
            createTime
          })
        })
        ctx.body = { code: 1, data: res, msg: module + '/' + key }
      } catch (e) {
        ctx.body = { code: -1, msg: e }
      }
    })

    /**
     * 新增语言包项
     * 参数要求
     * {
     *   moduleId,    //必须
     *   key,         //必须
     *   en,          
     *   zh
     * }
     */
    .post('/i18n/item/create', async function (ctx: IRouterContext) {
      try {
        const { fields } = ctx.request.body
        const { moduleId, key, ...values } = fields
        //参数检测
        if (!moduleId || !key) {
          ctx.body = { code: 101, msg: ERRORS[101] }
          return
        }

        //记录是否存在
        const module = mongoose.Types.ObjectId(moduleId)
        const isExist = await I18nItemModel.find({ module, key }).count()
        if (isExist) {
          ctx.body = { code: 107, msg: ERRORS[107] }
          return
        }

        //语言包值是否有效(只要一条无效也视为无效)
        const insertLangs = _.keys(values)
        const supportLangs = (await I18nLangModel.find()).map((item: any) => item.code)
        if (insertLangs.length !== _.union(insertLangs, supportLangs).length) {
          ctx.body = { code: 101, msg: ERRORS[101] }
          return
        }

        //创建
        supportLangs.map(async (lang) => {
          const obj = {
            module,
            key,
            value: values[lang],
            lang,
            createTime: (new Date()).getTime()
          }
          await I18nItemModel.create(obj)
        })

        ctx.body = { code: 1, msg: 'created' }
      } catch (e) {
        ctx.body = { code: 103, msg: ERRORS[103] }
      }
    })

    /**
     * 更新语言包项
     * 参数要求
     * {
     *   moduleId,  //必须
     *   key,       //必须
     *   en,
     *   zh
     * }
     */
    .post('/i18n/item/update', async function (ctx: IRouterContext) {
      try {
        const { fields } = ctx.request.body
        const { moduleId, key, ...values } = fields
        //参数检测
        if (!moduleId || !key) {
          ctx.body = { code: 101, msg: ERRORS[101] }
          return
        }

        //记录是否存在
        const module = mongoose.Types.ObjectId(moduleId)
        const isExist = await I18nItemModel.find({ module, key }).count()
        if (!isExist) {
          ctx.body = { code: 108, msg: ERRORS[108] }
          return
        }

        //语言包值是否有效(只要一条无效也视为无效)
        const insertLangs = _.keys(values)
        const supportLangs = (await I18nLangModel.find()).map((item: any) => item.code)
        if (insertLangs.length !== _.union(insertLangs, supportLangs).length) {
          ctx.body = { code: 101, msg: ERRORS[101] }
          return
        }

        //更新，不存在的项就创建
        supportLangs.map(async (lang) => {
          let isExist = await I18nItemModel.find({ module, key, lang }).count()
          if (isExist) {
            await I18nItemModel.update(
              { module, key, lang },
              { value: values[lang], createTime: (new Date()).getTime() }
            )
          } else {
            await I18nItemModel.create({
              module,
              key,
              lang,
              value: values[lang],
              createTime: (new Date()).getTime()
            })
          }
        })

        ctx.body = { code: 1, msg: 'updated' }
      } catch (e) {
        ctx.body = { code: 104, msg: ERRORS[104] }
      }
    })

    /**
     * 批量创建语言包项，覆盖更新
     * 参数要求
     * {
     *   moduleId,  //必须
     *   lang,      //必须
     *   values     //必须，json
     * }
     */
    .post('/i18n/item/import', async function (ctx: IRouterContext) {
      try {
        const { fields } = ctx.request.body
        const { moduleId, lang, values } = fields
        const supportLangs = (await I18nLangModel.find()).map((item: any) => item.code)

        //参数检测
        if (!moduleId || !lang || !values || supportLangs.indexOf(lang)===-1) {
          ctx.body = { code: 101, msg: ERRORS[101] }
          return
        }

        //开始导入操作
        const datas = JSON.parse(values)
        const module = mongoose.Types.ObjectId(moduleId)
        const keys = _.keys(datas)

        keys.map(async (key) => {
          let isExist = await I18nItemModel.find({ module, key, lang }).count()
          if (isExist) {
            await I18nItemModel.update(
              { module, key, lang },
              { value: datas[key], createTime: (new Date()).getTime() }
            )
          } else {
            await I18nItemModel.create({ 
              module,
              key,
              lang,
              value: datas[key],
              createTime: (new Date()).getTime()
            })
          }
        })

        ctx.body = { code: 1, msg: 'success' }
      } catch (e) {
        ctx.body = { code: 103, msg: ERRORS[103] }
      }
    })

    /**
     * 根据key删除指定语言包项
     */
    .delete('/i18n/item/:moduleId/:key', async function (ctx: IRouterContext) {
      try {
        const module = mongoose.Types.ObjectId(ctx.params.moduleId)
        const key = ctx.params.key
        await I18nItemModel.remove({ module, key })
        ctx.body = { code: 1, data: null, msg: 'deleted' }
      } catch (e) {
        ctx.body = { code: 106, msg: ERRORS[106] }
      }
    })
}
