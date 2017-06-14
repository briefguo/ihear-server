/**
 * This task starts browserSync. Allowing refreshes to be called from the gulp
 * bundle task.
 */
/*eslint-env node*/
import Koa from 'koa'
import logger from 'koa-logger'

import middleware from './middleware'
import dynamic from './dynamic'

const app = new Koa()

// middlewares
app.use(middleware())

// dynamic
app.use(dynamic())
app.on('error', function (err, ctx) {
  logger.error('server error', err, ctx)
})

module.exports = app

