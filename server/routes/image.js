/*eslint-disable no-console*/
'use strict'

import fs from 'mz/fs'
import path from 'path'

const __imagesPath = path.resolve(__dirname, '../../data/images')

export default (router) => {
  router
    // 获取API列表
    .post('/upload', async function (ctx) {
      // __imagesPath
    })
    .get('/images', async function (ctx) {
      const targetHost = ctx.request.header.host
      const allImages = []

      function readdir(__path) {
        const dirs = fs.readdirSync(__path)
        const isHasDir = dirs
          .filter(item => fs.statSync(path.resolve(__path, item)).isDirectory())

        for (let dir of dirs) {
          const currentPath = path.resolve(__path, dir)
          const dirStats = fs.statSync(currentPath)

          if (dirStats.isDirectory()) {
            readdir(currentPath)
          }

          if (dirStats.isFile()) {
            allImages.push(currentPath.replace(__imagesPath, `http://${targetHost}/images`))
          }
        }

        if (isHasDir.length == 0) {

          ctx.body = allImages

        }
      }

      readdir(__imagesPath)

    })
}
