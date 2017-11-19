/**
 * Created by unsad on 2017/5/9.
 */
const Koa = require('koa');
const log = require('./utils/log');
const router = require('koa-router')();
const fs = require('fs');
const path = require('path');

const bodyParser = require('koa-bodyparser');
const koa2RestMongoose = require('./mongo_rest/index');
const models = require('./model/mongo');
const tokenService = require('./service/token');
const redis = require('./model/redis');
const config = require('./conf/config.tpl');
const option = require('./conf/option');
const getQiniuTokenFromFileName = require('./service/qiniu');
const {login, logout, permission} = require('./routes/admin');
const restc = require('restc');
const bluebird = require('bluebird');
const resolve = file => path.resolve(__dirname, file);
global.Promise = bluebird;

const app = new Koa();
app.use(bodyParser());

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  log.info(`${ctx.method} ${decodeURIComponent(ctx.url)} - ${ms}ms`);
});

app.use(restc.koa2());

router.post('/admin/qiniu', permission, (ctx, next) => {
  const { key } = ctx.request.body;
  ctx.body = getQiniuTokenFromFileName(key);
});
router.post('/admin/login', login);
router.post('/admin/logout', logout);

Object.keys(models).forEach(value => {
  koa2RestMongoose(app, router, models[value], '/api', permission);
});

(async () => {
  let count = await models.user.find().count().exec();
  console.log(count)
  if (count === 0) {
    if (config.defaultAdminPassword === 'admin') {
      log.error('you must change the default password at ./conf/confjg.js');
      log.error('koa2 refused to start bacause of weak password');
      return process.exit(1);
    }

    let result = await models.user.create({
      name: config.defaultAdminName,
      password: config.defaultAdminPassword,
      displayName: config.defaultAdminName,
      email: ''
    });

    log.info(`account '${result.name}' with password '${result.password}' is created`);

    await initOption();
  }

  await installTheme();

  app.listen(config.serverPort);

  log.debug(`koa2 is running at ${config.serverPort}`);

})();

async function installTheme() {
  let fileArr = fs.readdirSync(resolve('./theme'));
  for (let i = 0, len = fileArr.length; i < len; i++) {
    let fileName = fileArr[i];
    let theme = require(`./theme/${fileName}`);
    let count = await models.theme.find({name: theme.name}).count().exec();
    if (count === 0) {
      await models.theme.create(theme);
      log.info(`theme ${theme.name} created`);
    }
  }
}

async function initOption() {
  for (let i = 0, len = option.length; i < len; i++) {
    let key = option[i].key;
    let value = option[i].value;
    let count = await models.option.find({key}).count().exec();
    if (count === 0) {
      await models.option.create(option[i]);
      log.info(`Option ${key} created`);
    }
  }
}
