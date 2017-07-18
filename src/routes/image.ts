
'use strict'

import fs from 'mz/fs'
import path from 'path'
import Busboy from 'busboy'
import Router, { IRouterContext } from 'koa-router'
const _imagesPath = path.resolve(__dirname, '../../data/images')

function uploadFile(ctx: IRouterContext, options) {
  let busboy = new Busboy({ headers: ctx.req.headers })
  let fileType = options.fileType
  return new Promise(function(resolve, reject) {
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      // console.log(fieldname, file, filename, encoding, mimetype);
      if (!mimetype.includes(fileType)) {
        reject({
          code: -1,
          message: '文件格式错误'
        })
        return
      }

      let fileName = path.resolve(_imagesPath, filename)
      // console.log(fileName);

      // 文件保存到制定路径
      file.pipe(fs.createWriteStream(fileName))

      // 文件写入事件结束
      file.on('end', function() {
        console.log('文件上传成功！')
        resolve({
          code: 1,
          message: '文件上传成功'
        })
      })
    })
    // 解析结束事件
    busboy.on('finish', function() {
      console.log('文件上结束')
      resolve({
        code: 1,
        message: '文件上结束'
      })
    })

    // 解析错误事件
    busboy.on('error', function(err) {
      console.log('文件上出错')
      reject({
        code: -1,
        err
      })
    })

    ctx.req.pipe(busboy)
  })
}

function readDir(__path) {
  const allImages = []
  const outputDirs = []
  // let imageArr = fs.readdirSync(_imagesPath).map(item => `images/${item}`)
  return new Promise(function(resolve, reject) {
    function readdir(__path, prePath) {
      const dirs = fs.readdirSync(__path)
      // console.log(dirs)
      const isHasDir = dirs
        .filter(item => fs.statSync(path.resolve(__path, item)).isDirectory())

      for (let dir of dirs) {
        const currentPath = path.resolve(__path, dir)
        const dirStats = fs.statSync(currentPath)
        const outputPath = currentPath.replace(_imagesPath, 'images')

        if (dirStats.isFile()) {
          if (!prePath) {
            // imageArr[outputPath] = 'file'
          } else {
            // console.log(prePath);
            // if(imageArr[prePath]){
            //   
            // }
          }
          allImages.push(outputPath)
        }

        if (dirStats.isDirectory()) {
          // console.log('outputPath', outputPath);

          readdir(currentPath, outputPath)
          // if (!imageArr[prePath]) {
          //   imageArr[prePath] = {}
          // } else {
          //   imageArr[prePath][outputPath] = 'dir'
          // }

          outputDirs.push(outputPath)

        }
      }

      if (isHasDir.length == 0) {

        resolve({ allImages, outputDirs })

      }
    }

    try {
      readdir(__path)
    } catch (err) {
      reject(err)
    }
  })
}

function getDir(_path) {
  const output = {}
  return new Promise(function(resolve, reject) {
    function readdir(__path) {
      // 列出当前目录的内容
      const dirs = fs.readdirSync(__path)
      const _dirs = []
      // 遍历目录
      for (let dir of dirs) {
        const currentPath = path.resolve(__path, dir)
        const dirStats = fs.statSync(currentPath)

        if (dirStats.isDirectory()) {
          _dirs.push(currentPath)
        }
      }
      const _outputPath = __path.replace(_imagesPath, '.')

      output[_outputPath] = dirs

      _dirs.map(item => readdir(item))
    }

    try {
      readdir(_path)

      resolve(output)

    } catch (err) {
      reject(err)
    }
  })
}

export default (router: Router) => {
  router
    // 获取API列表
    .post('/upload', async function(ctx: IRouterContext) {
      try {
        const result = await uploadFile(ctx, {
          fileType: 'image',
          path: _imagesPath
        })
        ctx.body = result
      } catch (err) {
        ctx.status = err.status || 500
        ctx.body = err
      }
    })
    .delete('/images/**', async function(ctx: IRouterContext) {
      try {
        const deletePath = path.resolve(_imagesPath, ctx.request.url.replace('/images/', ''))
        const res = await fs.unlink(`${decodeURIComponent(deletePath)}`)
        ctx.body = { code: 1, data: res }
      } catch (err) {
        ctx.body = { code: -1, data: err }
      }
    })
    .get('/images', async function(ctx: IRouterContext) {
      try {
        const output = await readDir(_imagesPath)
        const dirs = await getDir(_imagesPath)
        ctx.body = { ...output, dirs }
      } catch (err) {
        ctx.body = { code: -1, err }
        ctx.status = 500
      }

    })
}
