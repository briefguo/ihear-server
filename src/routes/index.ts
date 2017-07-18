/*eslint-disable no-console*/

'use strict'

export default (router) => {
  router.get('/', async function (ctx) {
    ctx.body = 'hello koa'
  })
}
