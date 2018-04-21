'use strict'

import compose from 'koa-compose'
import Router from 'koa-router'
import importDir from 'import-dir'
import convert from 'koa-convert'
import json from 'koa-json'
// import koaBody from 'koa-body'
import bodyparser from 'koa-bodyparser'
import path from 'path'
import helmet from 'koa-helmet'
import logger from 'koa-logger'
import cors from 'kcors'
import setStatic from 'koa-static'

const routes = importDir('./routes')
const prefix = ''
const _public = path.resolve(__dirname, 'public')

export default function middleware() {
  const router = new Router({ prefix })

  Object.keys(routes).forEach(name => routes[name](router))

  return compose([
    logger(),
    convert(bodyparser({})),
    // convert(koaBody({ multipart: true })), // lwf:添加formdata
    helmet(), // reset HTTP headers (e.g. remove x-powered-by)
    convert(json({})),
    convert(cors()),
    setStatic(_public),
    router.routes(),
    router.allowedMethods(),
  ])
}
