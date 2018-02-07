'use strict'
import _ from 'lodash'
import FormData from 'form-data'
import fetch from 'isomorphic-fetch'
import Router, { IRouterContext } from 'koa-router'
import Api from '../domain/Api/ApiModel'
import Config from '../domain/Config/ConfigModel'

// 是否加密
export default (router: Router) => {
  router.get('/', async function (ctx: IRouterContext) {
    ctx.body = 'Hello Koa!'
  })
    .all('/__api__', async function (ctx: IRouterContext) {
      try {
        const env = ctx.query.env || ''
        const service = ctx.query.service || ''
        const api = await Api.find({ name: service })
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
        const fullURL = `//${envHost}${currentPath}${service}`;
        const form = new FormData()
        _.forEach(ctx.request.body.fields, (value, key) => {
          form.append(key, value)
        })
        console.log(fullURL, ctx.request.body);
        return
        const json = await fetch(fullURL, { method: 'POST', body: form })
          .then(res => res.json())
        console.log('ok', json)
        ctx.body = json
      } catch (error) {
        console.log('fail', error);
        ctx.body = { error }
      }
    })
}