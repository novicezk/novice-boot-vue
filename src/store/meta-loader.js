import api from '../api/meta-loader';

const metaLoader = {
  state: {
    modules: [],
    dataTypes: [],
    currentBusiness: null,
    childBusinesses: [],
    businessHistory: [],
  },
  getters: {
    modules: state => state.modules,
    dataTypes: state => state.dataTypes,
    currentBusiness: state => state.currentBusiness,
    childBusinesses: state => state.childBusinesses,
    loadDataType: state => dataTypeIdOrName => state.dataTypes.find(tmp => tmp.id === dataTypeIdOrName || tmp.name === dataTypeIdOrName),
    loadType: state => typeIdOrName => {
      let modules = state.modules;
      for (const i in modules) {
        const mod = modules[i];
        let type = mod.types.find(type => type.name === typeIdOrName || type.id === typeIdOrName);
        if (type) return type;
      }
    },
    loadFields: state => typeId => {
      let type = metaLoader.getters.loadType(state)(typeId);
      return type ? type.fields : [];
    },
    loadField: state => (typeId, name) => {
      let type = metaLoader.getters.loadType(state)(typeId);
      return type ? type.fields.find(field => field.name === name) : null;
    },
    loadViews: state => typeId => {
      let type = metaLoader.getters.loadType(state)(typeId);
      return type ? type.views : [];
    },
    loadView: state => (typeId, name) => {
      let type = metaLoader.getters.loadType(state)(typeId);
      return type ? type.views.find(view => view.name === name) : null;
    },
    loadActions: state => typeId => {
      let type = metaLoader.getters.loadType(state)(typeId);
      return type ? type.actions : [];
    },
    loadAction: state => (typeId, name) => {
      let type = metaLoader.getters.loadType(state)(typeId);
      return type ? type.actions.find(action => action.name === name) : null;
    },
    loadBusinesses: state => typeId => {
      let type = metaLoader.getters.loadType(state)(typeId);
      return type ? type.businesses : [];
    },
    loadBusiness: state => (typeId, name) => {
      let type = metaLoader.getters.loadType(state)(typeId);
      return type ? type.businesses.find(business => business.name === name) : null;
    },
    businessHistory: state => {
      if (!state.businessHistory || state.businessHistory.length === 0) {
        let businessHistoryStr = sessionStorage.getItem("businessHistory");
        state.businessHistory = businessHistoryStr ? JSON.parse(businessHistoryStr) : [];
      }
      return state.businessHistory;
    },
  },
  actions: {
    loadMetaAsync: ({ commit }) => {
      return new Promise((resolve) => {
        Promise.all([api.loadModules(), api.loadDataTypes()]).then(reses => {
          commit('setModules', reses[0].data);
          commit('setDataTypes', reses[1].data);
          setTimeout(() => {
            resolve();
          }, 1);
        });
      });
    },
    loadModules: ({ commit }) => {
      api.loadModules().then(res => {
        commit('setModules', res.data);
      });
    },
    executeBusiness: ({ state, commit }, payload) => {
      // e.g : dev.Test@create
      let name = payload.name;
      var typeIdOrName = payload.typeId;
      var businessName = name;
      if (name.indexOf("@") !== -1) {
        typeIdOrName = name.split("@")[0];
        businessName = name.split("@")[1];
      }
      let type = metaLoader.getters.loadType(state)(typeIdOrName);
      if (!type) {
        throw `type not found, typeIdOrName:${typeIdOrName}`;
      }
      let business = type.businesses.find(business => business.name === businessName);
      if (!business) {
        commit('setCurrentBusiness', null);
        throw `business not found, name:${type.name}@${businessName}`;
      }
      let view = business.viewName ? type.views.find(view => view.name === business.viewName) : null;
      let isWindow = view && view.windows;
      let businessStandardName = type.name + '@' + businessName;
      business.standardName = businessStandardName;
      let businessWrapper = Object.assign({ params: payload.params || {}, callback: payload.callback, view: view }, business);
      if (!isWindow) {
        let historyBusiness = { params: payload.params || {}, business: businessStandardName };
        commit('pushBusinessHistory', historyBusiness);
        commit('setCurrentBusiness', businessWrapper);
        if ('ENTITY' === business.mode) {
          location.hash = '#/?business=' + businessStandardName + '&entityId=' + payload.params.entityId;
        } else {
          location.hash = '#/?business=' + businessStandardName;
        }
      } else {
        commit('addChildBusiness', businessWrapper);
      }
    },
    executeAction: ({ state }, payload) => {
      var typeId = payload.typeId;
      var actionName = payload.name;
      var type;
      if (!typeId && payload.name.indexOf("@") !== -1) {
        let typeName = payload.name.split("@")[0];
        actionName = payload.name.split("@")[1];
        type = metaLoader.getters.loadType(state)(typeName);
      } else {
        type = metaLoader.getters.loadType(state)(typeId);
      }
      if (!type) {
        throw { error: "type not found", data: payload };
      }
      let action = type.actions.find(a => a.name === actionName);
      if (!action) {
        throw { error: "action not found", data: payload };
      }
      typeId = type.id;
      let callback = payload.callback;
      delete payload.callback;
      api.executeAction(typeId, actionName, payload.params).then(res => {
        if (callback) callback(res);
      });
    },
    backBusiness: (context) => {
      let businessHistory = metaLoader.getters.businessHistory(context.state);
      businessHistory.pop();
      if (businessHistory) {
        let before = businessHistory.pop();
        if (before) {
          context.commit('setBusinessHistory', businessHistory);
          metaLoader.actions.executeBusiness(context, { name: before.business, params: before.params });
        }
      }
    },
    syncBusinessParams: ({ state, commit }, payload) => {
      let businessHistory = metaLoader.getters.businessHistory(state);
      let b = businessHistory.find(b => b.business === payload.name);
      if (b) {
        b.params = payload.params;
        commit('setBusinessHistory', businessHistory);
      }
    },
    getBusinessParams: ({ state }, name) => {
      let businessHistory = metaLoader.getters.businessHistory(state);
      let b = businessHistory.find(b => b.business === name);
      return b ? b.params : {};
    },
    clearCurrentBusiness: ({ commit }) => {
      commit('setCurrentBusiness', null);
    },
    removeChildBusiness: ({ commit }, business) => {
      commit('removeChildBusiness', business);
    },
  },
  mutations: {
    setModules(state, modules) {
      state.modules = modules;
    },
    setDataTypes(state, dataTypes) {
      state.dataTypes = dataTypes;
    },
    setCurrentBusiness(state, business) {
      state.currentBusiness = business;
    },
    addChildBusiness(state, business) {
      business.show = true;
      state.childBusinesses.push(business);
    },
    removeChildBusiness(state, business) {
      let index = state.childBusinesses.indexOf(business);
      if (index !== -1) state.childBusinesses.splice(index, 1);
    },
    pushBusinessHistory(state, b) {
      let businessHistory = metaLoader.getters.businessHistory(state);
      businessHistory.push(b);
      sessionStorage.setItem("businessHistory", JSON.stringify(businessHistory));
    },
    setBusinessHistory(state, history) {
      state.businessHistory = history;
      sessionStorage.setItem("businessHistory", JSON.stringify(state.businessHistory));
    },
  }
}
export default metaLoader;