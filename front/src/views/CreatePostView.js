/**
 * Created by unsad on 2017/11/14.
 */
import { mapGetters } from 'vuex';
import Post from '../components/Post.vue';
import mock404 from '../utils/404';

export default function (type) {
  const isPost = type === 'post';
  const action = isPost ? 'FETCH_BLOG' : 'FETCH_PAGE';
  const regExp = isPost ? /^\/post\//g : /^\//g;
  const select = isPost ? { tags: 1, category: 1 } : {};
  return {
    metaInfo () {
      return {
        title: this.post.title
      };
    },
    name: `${type}-view`,
    computed: {
      ...mapGetters([
        'prev',
        'next',
        'siteInfo'
      ]),
      post () {
        const target = isPost ? this.$store.state.blog : this.$store.state.page;
        return target.pathName ? target : mock404;
      }
    },
    asyncData({store, route: { path: pathName, params, query }}, callback) {
      pathName = decodeURIComponent(pathName.replace(regExp, ''));
      return store.dispatch(action, {
        model: 'post',
        query: {
          conditions: {
            pathName,
            isPublic: true,
            type
          },
          select: Object.assign({
            title: 1,
            createdAt: 1,
            content: 1,
            toc: 1,
            updatedAt: 1,
            pathName: 1,
            allowComment: 1
          }, select)
        },
        callback
      });
    },
    render (h) {
      return h(Post, {
        props: {
          type,
          post: this.post,
          prev: this.prev,
          next: this.next,
          siteInfo: this.siteInfo
        }
      });
    }
  };
}
