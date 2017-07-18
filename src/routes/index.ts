'use strict'

import Router, { IRouterContext } from 'koa-router'

export default (router: Router) => {
  router.get('/', async function(ctx: IRouterContext) {
    ctx.body = 'hello koa'
  })
}
