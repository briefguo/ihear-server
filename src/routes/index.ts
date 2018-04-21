'use strict'

// import _ from 'lodash'
// import FormData from 'form-data'
// import base64 from 'base-64'
// import md5 from 'md5'
// import fetch from 'isomorphic-fetch'
import Router, { IRouterContext } from 'koa-router'
import aip from '../lib/aip'
// import Datauri from 'datauri'
// import fs from 'fs'

var AipSpeechClient = aip.speech
// 设置APPID/AK/SK
var APP_ID = 11135948
var API_KEY = 'cfLVkCqLwZAxnbpYdlKWcgjq'
var SECRET_KEY = '347768ff55d5d2854f95f73d834c5e0f'
// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY)

export default (router: Router) => {
  router.get('/', async function (ctx: IRouterContext) {
    try {
      const result = await client.text2audio('百度语音合成测试')
      ctx.body = `data:audio/ogg;base64,${result.data.toString('base64')}`
    } catch (error) {
      ctx.body = error
    }
  })
}