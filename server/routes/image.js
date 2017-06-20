/*eslint-disable no-console*/
'use strict'

import fs from 'mz/fs'
import path from 'path'
import Busboy from 'busboy'


const __imagesPath = path.resolve(__dirname, '../../data/images')

function uploadFile(ctx, options) {
  let busboy = new Busboy({ headers: ctx.req.headers })
  let fileType = options.fileType
  return new Promise(function (resolve, reject) {
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      // console.log(fieldname, file, filename, encoding, mimetype);
      if (!mimetype.includes(fileType)) {
        reject({
          code: -1,
          message: '文件格式错误'
        })
        return
      }

      let fileName = path.resolve(__imagesPath, filename)
      // console.log(fileName);

      // 文件保存到制定路径
      file.pipe(fs.createWriteStream(fileName))

      // 文件写入事件结束
      file.on('end', function () {
        console.log('文件上传成功！')
        resolve({
          code: 1,
          message: '文件上传成功'
        })
      })
    })
    // 解析结束事件
    busboy.on('finish', function () {
      console.log('文件上结束')
      resolve({
        code: 1,
        message: '文件上结束'
      })
    })

    // 解析错误事件
    busboy.on('error', function (err) {
      console.log('文件上出错')
      reject({
        code: -1,
        err
      })
    })

    ctx.req.pipe(busboy)
  })
}

export default (router) => {
  router
    // 获取API列表
    .post('/upload', async function (ctx) {
      try {
        const result = await uploadFile(ctx, {
          fileType: 'image',
          path: __imagesPath
        })
        ctx.body = result
      } catch (err) {
        ctx.status = err.status || 500
        ctx.body = err
      }
    })
    .delete('/images/**', async function (ctx) {
      try {
        const deletePath = path.resolve(__imagesPath, ctx.request.url.replace('/images/', ''))
        const res = await fs.unlink(`${decodeURIComponent(deletePath)}`)
        ctx.body = { code: 1, data: res }
      } catch (err) {
        ctx.body = { code: -1, data: err }
      }
    })
    .get('/images', async function (ctx) {
      const allImages = []
      let outputDirs = []

      function readdir(__path) {
        const dirs = fs.readdirSync(__path)
        const isHasDir = dirs
          .filter(item => fs.statSync(path.resolve(__path, item)).isDirectory())

        for (let dir of dirs) {
          const currentPath = path.resolve(__path, dir)
          const dirStats = fs.statSync(currentPath)
          const outputPath = currentPath.replace(__imagesPath, 'images')

          if (dirStats.isDirectory()) {
            outputDirs.push(outputPath)
            readdir(currentPath)
          }

          if (dirStats.isFile()) {
            allImages.push(outputPath)
          }
        }

        if (isHasDir.length == 0) {

          ctx.body = { allImages, outputDirs }

        }
      }

      try {
        readdir(__imagesPath)
      } catch (err) {
        ctx.body = { code: -1, err }
        ctx.status = 500
      }

    })
}
