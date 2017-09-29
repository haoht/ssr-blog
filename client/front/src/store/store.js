/**
 * Created by unsad on 2017/9/25.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import api from './index';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    itemsPerPage: 10,
    totalPage: -1,
    item: [],
    achieves: {},
    blog: {},
    prev: {},
    next: {},
    siteInfo: {
      github_url: {
        value: ''
      },
      title: {
        value: ''
      },
      logo_url: {
        value: ''
      }
    }
  },
  actions: {
    FETCH_BLOG: ({commit, state}, {path}) => {
      return api.fetchPostByPathName(path).then(blog => {
        commit('SET_BLOG', {blog});
        let first = api.fetchPrevPostByPathName(blog._id).then(post => {
          if (post.type === '0') {
            commit('SET_PREV', {post});
          }
        });
        let second = api.fetchNextPostByPathName(blog._id).then(post => {
          if (post.type === '0') {
            commit('SET_NEXT', {post});
          }
        });
        return Promise.all([first, second]);
      });
    },
    FETCH_ITEMS: ({commit, state}, {queryJSON, page}) => {
      return api.fetchBlogByPage(queryJSON, page).then(items => {
        commit('SET_ITEMS', {items});
        if (state.totalPage === -1) {
          return api.fetchBlogCount({
            type: 0
          }).then(totalPage => {
            commit('SET_PAGES', {totalPage});
          });
        } else return '';
      });
    },
    FETCH_ACHIEVE: ({commit, state}) => {
      return api.fetchAllBlog().then(items => {
        let sortedItem = items.reduce((prev, curr) => {
          let time = curr.createdAt.slice(0, 7).replace('-', '年') + '月';
          if (typeof prev[time] === 'undefined') {
            prev[time] = [curr];
          } else {
            prev[time].push(curr);
          }
          return prev;
        }, {});
        commit('SET_ACHIEVE', { sortedItem });
      });
    },
    FETCH_OPTIONS: ({commit, state}) => {
      return api.fetchOption().then(optionArr => {
        let obj = optionArr.reduce((prev, curr) => {
          prev[curr.key] = curr;
          return prev;
        }, {});
        commit('SET_OPTIONS', { obj });
      });
    }
  },
  mutations: {
    SET_BLOG: (state, { blog }) => {
      Vue.set(state, 'blog', blog);
    },
    SET_PREV: (state, { post }) => {
      Vue.set(state, 'prev', post);
    },
    SET_NEXT: (state, { post }) => {
      Vue.set(state, 'next', post);
    },
    SET_ITEMS: (state, { items }) => {
      items.forEach((item, index) => {
        if (item) {
          Vue.set(state.items, index, item);
        }
      });
    },
    SET_PAGES: (state, {totalPage}) => {
      Vue.set(state, 'totalPage', totalPage);
    },
    SET_ACHIEVE: (state, {sortedItem}) => {
      Vue.set(state, 'achieves', sortedItem);
    },
    SET_OPTIONS: (state, { obj }) => {
      Vue.set(state, 'siteInfo', obj);
    }
  },
  getters: {
    items (state, getters) {
      const { items, itemsPerPage} = state;
      return items;
    },
    siteInfo(state, getters) {
      const {siteInfo} = state;
      return siteInfo;
    },
    achieves(state, getters) {
      const {achieves} = state;
      return achieves;
    }
  }
});
