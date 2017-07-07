/*eslint-disable no-console*/
'use strict'

import superagent from 'superagent'
import cheerio from 'cheerio'

export default (router) => {
  router
    .get('/github/:path', async function (ctx) {
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
