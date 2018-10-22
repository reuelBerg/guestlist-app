<template>
  <v-dialog v-model="dialog" persistent class="">
    <v-btn small fab class="grey" slot="activator"><v-icon>person_add</v-icon></v-btn>


    <!-- add name to list ============================================================================  add name to list -->
    <v-card transition="slide-y-reverse-transition" class="pa-3">
      <h2 class="mt-3">Share with someone</h2>
      <v-text-field v-model="shareWithInput" placeholder="Email" style=""></v-text-field>
      <v-select
      :items="['ACTIVATE', 'ADD']"
      label="add permission"
      v-model="shareModeInput"
      ></v-select>
      <v-text-field v-show="shareModeInput == 'ADD'" v-model="shareAddLimit" oninput="validity.valid||(value='')" placeholder="max number of adds" min=0 pattern="[0-9]*" style=""></v-text-field>
      <v-layout v-show="shareModeInput == 'ADD' && add.options != []" row no-wrap align-center v-for="(item, index) in add.options" :key="item" class="">
        <span  class="pr-2 title" style="width:30%; min-width:100px; overflow:hidden;">{{item}}</span>
        <v-text-field  xs5 style="max-width:60px" step="1.00" min=0 oninput="validity.valid||(value='')" type="text" pattern="[0-9]*" class="nr dark transparent pa-1 title"   v-model="sharedOptions[item]"></v-text-field>
        <!-- <span disabled class="orange--text pl-3">
        <v-avatar size="25"  class="orange lighten-4 black--text  "><span>5</span></v-avatar icon> remaining
      </span> -->
      <v-btn small icon style="margin: 1px"  color="teal" @click="decrement(item)"><v-icon>chevron_left</v-icon></v-btn>
      <v-btn small icon style="margin: 1px"  color="teal" @click="increment(item)"><v-icon>chevron_right</v-icon></v-btn>
      <v-btn small icon style="margin: 1px"  color="teal" @click="clear(item)"><v-icon>clear</v-icon></v-btn>

    </v-layout>
    <v-btn left small class="pink darken-2" @click="addShared">send invitation</v-btn>
    <p class="red--text" v-html="error"></p>
    <div v-show="!dbsharedlist" class="mt-3" style="border-bottom: 1px solid grey"></div>

<h3 v-show="!dbsharedlist">Current users</h3>
    <v-list two-line dense>
      <v-list-tile class="grey darken-2" v-for="(item, key) in dbsharedlist" :key="key">
        <v-list-tile-content>
          <v-list-tile-title v-text="item.email"></v-list-tile-title>
          <v-list-tile-sub-title>{{item.mode}} {{item.addLimit}}</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <!-- TODO: make menu with a list (gives error 'cyclic object  value') -->
          <v-menu   >
            <v-btn
            slot="activator"
            dark icon
            >
            <v-icon v-text="item.mode == 'ADD' ? 'add': 'remove_red_eye'"></v-icon>
          </v-btn>
          <v-list>
            <span v-if="Object.keys(item.options).length === 0">empty</span>

            <v-list-tile v-else v-for="(it, ke) in item.options">

              <span v-text="key"></span>: <span v-text="it"></span>
            </v-list-tile>

          </v-list>
        </v-menu>
      </v-list-tile-action>
      <v-list-tile-action ><v-btn @click="removeShared(key)" icon><v-icon>clear</v-icon></v-btn></v-list-tile-action>
      <div class="mt-1" style="border-bottom: 1px solid white"></div>

    </v-list-tile>
  </v-list>
  <v-card-actions>
    <v-spacer></v-spacer>

    <v-btn color="cyan darken-1" flat @click="clearForm(); dialog = false">Close</v-btn>
  </v-card-actions>
</v-card>
</v-dialog>

</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

<script scoped>
import firebase from "firebase";
import { db } from "../main";
import { bus } from "../main"; // import the bus from main.js or new file
import store from "../store";

export default {
  name: "dashboardShareModal",
  props: ["add", "listid"],
  data() {
    return {
      user: firebase.auth().currentUser,
      dialog: false,
      shareWithInput: "",
      shareModeInput: "",
      shareAddLimit: "",
      sharedOptions: {},
      dbsharedlist: {},
      error: ' ',
      output: {}
    };
  },
  computed: {},
  watch: {
  },
  methods: {
clearForm: function () {
  this.shareWithInput = ""
  this.shareModeInput = ""
  this.shareAddLimit = ""
  this.sharedOptions = {}
  this.dbsharedlist = {}
  this.error = ''
  this.output = {}
},
    removeShared: function(key) { // DOES NOT REMOVE LIST_ITEM OF USER! Remove manually in EDIT LIST
// key is id of list
      delete this.sharedOptions[key];
      db.collection('lists').doc(this.listid).update({['shared.'+key]: firebase.firestore.FieldValue.delete()})
      this.refreshSharedList()
    },
    addShared: function() {
      var obj = {
        mode: this.shareModeInput,
        addLimit: this.shareAddLimit,
        options: this.sharedOptions
      };
      this.output = obj;
      try {
        this.sendInvite();
      } catch (e) {
        console.log(e);
      }
    },

    sendInvite: async function() {

      var d = this;
      var user = this.user;
      var shareWithInput = this.shareWithInput.toLowerCase().trim();

      if (shareWithInput == '' || this.shareModeInput == '') {
        return this.error += 'Email and Permission are required. <br>'
      }
if (this.shareModeInput == 'ADD' && this.shareAddLimit == "") {
  return this.error += 'Set amount of adds on list. <br>'
}
      //bounce if own email
      if (shareWithInput === user.email) {return alert("you cannot add yourself") }
      for (var prs in this.dbsharedlist) {
        if (this.dbsharedlist[prs].email === shareWithInput) {
          return alert("person already in shared list!");
      }  }

      // vul add object
      this.add.owner = user.uid;
      //vul database
      console.log(this.add.id + " id");

      const userCheck = await db.collection("users").where("email", "==", shareWithInput).get();
      const inviteCheck = await db.collection("invites").where("email", "==", shareWithInput).get();

      // TODO wrap each call segment in a try catch, return and unroll previous actions on error

      // add user if none
      let ref; let id; let name = null;
      const inviteRef = db.collection("invites");
        // if no user
  if (userCheck.empty && inviteCheck.empty ) { return alert('in BETA 1.0 you can only invite people who already have an account. Please make sure they register before inviting. This feature will be added soon.')}

if (userCheck.empty && inviteCheck.empty ) {
//make list_item_id
        let inv = await inviteRef.add({ email: shareWithInput, name: null, created: new Date() }); //gets more stuff added
        console.log("temp user =>", inv);
        ref = db.collection("users").doc(inv.id);
        id = inv.id;
      } else {         // if user has account
        if (!userCheck.empty) {
          let u = userCheck.docs[0];
          console.log("user =>", userCheck.docs[0].id);

          ref = db.collection('invites').doc(u.id);
          id = u.id;
          name = u.data().fullName;
        } else if (!inviteCheck.empty) {
          let u = inviteCheck.docs[0];
          console.log("user =>", inviteCheck.docs[0].id);

          ref = inviteCheck.doc(u.id);
          id = u.id;
          name = u.data().fullName;
        }

      }
      const listRef = db.collection("lists").doc(this.listid)

      // if not shown on screen (or in vm.data), set shared and make item
      if (true) {
        // if ADD create list_item for this person
        let newItem = await listRef.collection('list_items').doc(id).set({})

        var obj = {
          email: shareWithInput,
          name: name || null,
          ...this.output
        };
  console.log('id', this.listid);


        let str = 'shared.' + id // user id
        listRef.update({[str]: obj}) //update list main

        this.refreshSharedList();
      } else {
        // make update?
        alert("person already in list!");
      }

      // d.$emit("refreshList"); // parent call , inbutton??
    },
    clear: function(option) {
      this.sharedOptions[option] = null;
    },
    increment: function(option) {
      var option = option;
      this.sharedOptions = Object.assign( {},
        JSON.parse(JSON.stringify(this.sharedOptions)), {} ); if
        (this.sharedOptions[option] == null) { this.sharedOptions[option] = 1; }
        else { this.sharedOptions[option]++; }
      },
      decrement: function(option) {
        var option = option;
        this.sharedOptions = Object.assign( {},
          JSON.parse(JSON.stringify(this.sharedOptions)), {}
        ); if (this.sharedOptions[option] == null) { return; } else if
        (this.sharedOptions[option] <= 1) { this.clear(option); } else {
          this.sharedOptions[option]--; }
        },
        refreshSharedList: async function() {
          // get all shared users from sharedOptions subcollection
          //  TODO: show if permitted
          var getSharedList = await db.collection("lists").doc(this.add.id).get();
          this.dbsharedlist = getSharedList.data().shared
console.log('dbshared => ', getSharedList.data());
        }
      }, //> methods
      created: function() {

        this.refreshSharedList();
      }
    };
    </script>
