'use strict'

import _ from 'lodash'
import Router, { IRouterContext } from 'koa-router'
import fetch from 'isomorphic-fetch'
import Mock from 'mockjs'
import FormData from 'form-data'

export default (http: Router) => {
    http
        .get('/rap/projects', async function (ctx: IRouterContext) {
            const url = 'http://172.16.0.11/rap/rap_query.php'
            const json = await fetch(url, { method: 'GET' }).then(res => res.json())
            ctx.body = {
                ...json,
                data: json.data.map(item => ({
                    label: item.name,
                    value: item.id,
                }))
            }
        })
        .get('/automate/:wrap', async function (ctx: IRouterContext) {
            const _params = JSON.parse(ctx.params.wrap)
            const { pId, server } = _params
            const url = `http://172.16.0.11/rap/rap_querydata.php?id=${pId}`
            let json
            try {
                json = await fetch(url, { method: 'GET' }).then(res => res.json())
            } catch (error) {
                ctx.body = { code: -1, data: null, msg: '解析失败' }
                return
            }
            const res = json.map(item => {
                const projectData = JSON.parse(item.project_data)
                return projectData.moduleList.map(m => m.pageList.map(p => p.actionList))
            })
            const actionList = _.flatMapDeep(res)
            const paramList = actionList.map(action => {
                return _.mapValues(
                    _.keyBy(action.requestParameterList, 'identifier'),
                    ({ remark }) => Mock.mock(remark)
                )
            })
            const formDataList = paramList.map((item, index) => {
                const form = new FormData({})
                _.forEach(item, (value, key) => {
                    form.append(key, value)
                })
                return [
                    `${server}${actionList[index].requestUrl}`,
                    {
                        method: 'POST',
                        body: form
                    }
                ]
            })
            let data
            try {
                data = await Promise.all(
                    formDataList.map(([url, opts]) => {
                        return fetch(url, opts).then(res => res.text())
                    })
                )
            } catch (error) {
                ctx.body = { code: -1, data: null, error, msg: '解析失败' }
                return
            }
            data = data.map(item => {
                try {
                    return JSON.parse(item)
                } catch (error) {
                    return { code: -999, data: item, msg: '解析失败' }
                }
            })
            const zipedObject = _.zipWith(paramList, data, actionList, (a, b, c) => ({
                url: c.requestUrl.substr(c.requestUrl.indexOf('?service=') + 9, c.requestUrl.length),
                action: c,
                fullUrl: c.requestUrl,
                reqParam: a,
                resCode: b,
            }))
            const successObject = zipedObject.filter(item => item.resCode.code === 1 && item.url)
            const failObject = zipedObject.filter(item => item.resCode.code !== 1 && item.url)
            const fatalFailObject = zipedObject.filter(item => item.resCode.code === -999 && item.url)
            ctx.body = {
                code: 1,
                fatal: fatalFailObject,
                success: successObject,
                fail: failObject,
                data: zipedObject,
                msg: ''
            }
        })
}
