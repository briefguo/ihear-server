import Koa from 'koa'
import middleware from './middleware'
import dynamic from './dynamic'
import weixin from './weixin'

const app = new Koa()

// middlewares
app.use(middleware())

// weixin
app.use(weixin())

// dynamic
app.use(dynamic())

export default app
