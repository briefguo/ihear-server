'use strict';
import Router, { IRouterContext } from 'koa-router';
var exec = require('child_process').exec;

const execPromise = async (cmdStr) => {
  return new Promise((resolve) => {
    exec(cmdStr, function (err, stdout, stderr) {
      if (err) {
        resolve(stderr)
      } else {
        resolve(stdout)
      }
    })
  })
}

export default (http: Router) => {
  http.get('/git', async (ctx: IRouterContext) => {
    try {
      const { repoDir } = ctx.query
      const cmdStr = `cd ${repoDir} && git pull`
      const result = await execPromise(cmdStr)
      ctx.body = result
    } catch (error) {
      // console.log(error)
      ctx.body = { code: -999, error };
    }
  });
};
