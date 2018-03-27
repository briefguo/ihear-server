'use strict'

import _ from 'lodash'
import FormData from 'form-data'
import fetch from 'isomorphic-fetch'
import Router, { IRouterContext } from 'koa-router'
import Api from './domain/Api/ApiModel'
import Config from './domain/Config/ConfigModel'
import compose from 'koa-compose'
import convert from 'koa-convert'
import json from 'koa-json'

const prefix = ''

export default function api() {
  const router = new Router({ prefix })

  const weixin = (router: Router) => {
    router.post('/', async function (ctx: IRouterContext) {
      try {
        const { env = 'test', service, project, mode = 'http' } = ctx.request.body.fields
        const api = await Api.find({ name: service, project })
        const config = (await Config.find())[0]
        const API = _.keyBy(api, 'name')

        if (!API[service]) {
          throw new Error(
            `未定义的接口${service},请在[api层]添加接口定义`
          );
        }

        const { pathArray } = API[service];
        if (!pathArray) {
          throw new Error(
            `请设置${service}的pathArray属性`
          );
        }
        const [host, path] = pathArray;
        if (!host || !path) {
          throw new Error(
            `请设置${service}的正确的pathArray属性`
          );
        }
        const { modulePaths } = config;
        const currentHost = _.keyBy(modulePaths, 'value')[host];
        const currentPath = _.keyBy(currentHost.children, 'value')[path].label;
        const envHost = env ? `${env}.${currentHost.label}` : currentHost.label
        const fullURL = `${mode}://${envHost}${currentPath}${service}`;
        const form = new FormData()
        _.forEach(ctx.request.body.fields, (value, key) => {
          form.append(key, value)
        })
        console.log(fullURL, ctx.request.body.fields);
        // return
        const json = await fetch(fullURL, { method: 'POST', body: form })
          .then(res => res.json())
        console.log('ok')
        ctx.body = json
      } catch (error) {
        console.log('fail', error);
        ctx.body = { error }
      }
    })
  }

  weixin(router)

  return compose([
    convert(json({})),
    router.routes(),
    router.allowedMethods(),
  ])
}

// 是否加密
