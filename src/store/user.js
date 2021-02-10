import api from '../api/user';

export default {
  state: {
    user: undefined
  },
  getters: {
    getCurrentUser: (state) => () => {
      if (state.user) {
        return state.user;
      }
      state.user = api.getCurrentUser();
      return state.user;
    },
  },
  actions: {
    setCurrentUser: ({ commit }, user) => {
      commit('setCurrentUser', user);
    }
  },
  mutations: {
    setCurrentUser(state, user) {
      state.user = user;
    },
  },
}
