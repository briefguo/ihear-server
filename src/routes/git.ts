'use strict';
import Router, { IRouterContext } from 'koa-router';
var exec = require('child_process').exec;

export default (http: Router, socketIO: SocketIO.Server) => {
  http.get('/git', async (ctx: IRouterContext) => {
    try {
      console.log(ctx.query);
      // const repoDir = path.resolve('./');
      const { repoDir, branchMapJSON } = ctx.query;
      const cmdStr = `cd ${repoDir} && git pull`;
	exec(cmdStr, function(err,stdout,stderr){
	});
      ctx.body = { code: 1 };
    } catch (error) {
	console.log(error)
      ctx.body = { code: -999, error };
    }
  });
};
