import { createStore } from 'vuex';
import adminTab from './admin-tab';
import metaLoader from './meta-loader';
import enumLoader from './enum-loader';
import menuLoader from './menu-loader';
import categoryLoader from './category-loader';
import user from './user';

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    adminTab,
    metaLoader,
    enumLoader,
    menuLoader,
    categoryLoader,
    user
  }
})
