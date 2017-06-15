/*eslint-env node*/

import path from 'path'
import compose from 'koa-compose'
import convert from 'koa-convert'
import json from 'koa-json'
import helmet from 'koa-helmet'
import bodyparser from 'koa-bodyparser'
import logger from 'koa-logger'
import cors from 'kcors'
import setStatic from 'koa-static'

const __public = path.resolve(__dirname, '../data')

export default function middleware() {
  return compose([
    logger(),
    helmet(), // reset HTTP headers (e.g. remove x-powered-by)
    convert(json()),
    convert(cors()),
    convert(bodyparser()),
    setStatic(__public),
  ])
}

