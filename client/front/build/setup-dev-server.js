/**
 * Created by unsad on 2017/9/24.
 */
const path = require('path');
const webpack = require('webpack');
const MFS = require('memory-fs');
const proxyTable = require('../config/index').dev.proxyTable;
const clientConfig = require('./webpack.client.config');
const serverConfig = require('./webpack.server.config');
const proxyMiddleware = require('http-proxy-middleware');

const readFile = (fs, file) => {
  try {
    return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8');
  } catch (e) {

  }
};

module.exports = function setupDevServer(app, cb) {
  let bundle, clientManifest;
  let resolve;
  const readyPromise = new Promise(r => {
    resolve = r;
  });
  const ready = (...args) => {
    resolve();
    cb(...args);
  };

// modify client config to work with hot middleware
  clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app];
  clientConfig.output.filename = '[name].js';
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );

// dev middleware
  const clientCompiler = webpack(clientConfig);
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true
  });
  app.use(devMiddleware);
  clientCompiler.plugin('done', stats => {
    stats = stats.toJson();
    stats.errors.forEach(err => console.error(err));
    stats.warnings.forEach(err => console.warn(err));
    if (stats.errors.length) return;

    clientManifest = JSON.parse(readFile(
      devMiddleware.fileSystem,
      'vue-ssr-client-manifest.json'
    ));
    if (bundle) {
      ready(bundle, {
        clientManifest
      })
    }
  });

  // hot middleware
  app.use(require('webpack-hot-middleware')(clientCompiler, {heartbeat: 5000}));

  // proxy middleware
  Object.keys(proxyTable).forEach(function (context) {
    let options = proxyTable[context];
    if (typeof options === 'string') {
      options = {target: options}
    }
    app.use(proxyMiddleware(context, options))
  });

  // watch and update server renderer
  const serverCompiler = webpack(serverConfig);
  const mfs = new MFS();
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    if (err)  throw err;
    stats = stats.toJson();
    if (stats.errors.length) return;

    // read bundle generated by vue-ssr-webpack-plugin
    bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'));
    if (clientManifest) {
      ready(bundle, {
        clientManifest
      })
    }
  });

  return readyPromise;
};

