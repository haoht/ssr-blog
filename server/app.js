/**
 * Created by unsad on 2017/5/9.
 */
global.Promise = require('bluebird');

const Koa = require('koa');
const log = require('./utils/log');
const mongoRest = require('./mongoRest');
const models = require('./model/mongo');
const redis = require('./model/redis');
const config = require('./conf/config');

const configName = process.env.NODE_ENV === '"development"' ? 'dev' : 'prod';

const devConfig = require(`./build/blogpack.${configName}.config`);
const Blogpack = require('./blogpack');
const lifecycle = new Blogpack(devConfig);

const app = new Koa();
const router = require('koa-router')();

(async () => {
  await lifecycle.beforeUseRoutes({
    config: lifecycle.config,
    app,
    router,
    models,
    redis
  })

  const beforeRestfulRoutes = lifecycle.getBeforeRestfulRoutes();
  const afterRestfulRoutes = lifecycle.getAfterRestfulRoutes();

  const middlewareRoutes = lifecycle.getMiddlewareRoutes();

  for (const item of middlewareRoutes) {
    const middlewares = [...item.middleware];
    item.needBeforeRoutes && middlewares.unshift(...beforeRestfulRoutes);
    item.needAfterRoutes && middlewares.push(...afterRestfulRoutes);

    router[item.method](item.path, ...middlewares);
  }

  Object.keys(models).map(name => models[name]).forEach(model => {
    mongoRest(router, model, '/api', {
      beforeRestfulRoutes,
      afterRestfulRoutes
    })
  });

  app.use(router.routes());

  const beforeServerStartArr = lifecycle.getBeforeServerStartFuncs();

  try {
    for (const middleware of beforeServerStartArr) {
      await middleware();
    }
    app.listen(config.serverPort, () => {
      log.info(`koa2 is running at ${config.serverPort}`)
    });
  } catch (err) {
    log.error(err)
  }
})();
