'use strict'

import Router, { IRouterContext } from 'koa-router'
import fetch from 'isomorphic-fetch'
import Mock from 'mockjs'
import _ from 'lodash'

export default (http: Router) => {
    http.all('/mock', async function (ctx: IRouterContext) {
        const { data } = await fetch('http://172.16.0.11/rap/rap_interface.php').then(res => res.json())
        const service = ctx.query.service
        const rapItem = data.filter(item => item.request_url.includes(service))[0]

        const project = (await fetch(`http://172.16.0.11/rap/rap_querydata.php?id=${rapItem.project_id}`)
            .then(res => res.json()))
        try {
            const json = project.map(item => JSON.parse(item.project_data))[0]
            const apiItem = {
                ...rapItem,
                ..._.flattenDeep(
                    json.moduleList.map(item => item.pageList.map(secItem => secItem.actionList))
                )
                    .filter(item => item.requestUrl.includes(service))[0],
            }
            const { responseParameterList, requestParameterList } = apiItem
            console.log(requestParameterList)

            ctx.body = DG(responseParameterList)
        } catch (error) {
            ctx.body = error
        }
    })
}

const arrayType = [
    // 'string', 'number', 'object', 'boolean',
    'array', 'array<string>', 'array<number>',
    'array<object>', 'array<boolean>'
]

function mockObject(childObj, target) {
    const mockData = Mock.mock({
        [`${target.identifier}|1-20`]: [childObj]
    })
    // console.log(mockData);
    return arrayType.includes(target.dataType) ? mockData[`${target.identifier}`] : childObj
}

function DG(responseParameterList) {
    let mockResponse = _.keyBy(responseParameterList, 'identifier')
    mockResponse = _.mapValues(mockResponse, (m1) => {
        if (m1.parameterList.length > 0) {
            let parameterListObj = _.keyBy(m1.parameterList, 'identifier')
            parameterListObj = _.mapValues(parameterListObj, (m2) => {
                if (m2.parameterList.length > 0) {
                    let parameterListObj1 = _.keyBy(m2.parameterList, 'identifier')
                    parameterListObj1 = _.mapValues(parameterListObj1, (m3) => {
                        if (m3.parameterList.length > 0) {
                            let parameterListObj2 = _.keyBy(m3.parameterList, 'identifier')
                            parameterListObj2 = _.mapValues(parameterListObj2, (m4) => {
                                if (m4.parameterList.length > 0) {
                                    let parameterListObj3 = _.keyBy(m4.parameterList, 'identifier')
                                    return mockObject(parameterListObj3, m4)
                                }
                                return Mock.mock(m4.remark)
                            })
                            return mockObject(parameterListObj2, m3)
                        }
                        return Mock.mock(m3.remark)
                    })
                    return mockObject(parameterListObj1, m2)
                }
                return Mock.mock(m2.remark)
            })
            return mockObject(parameterListObj, m1)
        }
        return Mock.mock(m1.remark)
    })
    return mockResponse
}