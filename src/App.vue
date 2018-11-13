<template>
  <v-app   class="barcolor lighten-3" >
<!-- style="background: url('https://gallery.yopriceville.com/var/resizes/Free-Clipart-Pictures/Decorative-Elements-PNG/Blue_Background_Decoration_Transparent_PNG_Clip_Art_Image.png?m=1507172113'); background-size:cover;" -->
    <v-toolbar app color="barcolor darken-3" :flat="$vuetify.breakpoint.xs" :style="mobileSafariStatusbar ? 'height: 76px; padding-top:20px' : ''">
      <!-- <v-toolbar-title v-text="title"></v-toolbar-title> -->

      <v-btn v-if="showBackArrow" dark icon @click="$router.push('/dashboard')">
      <v-icon  large color="barcolor lighten-3">arrow_back</v-icon>
    </v-btn>
    <v-icon v-else large color="barcolor darken-1">web</v-icon>


  <h1 v-if="!showBackArrow" class="barcolor--text text--darken-1 title pl-2">{{$route.name}}</h1>
  <h1 v-else class="barcolor--text text--darken-1 title pl-2">{{$route.name}}</h1>

      <v-spacer></v-spacer>
      <v-icon>
      </v-icon>
    </v-avatar>

    <v-btn  v-if="user" @click="messageModal = !messageModal" icon>
      <v-badge overlap left color="primary">
        <span slot="badge">2</span>
        <v-icon class="barcolor--text text--lighten-2" > notifications </v-icon>
      </v-badge>
    </v-btn>

    <v-menu v-if="user"  bottom offset-y >
      <v-btn slot="activator" dark icon >
      <v-icon color="barcolor--text text--lighten-2">menu</v-icon>
    </v-btn>
<v-card fixed absolute right>
  <v-toolbar @click.stop.prevent dense class="subheading black--text white">        <v-icon class="pl-3 pr-2  black--text">perm_identity</v-icon>
{{user.email}}<v-spacer></v-spacer>
</v-toolbar>

    <v-list  dark class="pa-3  mr-0 barcolor subheader">
      <v-list-tile  @click="signOut" >
        <v-icon class="pr-2">highlight_off</v-icon>
        <v-list-tile-title>Log Out</v-list-tile-title>
      </v-list-tile>
      <v-list-tile @click="$router.push('/account/' + user.uid)" >
        <v-icon class="pr-2">settings</v-icon>
        <v-list-tile-title>Account Settings</v-list-tile-title>
      </v-list-tile>
  </v-list>
</v-card>
</v-menu>
</v-toolbar>

<v-content >

<transition name="fade" mode="out-in">
<v-card fixed absolute  v-show="messageModal">
<span v-show="messages === []">No messages...</span>
  <v-fade-transition group dense tag="v-list" >
      <v-list-tile v-for="(item, key) in messages" :key="key"> 
        <v-list-tile-title v-text="item.message"></v-list-tile-title>
      </v-list-tile>
  </v-fade-transition>
</v-card>
</transition>
  <transition name="fade" mode="out-in">

    <router-view/>
  </transition>
</v-content>

<v-footer class="hidden-sm-and-down transparent px-3" fixed app>
  <span>&copy; 2018</span>
</v-footer>
</v-app>
</template>

<style >

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.26s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.material-icons {
  display: inline-flex !important;
}

.label {
  display: inline-block;
  width: 110px;
  margin-right: 10px;
  font-weight: bold;
}

.list-enter-active, .list-leave-active {
opacity: 1;
background: #7e8e9720;
  transition: all 0.3s ease;
  position: relative;;

}
.list-enter /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(-30px);
  position: absolute;

}
 .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
position: absolute;
}
</style>

<script scoped>
import firebase from "firebase";
import { db } from "./main";
import store from "./store";
import colors from 'vuetify/es5/util/colors'


export default {
  data() {
    return {
    mobileSafariStatusbar: false,
      user: firebase.auth().currentUser || "",
      messageModal: false,
      messages: [],
      title: "DoorBits" //???
    };
  },
created: function () {
  var ua = window.navigator.userAgent;
var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
var webkit = !!ua.match(/WebKit/i);
var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
if (iOSSafari) {
  this.mobileSafariStatusbar = true
  store.commit('updateIos', true)
}
},
  mounted: function() {
//set theme's primary color because it does not work in main.js
this.$vuetify.theme.primary = '#00cccc'
this.$vuetify.theme.barcolor = '#7d8e96'




//get realtime updates of admin doc from db
    var d = this;
    var arr = [];
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot(function(snapShot) {
        console.log("Current user: ", snapShot.data());
        let usr = snapShot.data();

        if (usr.admin) {
          for (var acc in usr.admin) {
            arr.push(usr.admin[acc].name);
          }
        }
        store.commit("updateUser", { accounts: arr, ...snapShot.data() });
        d.getDashboardList(store, {accounts: arr, ...snapShot.data()})
      });
  },
  computed: {
    showBackArrow: function() {
      //declare the routes where no arrow is shown. Possibly reverse later? (actually only in-app routes from dash go 'back')
      var noArrowRoutes = ["dashboard", "home", "login", "signup"];
      if (noArrowRoutes.includes(this.$route.name)) {
        return false;
      } else {
        return true;
      }
    }
  },
methods: {
  signOut: function() {
    var d = this;
    firebase
      .auth()
      .signOut()
      .then(
        function() {
          // Sign-out successful.
          d.$router.replace("/login");
          alert("User logged out..");
        },
        function(error) {
          // An error happened.
          alert("Oops cannot log out! " + error);
        }
      );
  },
  getDashboardList: function(store, userInfo) {
    var d = this;
    var user = firebase.auth().currentUser

    let objj = {};
    // get lists where accountId == one of accounts
// TODO check if account isPremium else limit list or ui so access is restricted or actions denied
    const listRef = db.collection("lists");
    for (let acc in userInfo.admin) {
  if (userInfo.admin.hasOwnProperty(acc)) {
    let list =  listRef.where("accountId", "==", acc).onSnapshot((snap) => {
console.log('snap of each account in admin', snap);
      // add permission mode and id to object for later reference
      let obj = []

      for (let doc of snap.docs) {
        obj.push({ id: doc.id, account: userInfo.admin[acc].name, permission: "ADMIN", ...doc.data() });
      }
      console.log('obj', obj);

      store.commit('updateDashAccount', [userInfo.admin[acc].name, obj])

    }

      )}};


    //get lists where person is 'activator'

      let sharedActivator =  listRef
        .where("shared." + user.uid + ".mode", "==", "ACTIVATE")
        .onSnapshot((snap) => {
          let obj = []

          for (let share of snap.docs) {
            let sharedoc = share.data()
            console.log("activator lists", sharedoc);
            obj.push({
              id: share.id,
              permission: "ACTIVATE", // was ACTIVATOR
              ...sharedoc
            });
          }
          store.commit('updateDashActivate', obj)

        })


    // get lists where person is in 'shared' field
    let sharedAdd =  listRef
      .where("shared." + user.uid + ".mode", "==", "ADD")
      .onSnapshot((snap) => {
        let obj = []
        for (let share of snap.docs) {
          let sharedoc = share.data()
          console.log("add lists", sharedoc);
          obj.push({
            id: share.id,
            permission: 'ADD',
            ...sharedoc
          });
        }
        store.commit('updateDashAdd', obj)
      })
  }
},
  name: "App"
};
</script>
