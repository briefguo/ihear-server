'use strict'

import Router, { IRouterContext } from 'koa-router'
import fetch from 'isomorphic-fetch'
import FormData from 'form-data'
import _ from 'lodash'

export default (http: Router) => {
    http.all('/cors', async function (ctx: IRouterContext) {
        try {
            // console.log(ctx.req);
            const form = new FormData()
            _.forEach(ctx.request.body.fields, (value, key) => {
                form.append(key, value)
            })
            ctx.body = await fetch(ctx.query.url, { method: 'POST', body: form })
                .then(res => res.text())
        } catch (error) {
            // console.log(error);
            ctx.body = error
        }
    })
}
