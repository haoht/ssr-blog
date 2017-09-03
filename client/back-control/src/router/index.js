import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Logout from '@/components/Logout'
import App from '@/App'
import Dashboard from '@/components/Dashboard'
import Tip from '@/components/Tip'
import Sidebar from '@/components/Sidebar'
import PostList from '@/components/PostList'
import PageList from '@/components/PageList'
import TagList from '@/components/TagList'
import CateList from '@/components/CateList'
import TagCreate from '@/components/TagCreate'
import PostCreate from '@/components/PostCreate'
import PageCreate from '@/components/PageCreate'
import CateCreate from '@/components/CateCreate'
import UserList from '@/components/UserList'
import OptionGeneral from '@/components/OptionGeneral'
import OptionComment from '@/components/OptionComment'
import OptionAnalytic from '@/components/OptionAnalytic'
import UpdateCreate from '@/components/UpdateCreate'
import UpdateList from '@/components/UpdateList'

Vue.use(Router);

let router = new Router({
  mode: history,
  routes: [
    {
      path: '/admin/login',
      component: Login,
      auth: false
    },
    {
      path: '/admin/logout',
      component: Logout,
      auth: false
    },
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      auth: true
    },
    {
      path: '/post',
      name: 'post',
      component: App,
      auth: true,
      children: [
        {
          path: 'list',
          components: PostList,
          auth: true
        },
        {
          path: 'create',
          components: PostCreate,
          auth: true
        },
        {
          path: 'edit/:id',
          components: PostCreate,
          auth: true
        }
      ]
    },
    {
      path: '/page',
      name: 'page',
      components: App,
      auth: true,
      children: [
        {
          path: 'list',
          components: PageList,
          auth: true
        },
        {
          path: 'create',
          components: PageCreate,
          auth: true
        },
        {
          path: 'edit/:id',
          components: PageCreate,
          auth: true
        }
      ]
    },
    {
      path: '/user',
      name: 'user',
      components: App,
      auth: true,
      children: [
        {
          path: 'list',
          components: UserList,
          auth: true
        }
      ]
    },
    {
      path: '/cate',
      name: 'cate',
      components: App,
      auth: true,
      children: [
        {
          path: 'list',
          components: CateList,
          auth: true
        },
        {
          path: 'create',
          components: CateCreate,
          auth: true
        },
        {
          path: 'edit/:id',
          components: CateCreate,
          auth: true
        }
      ]
    },
    {
      path: '/tag',
      components: App,
      auth: true,
      children: [
        {
          path: 'list',
          components: TagList,
          auth: true
        },
        {
          path: 'create',
          components: TagCreate,
          auth: true
        },
        {
          path: 'edit/:id',
          components: TagCreate,
          auth: true
        }
      ]
    },
    {
      path: '/update',
      name: 'update',
      components: App,
      auth: true,
      children: [
        {
          path: 'list',
          component: UpdateList,
          auth: true
        },
        {
          path: 'create',
          component: UpdateCreate,
          auth: true
        },
        {
          path: 'edit/:id',
          name: 'editUpdate',
          component: UpdateCreate,
          auth: true
        }
      ]

    },
    {
      path: '/option',
      name: 'option',
      components: App,
      auth: true,
      children: [
        {
          path: 'general',
          components: OptionGeneral,
          auth: true
        },
        {
          path: 'comment',
          components: OptionComment,
          auth: true
        },
        {
          path: 'analytic',
          components: OptionAnalytic,
          auth: true
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/post',
      redirect: '/post/list'
    },
    {
      path: '/page',
      redirect: '/page/list'
    },
    {
      path: '/tag',
      redirect: '/tag/list'
    },
    {
      path: '/cate',
      redirect: '/cate/list'
    },
    {
      path: '/user',
      redirect: '/user/list'
    },
    {
      path: '/option',
      redirect: '/option/general'
    }
  ]
});

router.beforeEach(function (transition) {
  let authenticated = true;
  let token = localStorage.getItem('token');
  if (!token) {
    authenticated = false;
  }
  if (transition.to.path !== '/admin/login' && transition.to.auth && !authenticated) {
    transition.redirect('/admin/login');
  } else {
    transition.next();
  }
});

router.afterEach(transition => {
  if (transition.to.router._children[0] && typeof transition.to.router._children[0].currentRoute !== 'undefined') {
    let arr = transition.to.path.split('/').filter(value => value != '').filter((value, index) => index < 2).map(value => {
      if (value === 'edit') {
        value = 'create';
      }
      return value;
    });
    if (transition.to.router._children[0].shouldTipShow === true) {
      transition.to.router._children[0].shouldTipShow = false;
    }
    transition.to.router._children[0].currentRoute = '/' + arr.join('/');
  }
});

export default router;

