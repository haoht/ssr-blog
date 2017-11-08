/**
 * Created by unsad on 2017/10/16.
 */
let qiniu = require('qiniu');
let {
  qiniuBucketHost: bucketHost,
  qiniuAccessKey,
  qiniuSecretKey,
  qiniuBucketName,
  qiniuPipeline
} = require('../conf/config');

qiniu.conf.ACCESS_KEY = qiniuAccessKey;
qiniu.conf.SECRET_KEY = qiniuSecretKey;

let fops = 'imageMogr2/format/webp';

const policy = (name, fileName) => {
  let encoded = new Buffer(`${qiniuBucketName}:webp/${fileName}`).toString('base64');
  let persist;
  if (qiniuPipeline !== '') {
    persist = {
      persistentOpts: `${fops}|saveas/${encoded}`,
      persistentPipeline: qiniuPipeline
    }
  } else {
    persist = {};
  }
  return Object.assign({}, persist, {
    scope: name,
    deadline: new Date().getTime() + 600
  });
};

const getQiniuTokenFromFileName = fileName => {
  let key = `${qiniuBucketName}:${fileName}`;
  let putPolicy = new qiniu.rs.PutPolicy2(policy(key, fileName));

  let upToken = putPolicy.token();

  return {
    upToken,
    key,
    bucketHost,
    supportWebp: qiniuPipeline !== ''
  }
};

module.exports = getQiniuTokenFromFileName;