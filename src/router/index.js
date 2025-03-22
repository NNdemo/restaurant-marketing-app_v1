import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home/index.vue'),
    meta: { 
      title: 'Home',
      keepAlive: true,
      transition: 'fade'
    }
  },
  {
    path: '/content',
    name: 'Content',
    component: () => import('../views/Content/index.vue'),
    meta: { 
      title: 'Content Generator',
      transition: 'slide-left'
    }
  },
  {
    path: '/social',
    name: 'Social',
    component: () => import('../views/Social/index.vue'),
    meta: { 
      title: 'Social Media',
      transition: 'slide-left'
    }
  },
  {
    path: '/coupons',
    name: 'Coupons',
    component: () => import('../views/Coupons/index.vue'),
    meta: { 
      title: 'Coupons',
      transition: 'slide-left'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile/index.vue'),
    meta: { 
      title: 'My Profile',
      transition: 'slide-left'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});

// Navigation guard to update page title
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Restaurant Marketing App';
  
  // 记录导航方向 (用于过渡动画)
  const toDepth = to.path.split('/').length;
  const fromDepth = from.path.split('/').length;
  
  if (toDepth < fromDepth) {
    to.meta.transition = 'slide-right';
  } else if (toDepth > fromDepth) {
    to.meta.transition = 'slide-left';
  }
  
  next();
});

// 监听路由错误
router.onError((error) => {
  console.error('Router error:', error);
  // 可以添加错误处理，比如重定向到错误页面
});

export default router; 