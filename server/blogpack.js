/**
 * Created by unsad on 2017/11/21.
 */
class blogpack {
  constructor(options) {
    this.config = options.config || {}
    this.plugins = options.plugins || []
  }

  run() {
    for (const plugin of this.plugins) {
      plugin.apply()
    }
  }

  async beforeUseRoutes(...args) {
    for (const plugin of this.plugins) {
      plugin.beforeUseRoutes && await plugin.beforeUseRoutes(...args)
    }
  }
  getMiddlewareRoutes(...args) {
    return this.plugins
      .filter(plugin => {
        return Object.assign({}, plugin.mountingRoute(), {
          needBeforeRoutes: plugin.needBeforeRoutes || false,
          needAfterRoutes: plugin.needAfterRoutes || false
        })
      })
  }

  getBeforeRestfulRoutes() {
    return this.plugins
      .filter(plugin => plugin['beforeRestful'])
      .map(plugin => plugin['beforeRestful'])
  }

  getAfterRestfulRoutes() {
    return this.plugins
      .filter(plugin => plugin['afterRestful'])
      .map(plugin => plugin['afterRestful'])
  }

  getBeforeServerStartFuncs() {
    return this.plugins
      .filter(plugin => plugin['beforeServerStart'])
      .map(plugin => plugin['beforeServerStart'])
  }
}

class DefinePlugin {
  constructor(options) {
    this.options = options
  }

  apply() {
    for (const i in this.options) {
      console.log(i, this.options[i])
    }
  }
}

blogpack.DefinePlugin = DefinePlugin

module.exports = blogpack