import Koa from 'koa'
import middleware from './middleware'
import dynamic from './dynamic'

const app = new Koa()

// middlewares
app.use(middleware())

// dynamic
app.use(dynamic())

export default app
