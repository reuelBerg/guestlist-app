import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

var state = {
  user: '',
  ios: false,
  dashboardAccounts: {},
  dashboard: {
    "lists you can activate": [],
    "lists you can add": []
    // >> seperate accounts are inserted here
  }
};
var mutations = {
  updateUser(state, payload) {
    state.user = {...payload};
  },
  updateIos(state, payload) {
    state.ios = payload;
  },
  updateDashAccount(state, payload) {
  // NOTE: acc = payload[0], obj = payload[1]
    Vue.set(state.dashboard, payload[0], payload[1])
console.log('st user', state.user);
    for (var key in state.user.admin) {
      if (state.user.admin.hasOwnProperty(key)) {
        // state.dashboardAccounts.push([state.user.admin[key].name, state.user.admin[key].isPremium])
        // state.dashboardAccounts[state.user.admin[key].name] = state.user.admin[key].isPremium
        Vue.set(state.dashboardAccounts, state.user.admin[key].name, state.user.admin[key].isPremium)
      }
    }
console.log('st acc', state.dashboardAccounts );
  },
  updateDashActivate(state, payload) {
    state.dashboard["lists you can activate"] = payload;
  },
  updateDashAdd(state, payload) {
    state.dashboard["lists you can add"] = payload;
  }
};

var actions = {};

//vuex stuff
var store = new Vuex.Store({
  state,
  mutations,
  actions
});

export default store;
