<template>
  <v-app dark style="background:url(https://www.4av.nl/wp-content/uploads/20170409_REBIRTH_2001_Vincent_2994.jpg)">

    <v-toolbar app color="grey darken-4" >
      <!-- <v-toolbar-title v-text="title"></v-toolbar-title> -->

<v-slide-x-transition  tag="div">
    <div v-show="showBackArrow" class="">
      <v-btn  dark icon @click="$router.replace('/dashboard')">
      <v-icon large color="grey lighten-1">arrow_back</v-icon>
    </v-btn>
  <span class="grey--text text-lighten-2">To Dashboard</span>
    </div>
</v-slide-x-transition>
  <!-- <router-link  class="mx-2 hidden-sm-and-down"  to="/Login">login</router-link>
  <router-link class="mx-2 hidden-sm-and-down" to="/Signup">signup</router-link>
<router-link class="mx-2 " to="/dashboard">dashboard</router-link> -->




      <v-spacer></v-spacer>

      <!-- AVATAR? TODO -->
      <!-- <v-avatar
      size="35"
      color=""
      @click="signOut"
      >
      <v-img src="https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&h=350"></v-img> -->

      <v-icon>
      </v-icon>
    </v-avatar>
    <span v-text="user ? user.email : ''"></span>

    <v-btn v-if="user" @click="messageModal = !messageModal" icon>
      <v-badge overlap left color="cyan">
        <span slot="badge">2</span>
        <v-icon color="grey lighten-1" > notifications </v-icon>
      </v-badge>
    </v-btn>

    <v-menu v-if="user"  bottom offset-y >
      <v-btn slot="activator" dark icon >
      <v-icon color="grey lighten-1">menu</v-icon>
    </v-btn>

    <v-list>
      <v-list-tile @click="signOut" >
      <v-list-tile-title>Log Out</v-list-tile-title>
    </v-list-tile>
    <v-list-tile v-for="(mess, key) in messages" :key="key"><v-list-tile-title>{{mess.message}}</v-list-tile-title></v-list-tile>

  </v-list>
</v-menu>
</v-toolbar>

<v-content>

<transition name="fade" mode="out-in">
<v-card fixed absolute v-show="messageModal">
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
  <span>&copy; 2017</span>
</v-footer>
</v-app>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .26s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

<script>
import firebase from 'firebase'
import { db } from './main'


export default {
  data () {
    return {
      avatar: 'https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&h=350',
      user: firebase.auth().currentUser || '',
      messageModal: false,
      messages: [],
      title: 'DoorBits' //???
    }
  },
  methods: {
    signOut: function () {
      var d = this
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        d.$router.replace('/login')
        alert('User logged out..')
      }, function(error) {
        // An error happened.
        alert('Oops cannot logged out! ' + error)

      })
    }
  },
  mounted: function () {
    var d = this
    var arr = []
    db.collection("users").doc(firebase.auth().currentUser.uid).collection('notifications')
    .onSnapshot(function(snapShot) {
      console.log("Current data: ", snapShot);
      d.messages = [];
      snapShot.forEach(function (snap) {
        if (snap.data().message) {
          d.messages.push(snap.data())
        }
      })

    });
  },
computed: {
showBackArrow: function () {
//declare the routes where no arrow is shown. Possibly reverse later? (actually only in-app routes from dash go 'back')
 var noArrowRoutes = ['dashboard', 'home', 'login', 'signup'];
if (noArrowRoutes.includes(this.$route.name)) {
  return false
} else { return true}
  }
},
  name: 'App'
}
</script>
