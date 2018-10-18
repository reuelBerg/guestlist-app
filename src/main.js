import Vue from "vue";
import App from "./App";
import router from "./router";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import { config } from "../config/firebaseConfig.js";
import firebase from "firebase/app";
import "material-design-icons/iconfont/material-icons.css";
import "typeface-roboto/index.css";
import store from "./store";
require("firebase/firestore");
require("firebase/auth");

let app;
// FIREBASE CONFIG
firebase.initializeApp(config);
// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();
// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});
// Enable offline persistance
db.enablePersistence({ experimentalTabSynchronization: true }).catch(function(
  err
) {
  if (err.code == "failed-precondition") {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    alert("Multiple tabs are open! 1 tab maximum. " + err);
  } else if (err.code == "unimplemented") {
    // The current browser does not support all of the
    // features required to enable persistence
    alert("Offline access not supported by browser. " + err);
  }
});
// Subsequent queries will use persistence, if it was enabled successfully

Vue.use(Vuetify);

Vue.config.productionTip = false;

firebase.auth().onAuthStateChanged(function() {
  if (!app) {
    /* eslint-disable no-new */
    new Vue({
      el: "#app",
      router,
      store,
      render: h => h(App)
    });
  }
});

import "./registerServiceWorker.js";
export { db };
