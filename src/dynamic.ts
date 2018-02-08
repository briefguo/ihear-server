'use strict'

import compose from 'koa-compose'
import Router from 'koa-router'
import importDir from 'import-dir'
import convert from 'koa-convert'
import json from 'koa-json'
import koaBody from 'koa-body'
// import bodyparser from 'koa-bodyparser'

const routes = importDir('./routes')

const prefix = ''

export default function api() {
  const router = new Router({ prefix })

  Object.keys(routes).forEach(name => routes[name](router))

  return compose([
    convert(json({})),
    // convert(bodyparser({})),
    convert(koaBody({ multipart: true })), // lwf:添加formdata
    router.routes(),
    router.allowedMethods(),
  ])
}
