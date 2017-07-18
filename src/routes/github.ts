
'use strict'

import superagent from 'superagent'
import cheerio from 'cheerio'
import Router, { IRouterContext } from 'koa-router'

export default (router: Router) => {
  router
    .get('/github/:path', async function(ctx: IRouterContext) {
      const res = await superagent.get(`https://github.com/briefguo/${ctx.params.path}`)
      try {
        const $ = cheerio.load(res.text)
        const urlList = Array.from($('table.files tr.js-navigation-item td.content a'))
        ctx.body = {
          code: 1,
          data: urlList.map(item => ({
            title: item.attribs.title,
            href: `https://github.com${item.attribs.href}`
          }))
        }
      } catch (e) {
        ctx.body = {
          code: -1,
          data: e
        }
      }
    })
}
