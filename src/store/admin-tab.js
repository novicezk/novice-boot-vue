export default {
  state: {
    adminTabs: [],
    adminSelectTab: "",
  },
  getters: {
    adminTabs: state => {
      if (!state.adminTabs || state.adminTabs.length === 0) {
        let tabsStr = sessionStorage.getItem("adminTabs");
        state.adminTabs = tabsStr ? JSON.parse(tabsStr) : [];
      }
      return state.adminTabs;
    },
    adminSelectTab: state => {
      if (!state.adminSelectTab) {
        state.adminSelectTab = sessionStorage.getItem("adminSelectTab") || "";
      }
      return state.adminSelectTab;
    },
  },
  actions: {
    pushAdminTab: ({ commit }, newTab) => commit('pushAdminTab', newTab),
    removeAdminTab: ({ commit }, key) => commit('removeAdminTab', key),
    changeAdminSelectTab: ({ commit }, selectKey) => commit('changeAdminSelectTab', selectKey),
    setAdminTabs: ({ commit }, tabs) => commit('setAdminTabs', tabs),
  },
  mutations: {
    pushAdminTab(state, newTab) {
      let tab = state.adminTabs.find(tab => tab.key === newTab.key);
      if (!tab) {
        state.adminTabs.push(newTab);
        sessionStorage.setItem("adminTabs", JSON.stringify(state.adminTabs));
      }
      state.adminSelectTab = newTab.key;
      sessionStorage.setItem("adminSelectTab", newTab.key);
    },
    removeAdminTab(state, key) {
      var selectKey = state.adminSelectTab;
      if (state.adminSelectTab === key) {
        state.adminTabs.forEach((tab, index) => {
          if (tab.key === key) {
            let nextTab = state.adminTabs[index + 1] || state.adminTabs[index - 1];
            if (nextTab) {
              selectKey = nextTab.key;
            }
          }
        });
      }
      state.adminTabs = state.adminTabs.filter(tab => tab.key !== key);
      state.adminSelectTab = state.adminTabs.length === 0 ? "" : selectKey;
      sessionStorage.setItem("adminTabs", JSON.stringify(state.adminTabs));
      sessionStorage.setItem("adminSelectTab", selectKey);
    },
    changeAdminSelectTab(state, selectKey) {
      state.adminSelectTab = selectKey;
      sessionStorage.setItem("adminSelectTab", selectKey);
    },
    setAdminTabs(state, tabs) {
      state.adminTabs = tabs;
      sessionStorage.setItem("adminTabs", JSON.stringify(state.adminTabs));
    }
  }
}
