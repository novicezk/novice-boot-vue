import api from '../api/category';

const categoryLoader = {
  state: {
    categories: {},
  },
  getters: {
    loadCategory: state => key => {
      let en = state.categories[key];
      if (en) return en;
      state.categories[key] = api.loadCategory(key);
      return state.categories[key];
    },
    categoryDisplay: state => (setId, value) => {
      let values = categoryLoader.getters.loadCategory(state)(setId);
      let opt = values.find(e => e.value === value);
      return opt ? opt.display : value;
    }
  },
  actions: {

  },
  mutations: {

  }
}
export default categoryLoader;