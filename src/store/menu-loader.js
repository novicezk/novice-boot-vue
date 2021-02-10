import api from '../api/menu';

const menuLoader = {
  state: {
    menus: [],
  },
  getters: {
    menus: state => state.menus,
    loadMenu: (state) => id => state.menus.find(tmp => tmp.id === id),
  },
  actions: {
    loadMenus: ({ commit }) => {
      return new Promise((resolve) => {
        api.filterTree('workbench').then(res => {
          commit('setMenus', res.data);
          resolve(res.data);
        });
      });
    }
  },
  mutations: {
    setMenus(state, menus) {
      state.menus = menus;
    },
  }
}
export default menuLoader;