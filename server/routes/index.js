/*eslint-disable no-console*/

'use strict'

// import path from 'path'
// import fs from 'fs'

export default (router) => {
  router.get('/', async function (ctx) {
    ctx.body = 'hello koa'
  })
}
