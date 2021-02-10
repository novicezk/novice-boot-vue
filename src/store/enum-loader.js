import api from '../api/enum-loader';

const enumLoader = {
  state: {
    enums: {},
  },
  getters: {
    loadEnum: state => key => {
      let en = state.enums[key];
      if (en) return en;
      state.enums[key] = api.loadEnum(key);
      return state.enums[key];
    },
    enumDisplay: state => (enumClass, value) => {
      let enumValues = enumLoader.getters.loadEnum(state)(enumClass);
      let opt = enumValues.find(e => e.value === value);
      return opt ? opt.display : value;
    }
  },
  actions: {

  },
  mutations: {

  }
}
export default enumLoader;