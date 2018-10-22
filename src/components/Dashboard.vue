<template>
  <div class="d-flex">

    <v-btn fixed absolute bottom right fab color="black" style=" bottom: 10px;" :large="$vuetify.breakpoint.smAndUp" @click="refresh" >
      <v-icon :large="$vuetify.breakpoint.smAndUp" style="display:flex " >autorenew</v-icon>
    </v-btn>
    <!-- add name to list -->
    <dashboardAddModal v-if="allowActions" @refreshList="refresh" ></dashboardAddModal>
    <v-container fluid>
      <v-slide-y-transition mode="out-in">
        <v-layout column align-center>

          <v-card style="max-width:800px; width:100%">
            <!-- toolbar -->
            <v-toolbar dense flat color="blue-grey darken-1" dark>
              <v-input class="blue-grey darken-2" style="max-width: 180px; height:32px;  border-radius:3px;" >
                <input @keyup="search" class=" white--text pa-2 " style="max-width: 160px; height:32px;  border-radius:3px;" type="text" placeholder="Search names" v-model="searchInput">
                <v-icon v-show="searchInput != ''" small class="" @click="searchInput = ''">cancel</v-icon>
              </v-input>
              <v-spacer ></v-spacer>              <v-spacer></v-spacer>
              <span>Sort by:</span>
              <!-- TODO: make sort menu -->
            </v-toolbar>

            <!-- list -->
            <v-slide-x-transition tag="v-list" v-for="(seg, key) in searchResult" :key="key" group >
              <v-subheader :key="key" class="white--text blue-grey">{{key.toUpperCase()}} </v-subheader>

              <v-list-group   no-action  v-for="(item, index) in seg"  :key="index" v-model="item.active">
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
                    <v-btn small fab v-if="item.permission == 'ADD'" class=" blue-grey "  @click="showAddPage(item.id)"><v-icon>note_add</v-icon></v-btn>
                    <v-btn small fab v-if="item.permission == 'ADMIN'" class=" blue-grey "  @click="showListItem(item.id)"><v-icon>edit</v-icon></v-btn>
                    <v-btn small fab v-if="item.permission == 'ADMIN'" class=" cyan darken-2 "  @click="removeListItem(item.id)"><v-icon>delete</v-icon></v-btn>
                    <!-- TODO: activate page button etc. -->
                    <dashboardShareModal v-if="item.permission == 'ADMIN'" :add="item" :listid="item.id" v-model="shareDialog" @refreshList="refresh"></dashboardShareModal>
                    <v-btn small fab v-if="item.permission == 'ACTIVATOR' || item.permission == 'ADMIN'" class="cyan light white--text"   @click="showActivePage(item.id)"><v-icon>power_settings_new</v-icon></v-btn>

                  </v-layout>

                  <span class="pl-3">{{item.subTitle}}</span>

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
                <v-subheader v-if="item.permission == 'ADMIN'" class="my-0  " >Shared with</v-subheader>
                <v-list v-if="item.permission == 'ADMIN'" class="my-0 " dense >

                  <div class="px-3" v-for="(share, key ,index) in item.shared" :key="key" >
                    <v-icon small color="orange">{{icons[share.mode]}}</v-icon>
                    <span py-2 style="height:24px"> {{share.email}}</span> <span class="grey--text"> - {{share.mode}} {{share.addLimit}}</span>
                  </div>

                </v-list>

              </v-card>


            </v-list-group>
          </v-slide-x-transition>
        </v-card>
        <v-card dark  style="max-width:800px; width:100%; text-align:center;">
          <!-- <v-toolbar dense flat color="purple darken-1" dark>
            <v-toolbar-title>Account </v-toolbar-title>

          </v-toolbar> -->
          <div v-if="userInfo.accountId"   class="pa-3" style="text-align:left;">
            <span  class="label">Account Name:</span><span v-text="userInfo.accountName"></span> <br>
            <span  class="label">Account ID:</span><span v-text="userInfo.accountId"></span> <br>
            <v-btn small @click="$router.push('/accountsettings/' + user.uid)" class="cyan ml-0 mt-1 mb-3"> go to settings</v-btn>

          </div>
          <div v-if="!userInfo.accountId" >

            <p class="pa-4 pb-0 mb-0">There are no premium accounts connected to your profile. If you want to add or edit lists consider going premium!</p>
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
.theme--dark.v-list-tile {
  padding-left: 0;
}
.v-subheader {
  height: 24px;
}
</style>

<script scoped>
import firebase from "firebase";
import { db } from "../main";
import store from "../store";

import dashboardAddModal from "./dashboardAddModal.vue";
import dashboardShareModal from "./dashboardShareModal.vue";


export default {
  components: {
    dashboardAddModal,
    dashboardShareModal
  },
  data() {
    return {
      user: firebase.auth().currentUser,
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
      items: {},
      searchResult: {}
    };
  }, // >
  watch: {
    userInfo: function() {
      this.refresh();
    }
  },
  computed: {
    userInfo() {
      return store.state.user;
    }
  },
  methods: {
    search: function() {
      let s = this.searchInput.toLowerCase().trim();
let obj = {}
      for (var segment in this.items) {
        if (this.items.hasOwnProperty(segment)) {
          let results = this.items[segment].filter(function(val) {
            val = JSON.parse(JSON.stringify(val));
            //return condition for filter
            if (
              val.title.toLowerCase().indexOf(s) >= 0 ||
              val.subTitle.toLowerCase().indexOf(s) >= 0
            ) {
              return true;
            } else {
              return false;
            }
          });
          obj[segment] = results;
        }
      }
this.searchResult = obj

    },
    getIcon: function(name) {
      return this.icons[name];
    },
    showListItem: function(id) {
      this.$router.push({ name: "edit", params: { id } });
    },
    showAddPage: function(id) {
      this.$router.push({ name: "add", params: { id } });
    },
    showActivePage: function(id) {
      this.$router.push({ name: "active", params: { id } });
    },
    removeListItem: async function(item) {
      const listRef = db.collection("lists").doc('6hNWz04w1XVBbeDNJ1HR');

      console.log("itemparam", item);
      //DELETE ENTIRE LIST AND ALL ITEMS

      let itemRef = listRef.collection("list_items");
      let listItems = await itemRef.get()
      var batch = db.batch();

      // loop to delete linked items
      for (var list in listItems) {
console.log(list);
        if (list.exists) {
            let item = itemRef.doc(list.id);
            batch.delete(item);
        }
      }

      try {
        batch.commit().then(() => {
          db.collection("lists")
            .doc(item)
            .delete();
        });

        this.refresh();
      } catch (e) {
        alert("failed to delete connected list_items");
      }

      //only removes from shared! Delete the linked list_items from this user serperately in 'listEdit'
    },
    refresh: async function(userInfo) {
      var d = this;
      var user = this.user;
      let objj = {};
      userInfo = this.userInfo;

      // get lists where accountId == one of accounts
      const listRef = db.collection("lists");
      for (let acc in userInfo.admin) {
        let list = await listRef.where("accountId", "==", acc).get();
        console.log("list ", list.docs);

        // add permission mode and id to object for later reference
        objj['company lists'] = []

        for (let doc of list.docs) {
          objj['company lists'].push({ id: doc.id, permission: "ADMIN", ...doc.data() });
        }
      }
      //get lists where person is 'activator'

        let sharedActivator = await listRef
          .where("shared." + user.uid + ".mode", "==", "ACTIVATOR")
          .get();
          objj['lists you can activate'] = []

        for (let share of sharedActivator.docs) {
          let sharedoc = share.data()
          console.log("share ", sharedoc);
          objj['lists you can activate'].push({
            id: share.id,
            permission: "ACTIVATOR",
            ...sharedoc
          });
        }

      // get lists where person is in 'shared' field
      let sharedAdd = await listRef
        .where("shared." + user.uid + ".mode", "==", "ADD")
        .get();
        objj['lists you can add'] = []
      for (let share of sharedAdd.docs) {
        let sharedoc = share.data()
        console.log("share ", sharedoc);
        objj['lists you can add'].push({
          id: share.id,
          permission: 'ADD',
          ...sharedoc
        });
      }

      if (!userInfo.admin || Object.keys(userInfo.admin).length == 0) {
        this.allowActions = false;
        console.log('no .admin in userInfo', userInfo);
      }
console.log(objj);
for (var seg in objj) {
  if (objj.hasOwnProperty(seg)) {
    objj[seg] = this.sortOnDate(objj[seg])
  }
}
      // push to view
      d.items = d.searchResult = {};
      d.items = objj;
      d.searchResult = objj;
    },
    sortOnDate: function(arr) {
let sorted = arr.sort((a, b) => {
console.log('a', a.date);
console.log(b.date);
  let ad = a.date.split('/') // returns [dd, mm, yyy]
  let bd = b.date.split('/') // returns [dd, mm, yyy]

a = new Date(ad[2], ad[1]-1, ad[0])
b = new Date(bd[2], bd[1]-1, bd[0])
console.log(a, ' ', b);
return a>b ? 1 : a<b ? -1 : 0;

})
return sorted
    }
  },
  //no real function -remove?
  mounted: function() {
    this.refresh();
  },
  name: "Dashboard"
};
</script>
