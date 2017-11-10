/**
 * Created by unsad on 2017/11/10.
 */
export default {
  watch: {
    '$route': 'resetDisqus'
  },
  methods: {
    reset (dsq) {
      const self = this
      dsq.reset({
        reload: true,
        config: function () {
          this.page.identifier = (self.$route.path || window.location.pathname)
          this.page.url = window.location.href
        }
      })
    },
    resetDisqus (val, oldVal) {
      if (val.path === oldVal.path) return
      if (window.DISQUS) {
        this.reset(window.DISQUS)
      }
    }
  }
}
