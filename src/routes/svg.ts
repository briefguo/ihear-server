
'use strict'

import fs from 'fs'
import path from 'path'
import cheerio from 'cheerio'
import Router, { IRouterContext } from 'koa-router'

function saveSvg(path, html) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, html, (err) => {
      if (err) {
        reject({ code: -1, data: `文件写入失败` })
        return
      }
      console.log('It\'s saved!')
      resolve({ code: 1, data: `OK` })
    })
  })
}

function getSvgPath(projectId = 'mgt') {
  const svgPath = path.resolve(__dirname, `../../data/svg-${projectId}.html`)
  return svgPath
}

function getSvg(projectId) {
  const svgPath = getSvgPath(projectId)
  const svg = fs.readFileSync(svgPath, 'utf-8')
  return svg
}

function getSymbolById($, symbolId) {

  let perSymbolHTML, perSymbol

  try {
    perSymbol = $(`symbol#icon-${symbolId}`)
    perSymbolHTML = `${perSymbol}`
  } catch (e) {
    console.log(e)
    perSymbolHTML = false
  }

  if (!perSymbolHTML) {
    return false
  } else {
    return perSymbol
  }
}

function removeSymbolById($, symbolId) {
  const targetSymbol = getSymbolById($, symbolId)

  if (!targetSymbol) {
    return false
  }
  targetSymbol.remove()
  return $.html()
}

function appendSymbol($, item) {
  const { viewBox, id, g } = item

  let perSymbolHTML

  perSymbolHTML = getSymbolById($, id)

  if (perSymbolHTML) {
    return false
  }

  $('defs').append(
    `<symbol id="icon-${id}" viewBox="${viewBox}">
      <title>${id}</title>
      ${g}
    </symbol>`
  )
  return $.html()
}

function parseData(text) {
  try {
    text = JSON.parse(text)
  } catch (e) {
    text = new Error({ code: -1, data: `${text}不是一个JSON` })
  } finally {
    return text
  }
}

function getIdList($) {
  return Array.from($('symbol')).map(item => item.attribs.id.replace('icon-', ''))
}

export default (router: Router) => {
  router
    // TODO: 兼容mgt，后期去掉
    .get('/svg', async function(ctx: IRouterContext) {
      let $ = cheerio.load(getSvg('mgt'))
      ctx.body = { code: 1, data: getSvg('mgt'), ids: getIdList($) }
    })
    .get('/svg/:projectId', async function(ctx: IRouterContext) {
      let $ = cheerio.load(getSvg(ctx.params.projectId))
      ctx.body = { code: 1, data: getSvg(ctx.params.projectId), ids: getIdList($) }
    })
    .get('/svg/:projectId/:id', async function(ctx: IRouterContext) {
      try {
        let $ = cheerio.load(getSvg(ctx.params.projectId))
        const perSvg = getSymbolById($, ctx.params.id)
        ctx.body = { code: 1, data: `${perSvg}` }
      } catch (e) {
        ctx.body = { code: -1, data: e }
      }
    })
    .delete('/svg/:projectId/:id', async function(ctx: IRouterContext) {
      let $ = cheerio.load(getSvg(ctx.params.projectId))
      const deleteId = ctx.params.id
      const newHTML = removeSymbolById($, deleteId)

      if (!newHTML) {
        ctx.body = { code: -1, data: '不存在' }
        return
      }

      ctx.body = await saveSvg(getSvgPath(ctx.params.projectId), newHTML)
    })
    .put('/svg/:projectId/:id/:newValue', async function(ctx: IRouterContext) {
      try {
        let $ = cheerio.load(getSvg(ctx.params.projectId))
        const perSvg = getSymbolById($, ctx.params.id)
        perSvg.attr('id', `icon-${ctx.params.newValue}`)
        perSvg.find('title').html(ctx.params.newValue)

        ctx.body = await saveSvg(getSvgPath(ctx.params.projectId), $.html())
      } catch (e) {
        console.log(e)
        ctx.body = { code: -1, data: e }
      }
    })
    .post('/svg/:projectId/:newSvgArray', async function(ctx: IRouterContext) {

      try {
        ctx.params.newSvgArray = parseData(ctx.params.newSvgArray)
        let $ = cheerio.load(getSvg(ctx.params.projectId))
        let errFlag = 0
        ctx.params.newSvgArray.map((item) => {
          const newHTML = appendSymbol($, item)
          if (!newHTML) {
            errFlag++
          }
        })

        if (errFlag) {
          ctx.body = { code: -1, data: '重复' }
          return
        }

        ctx.body = await saveSvg(getSvgPath(ctx.params.projectId), $.html())

      } catch (e) {
        console.log(e)
      }
    })

}
