/*eslint-disable no-console*/
'use strict'

import fs from 'fs'
import path from 'path'
import cheerio from 'cheerio'

const svg = getSvg()
let $ = cheerio.load(svg)

function getIdList() {
  return Array.from($('symbol')).map(item => item.attribs.id)
}

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

function getSvgPath() {
  const svgPath = path.resolve(__dirname, '../../data/svg.html')
  return svgPath
}

function getSvg() {
  const svgPath = getSvgPath()
  const svg = fs.readFileSync(svgPath, 'utf-8')
  return svg
}

function getSymbolById(symbolId) {

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

function removeSymbolById(symbolId) {
  const targetSymbol = getSymbolById(symbolId)

  if (!targetSymbol) {
    return false
  }
  targetSymbol.remove()
  return $.html()
}

function appendSymbol($, item) {
  const { viewBox, id, g } = item

  let perSymbolHTML

  perSymbolHTML = getSymbolById(id)

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

export default (router) => {
  router
    .get('/svg/', async function (ctx) {
      ctx.body = { code: 1, data: getSvg(), ids: getIdList() }
    })
    .get('/svg/:id', async function (ctx) {
      try {
        const perSvg = getSymbolById(ctx.params.id)
        ctx.body = { code: 1, data: `${perSvg}` }
      } catch (e) {
        ctx.body = { code: -1, data: e }
      }
    })
    .delete('/svg/:id', async function (ctx) {
      const deleteId = ctx.params.id
      const newHTML = removeSymbolById(deleteId)

      if (!newHTML) {
        ctx.body = { code: -1, data: '不存在' }
        return
      }
      ctx.body = await saveSvg(getSvgPath(), newHTML)
    })
    .put('/svg/update/:id/:newValue', async function (ctx) {
      try {
        const perSvg = getSymbolById(ctx.params.id)
        perSvg.attr('id', `icon-${ctx.params.newValue}`)
        perSvg.find('title').html(ctx.params.newValue)

        ctx.body = await saveSvg(getSvgPath(), $.html())
      } catch (e) {
        console.log(e)
        ctx.body = { code: -1, data: e }
      }
    })
    .put('/svg/createOne/:data', async function (ctx) {
      try {
        ctx.params.data = parseData(ctx.params.data)

        let $ = cheerio.load(getSvg())
        let errFlag
        const newHTML = appendSymbol($, ctx.params.data)
        if (!newHTML) {
          errFlag++
        }

        if (errFlag) {
          ctx.body = { code: -1, data: '重复' }
          return
        }

        ctx.body = await saveSvg(getSvgPath(), newHTML)
      } catch (e) {
        console.log(e)
      }
    })
    .put('/svg/createSome/:data', async function (ctx) {

      try {
        ctx.params.data = parseData(ctx.params.data)

        let errFlag = 0
        ctx.params.data.map((item) => {
          const newHTML = appendSymbol($, item)
          if (!newHTML) {
            errFlag++
          }
        })

        if (errFlag) {
          ctx.body = { code: -1, data: '重复' }
          return
        }

        ctx.body = await saveSvg(getSvgPath(), $.html())

      } catch (e) {
        console.log(e)
      }
    })

}
