import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

var state = { user: {} };
var mutations = {
  updateUser(state, payload) {
    state.user = payload;
  }
};
var actions = {};
var store = new Vuex.Store({
  state,
  mutations,
  actions
});

export default store;
