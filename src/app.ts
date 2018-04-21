import Koa from 'koa'
import middleware from './middleware'

const app = new Koa()

// middlewares
app.use(middleware())

export default app
