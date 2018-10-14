<template>
  <div class="">

    <v-btn fixed absolute bottom right fab color="black mb" style=" bottom: 10px;" :large="$vuetify.breakpoint.smAndUp" @click="getUser" >
      <v-icon :large="$vuetify.breakpoint.smAndUp" >autorenew</v-icon>
    </v-btn>
    <!-- add name to list -->
    <dashboardAddModal v-if="allowActions" @refreshList="getUser" :userinfo="userInfo"></dashboardAddModal>


    <v-container fluid>
      <v-slide-y-transition mode="out-in">
        <v-layout column align-center>

          <v-card v-if="allowActions" style="max-width:800px; width:100%">
            <!-- toolbar -->
            <v-toolbar dense flat color="cyan darken-1" dark>
              <v-input class="cyan darken-3" style="max-width: 180px; height:32px;  border-radius:3px;" >
                <input @keyup="search" class=" white--text pa-2 " style="max-width: 160px; height:32px;  border-radius:3px;" type="text" placeholder="Search names" v-model="searchInput">
                <v-icon v-show="searchInput != ''" small class="" @click="searchInput = ''">cancel</v-icon>
              </v-input>
              <v-spacer ></v-spacer>              <v-spacer></v-spacer>
              <span>Sort by:</span>
              <!-- TODO: make sort menu -->
            </v-toolbar>

            <!-- list -->
            <v-slide-x-transition tag="v-list" group >
            <v-list-group   no-action  v-for="(item, index) in searchResult"  :key="index" v-model="item.active">
              <!-- avatar -->
              <v-list-tile avatar slot="activator" >
                <v-list-tile-avatar  color="blue-grey">
                  <span v-text="item.date.slice(0,5)" class="white--text"></span>
                </v-list-tile-avatar>
                <!-- list title -->
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.title"></v-list-tile-title>
                  <v-list-tile-sub-title v-text="item.subTitle"></v-list-tile-sub-title>

                </v-list-tile-content>

                <v-spacer ></v-spacer>
                <div class="hidden-xs-only">

                  <span v-text="item.count + '/' + item.maxCount" class="white--text pa-2"></span>
                  <v-divider inset class="mr-1" vertical></v-divider>

                  <!-- icons -->
                  <v-icon class="mx-1" small flat color="orange">remove_red_eye</v-icon>
                  <v-icon class="mx-1" small flat color="light-blue">add</v-icon>
                  <v-icon class="mx-1" small flat color="pink">edit</v-icon>
                  <v-icon class="mx-1" small flat color="green">group</v-icon>
                  <v-divider inset class="ml-1" vertical></v-divider>
                </div>

              </v-list-tile>
              <!-- card -->
              <v-card >
                <v-divider></v-divider>
                <v-layout row wrap justify-end >
                  <v-btn small fab v-if="item.permission == 'ADD' || item.permission == 'ADMIN'" class=" blue-grey "  @click="showListItem(item.id)"><v-icon>note_add</v-icon></v-btn>
                  <v-btn small fab v-if="item.permission == 'ADMIN'" class=" cyan darken-2 "  @click="removeListItem(item.id)"><v-icon>delete</v-icon></v-btn>
                  <!-- TODO: activate page button etc. -->
                  <dashboardShareModal v-if="item.permission == 'ADMIN'" :add="item" :listid="item.id" v-model="shareDialog" @refreshList="getUser"></dashboardShareModal>
                  <v-btn small fab v-if="item.permission == 'VIEW' || item.permission == 'ADMIN'" class="white light black--text"   @click=""><v-icon>power_settings_new</v-icon></v-btn>

                </v-layout>

                <span class="pl-3">{{item.subTitle}}</span>

                <v-subheader class="my-0 hidden-sm-and-up">Permissions</v-subheader>
                {{item.permission}}
                <v-container class="pa-0 ma-0 pl-3 hidden-sm-and-up" style="">
                  <v-icon class="mx-1"  flat color="orange">remove_red_eye</v-icon>
                  <v-icon class="mx-1"  flat color="light-blue">add</v-icon>
                  <v-icon class="mx-1"  flat color="pink">edit</v-icon>
                  <v-icon class="mx-1"  flat color="green">group</v-icon>
                </v-container>
                <v-subheader >Options</v-subheader>
                <div class="pl-3">
                  <v-chip small light class="black--text" disabled v-for="(option,index) in item.options" :key="index">{{option}}
                    <!-- <v-btn  icon color="grey" style="width:15px;height:15px">
                    <v-icon size="15">clear</v-icon>
                  </v-btn> -->
                </v-chip>
              </div>
              <!-- TODO: make visible if permitted and make reactive (icon) object to match icon with 'ADD' -->
              <!-- <v-subheader v-show="item.sharedOptions[user.email] == 'ADMIN' || item.owner == user.uid">Shared with</v-subheader> -->
              <v-subheader class="my-0 ">Shared with</v-subheader>
              <v-list class="my-0" dense >

                <v-list-tile  v-for="(share, key ,index) in item.sharedOptions" :key="key">
                  <v-list-tile-avatar class="pl-0 ml-0">
                    <v-icon color="orange">{{icons[share.mode]}}</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>  {{key}}   </v-list-tile-title>
                    <v-list-tile-sub-title> can {{share.mode}} {{share.addLimit}} </v-list-tile-sub-title>
                  </v-list-tile-content>

                  <v-spacer></v-spacer>
                  <div class="" v-for="(option,key, index) in item.restrictOptions" :key="key" >
                    <v-list-tile-action  style="dispay: block; align-items:center; text-align:center;">
                      <span class="font-weight-bold" v-text="key"></span>
                      <span v-text="option"></span>
                    </v-list-tile-action>
                  </div>

                </v-list-tile>
              </v-list>

            </v-card>


          </v-list-group>
        </v-slide-x-transition>
      </v-card>
      <v-card dark  style="max-width:800px; width:100%; text-align:center;">
        <v-toolbar dense flat color="purple darken-1" dark>
          <v-toolbar-title>Account </v-toolbar-title>

        </v-toolbar>
        <div v-if="userInfo.accountId"   class="pa-3" style="text-align:left;">
          <span  class="label">Account Name:</span><span v-text="userInfo.accountName"></span> <br>
          <span  class="label">Account ID:</span><span v-text="userInfo.accountId"></span> <br>
        </div>
        <div v-if="!userInfo.accountId" >

          <p class="pa-4 pb-0 mb-0">There are no premium accounts connected to your profile</p>
          <v-btn @click="$router.push('/accountsettings/' + user.uid)" class="orange mt-0 mb-3">Go Premium!</v-btn>

        </div>
      </v-card>
    </v-layout>
  </v-slide-y-transition>
</v-container>

</div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.label {
  display: inline-block;
  width: 110px;
  margin-right: 10px;
  font-weight: bold;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.theme--dark.v-list,
.theme--dark.v-card {
  background-color: #42424280;
  color: #fff;
}
.v-select,
.v-text-field {
  padding-left: 15px;
  padding-right: 15px;
}
.v-list--dense .v-list__tile:not(.v-list__tile--avatar) {
  padding-left: unset;
  /*padding-left: 25px;*/
}
</style>

<script scoped>
import firebase from "firebase";
import { db } from "../main";

import dashboardAddModal from "./dashboardAddModal.vue";
import dashboardShareModal from "./dashboardShareModal.vue";

import listView from "./listView.vue";

export default {
  components: {
    listView,
    dashboardAddModal,
    dashboardShareModal
  },
  data() {
    return {
      user: firebase.auth().currentUser,
      userInfo: {},
      allowActions: true,
      loggedIn: false,
      shareDialog: false,
      searchInput: "",
      icons: {
        VIEW: "remove_red_eye",
        ADD: "add",
        EDIT: "edit",
        ADMIN: "group"
      },
      items: [],
      searchResult: []
    };
  }, // >
  methods: {
    search: function() {
      let s = this.searchInput.toLowerCase().trim();
      let results = this.items.filter(function(val) {
        val = JSON.parse(JSON.stringify(val));

        if (
          val.title.toLowerCase().indexOf(s) >= 0 ||
          val.subTitle.toLowerCase().indexOf(s) >= 0
        ) {
          return true;
        } else {
          return false;
        }
      });
      this.searchResult = results;
    },
    getIcon: function(name) {
      return this.icons[name];
    }, 
    showListItem: function(id) {
      this.showListContent = id;
      this.showList = true;
      console.log(this.showListContent);
      this.$router.push({ name: "edit", params: { id } });
    },
    removeListItem: async function(id) {
console.log(id);
//DELETE ENTIRE LIST AND ALL ITEMS
var list = await db.collection("lists").doc(id).get();
console.log(list.data());
//get list_item id's of 'main' and 'adders'
let shared = list.data().shared
let itemRef = db.collection('list_items')
var batch = db.batch();
//delete main item
batch.delete(itemRef.doc(list.data().main_item))
// loop to delete linked items
for (var person in shared) {
  if (shared.hasOwnProperty(person)) {
    if (shared[person].mode === 'ADD') {
      batch.delete(itemRef.doc(shared[person].item.id))
    }
  }
}

try {
   let commit = await batch.commit()
console.log(commit);
    if (commit != undefined) {db.collection("lists").doc(id).delete()}

} catch (e) {
  alert('failed to delete connected list_items')
}


let res = await list.get()
console.log(res.data().shared);
//only removes from shared! Delete the linked list_items from this user serperately in 'listEdit'

    },
    refresh: async function(userInfo) {
      var d = this; var user = this.user; let objj = [];

      // get lists where accountId == one of accounts
      const listRef = db.collection("lists");
      for (let acc in userInfo.admin) {
        let list = await listRef.where("accountId", "==", acc).get();
        console.log("list ", list.docs);
        // add permission mode and id to object for later reference
        for (let doc of list.docs) {
          objj.push({ id: doc.id, permission: "ADMIN", ...doc.data() });
        }
      }
// get lists where person is in 'shared' field

        let shared = await listRef.where('shared.' + user.uid + '.mode', ">", "").get();
        for (let share of shared.docs) {
          console.log("share ", share.data());

          objj.push({ id: share.id, permission: share.data().shared[user.uid].mode, ...share.data() });
        }


      // push to view
      d.items = d.searchResult = [];
      d.items = objj;
      d.searchResult = objj;
    },
    getUser: async function() {
      let check = [];

      var userDoc = await db .collection("users") .doc(this.user.uid) .get();
      let user = userDoc.data();
      console.log("user => ", user);

      // if any of accounts is premium then allow actions
      for (let adm in user.admin) {
        check.push(user.admin[adm].isPremium);
      }
      if (check.includes(true)) {
        console.log("incheck");
        this.allowActions = true;
      }
      // set userInfo
      this.userInfo = user;
      console.log(this.userInfo);
      this.refresh(user);
    }
  },
  //no real function -remove?
  created: function() {
    this.getUser();
  },
  name: "Dashboard"
};
</script>
