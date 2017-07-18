
'use strict'

import fs from 'fs'
import path from 'path'

const _projectsPath = path.resolve(__dirname, '../../data/projects.json')
const _menuPath = path.resolve(__dirname, '../../data/menus.json')

export default (router) => {
  router
    // 获取API列表
    .get('/menu', async function (ctx) {
      const projectsPath = _projectsPath
      const projectsObject = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'))

      const menuPath = _menuPath
      const menuObject = JSON.parse(fs.readFileSync(menuPath, 'utf-8'))
      // const menus=Object.keys(menuObject).map(item=>{
      //   return menuObject[item]
      // })
      const projects = Object.keys(projectsObject).map(item => {
        return projectsObject[item]
      })
      let mgtMenu = {}
      mgtMenu.projects = projects
      mgtMenu.menus = menuObject
      try {
        ctx.body = { code: 1, data: mgtMenu }
      } catch (e) {
        ctx.body = { code: -1, data: 'file_not_found', err: e }
      }
    })
    //新增一级菜单project
    .put('/project/:project', async function (ctx) {
      const projectsPath = _projectsPath
      const projectsObject = JSON.parse(fs.readFileSync(projectsPath, 'utf-8')) //一级菜单

      // const menuPath = _menuPath
      // const menuObject = JSON.parse(fs.readFileSync(menuPath, 'utf-8')) //二级菜单
      const newData = JSON.parse(ctx.params.project)

      function saveProjects(newData) {
        projectsObject.push(newData)

        return new Promise(function (resolve, reject) {
          try {
            fs.writeFile(projectsPath, JSON.stringify(projectsObject), (err => {
              if (err) throw err
              console.log('It\'s saved!')
            }))
          } catch (e) {
            reject(false)
          }
          resolve(true)
        })
      }
      const isSave = await saveProjects(newData)


      ctx.body = { code: 1, data: isSave }
    })


    .put('/mList/:route/:num', async function (ctx) {
      const projectsPath = _projectsPath
      const projectsObject = JSON.parse(fs.readFileSync(projectsPath, 'utf-8')) //一级菜单
      const key = ctx.params.num
      const route = ctx.params.route

      function saveProjectMlist(route, key) {
        for (var i = 0; i < projectsObject.length; i++) {
          if (projectsObject[i].route == route) {
            projectsObject[i].mList.push(Number(key))
            break
          }

        }
        return new Promise(function (resolve, reject) {
          try {
            fs.writeFile(projectsPath, JSON.stringify(projectsObject), (err) => {
              if (err) throw err
              console.log('SAVE project')
            })
          } catch (e) {
            reject(false)
          }
          resolve(true)
        })
      }
      const saveMlistNum = await saveProjectMlist(route, key)
      ctx.body = { code: 1, data: saveMlistNum }
    })

    //新增二级菜单Menu
    .put('/menu/:route/:num/:data', async function (ctx) {
      // const projectsPath = _projectsPath
      // const projectsObject = JSON.parse(fs.readFileSync(projectsPath, 'utf-8')) //一级菜单

      const menuPath = _menuPath
      const menuObject = JSON.parse(fs.readFileSync(menuPath, 'utf-8')) //二级菜单
      const newData = JSON.parse(ctx.params.data)
      const key = ctx.params.num


      function saveOneByKey(key, data) {
        const newMenu = Object.assign(menuObject, {
          [key]: {
            ...data,
          }
        })

        return new Promise(function (resolve, reject) {
          try {
            fs.writeFile(menuPath, JSON.stringify(newMenu), (err) => {
              if (err) throw err
              console.log('It\'s saved!')
            })
          } catch (e) {
            reject(false)
          }
          resolve(true)
        })
      }
      // const saveMlistNum=await saveProjectMlist(route,key)
      const isSave = await saveOneByKey(key, newData)
      ctx.body = { code: 1, data: isSave }
    })
    //一级开始删除
    .get('/project/:route/delete', async function (ctx) {
      const projectsPath = _projectsPath
      const projectsObject = JSON.parse(fs.readFileSync(projectsPath, 'utf-8')) //一级菜单

      const menuPath = _menuPath
      const menuObject = JSON.parse(fs.readFileSync(menuPath, 'utf-8')) //二级菜单
      const route = ctx.params.route
      console.log(projectsObject)

      for (var i = 0; i < projectsObject.length; i++) {
        if (projectsObject[i].route == route) {
          for (var j = 0; j < projectsObject[i].mList.length; j++) {
            delete menuObject[projectsObject[i].mList[j]]
          }
          projectsObject.splice(i, 1)
          break
        }
      }
      console.log(projectsObject, menuObject)

      function saveNewProject() {
        return new Promise(function (resolve, reject) {
          try {
            fs.writeFile(projectsPath, JSON.stringify(projectsObject), (err) => {
              if (err) throw err
              console.log('projectsObject ok')
            })
          } catch (e) {
            reject(false)
          }
          resolve(true)
        })
      }

      function saveNewMenu() {
        return new Promise(function (resolve, reject) {
          try {
            fs.writeFile(menuPath, JSON.stringify(menuObject), (err) => {
              if (err) throw err
              console.log('menuObject ok')
            })
          } catch (e) {
            reject(false)
          }
          resolve(true)
        })
      }
      const saveProject = saveNewProject()
      const saveMenu = saveProject ? saveNewMenu() : false
      ctx.body = { code: 1, data: saveMenu }
    })

    //二级开始删除
    .get('/menu/:key/:route/delete', async function (ctx) {
      const menuPath = _menuPath
      const menuObject = JSON.parse(fs.readFileSync(menuPath, 'utf-8')) //二级菜单
      const key = ctx.params.key
      const route = ctx.params.route

      function deleteMenu(key) {
        const newMenu = Object.assign({}, menuObject)
        return new Promise(function (resolve, reject) {
          if (newMenu[key]) {
            delete newMenu[key]
          } else {
            reject(false)
            return
          }
          try {
            fs.writeFile(menuPath, JSON.stringify(newMenu), (err) => {
              if (err) throw err
              console.log('ok')
            })
          } catch (e) {
            reject(false)
          }
          resolve(true)
        })
      }
      const del = await deleteMenu(key)
      const projectsPath = _projectsPath
      const projectsObject = JSON.parse(fs.readFileSync(projectsPath, 'utf-8')) //一级菜单
      function deleteProjectMlist(key, route) {
        for (var i = 0; i < projectsObject.length; i++) {
          if (projectsObject[i].route == route) {
            for (var j = 0; j < projectsObject[i].mList.length; j++) {
              if (projectsObject[i].mList[j] == Number(key)) {
                projectsObject[i].mList.splice(j, 1)
                break
              }
            }
            break
          }
        }
        return new Promise(function (resolve, reject) {
          try {
            fs.writeFile(projectsPath, JSON.stringify(projectsObject), (err) => {
              if (err) throw err
              console.log('it ok')
            })
          } catch (e) {
            reject(false)
          }
          resolve(true)
        })
      }

      const dele = del ? await deleteProjectMlist(key, route) : false

      ctx.body = { code: 1, data: dele }
    })
}
