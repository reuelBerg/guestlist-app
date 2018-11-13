<template>
  <div class="d-flex pa-0 ma-0" >

    <v-btn fixed absolute bottom right fab color="barcolor darken-4 white--text" style=" bottom: 20px;" :large="$vuetify.breakpoint.smAndUp" @click="refresh" >
      <v-icon :large="$vuetify.breakpoint.smAndUp" style="display:flex " >autorenew</v-icon>
    </v-btn>
    <!-- add name to list -->
    <dashboardAddModal v-if="allowActions && accounts.length > 0" @refreshList="refresh" ></dashboardAddModal>

<v-container fluid class="pa-0 ma-0" :class="$vuetify.breakpoint.smAndUp ? 'mt-5' : 'mt-5'">
      <v-slide-y-transition mode="out-in">
        <v-layout column align-center>
          <v-card class="elevation-5 barcolor lighten-4" :style="$vuetify.breakpoint.smAndDown ? '; width:100%' : 'width:800px'" style="">

<!-- toolbar -->
            <v-toolbar :fixed="$vuetify.breakpoint.smAndDown"  dense flat color="barcolor darken-1" dark  :style="ios ? 'top:76px;' : $vuetify.breakpoint.smAndDown ? 'top:56px' : '' " style="width:100%">
              <v-input class="barcolor darken-3 title" style="height:32px;  border-radius:3px; background: #353535;" >
                <input @keyup="search()" class=" white--text pa-2 " style=" width:90%" type="text" placeholder="Search..." v-model="searchInput">
                <v-icon v-show="searchInput != ''" small class="pr-2" @click="searchInput = ''; search()">cancel</v-icon>
              </v-input>
              <v-spacer ></v-spacer>
              <v-avatar size="30" class="barcolor darken-2 subheading "><span v-text="totalCount"></span></v-avatar>
              <!-- TODO: make sort menu -->
            </v-toolbar>
            <!-- <div v-show="items['accounts'].length < 1 && userInfo.accountId || userInfo.admin " class="font-italic grey--text pa-3" style='text-align:center;'>Use <v-icon small class="grey--text">add_circle_outline</v-icon> to make a list!</div>
            <div v-show="items['accounts'].length < 1 && !userInfo.accountId && !userInfo.admin" class="font-italic grey--text pa-3" style='text-align:center;'>You have no lists to show</div> -->

            <!-- list -->
            <v-slide-x-transition class="py-0 my-0  barcolor lighten-5"  three-line tag="v-list" v-for="(seg, key) in searchResult" :key="key" group >
              <v-subheader   v-if="seg.length > 0" :key="key" class="white--text barcolor pa-4">
                <v-avatar size="18" class="mr-2"  :class="accounts.indexOf(key) >= 0 ? 'green darken-4' : 'red darken-4'"><v-icon :class="accounts.indexOf(key) >= 0  ? 'green--text' : 'red--text'" v-text="dashboardAccounts[key] ? 'check_circle' : 'remove_circle'"></v-icon></v-avatar>

                {{key.toUpperCase()}}
<v-spacer></v-spacer>
<v-avatar size="20" class="barcolor lighten-1 "><span v-if="seg" class="white--text " v-text="seg.length"></span></v-avatar>
              </v-subheader>

              <v-list-group   v-if="Array.isArray(seg)"   v-for="(item, index) in seg"  :key="index" v-model="item.active">
                <v-list-tile class=" py-2"  slot="activator" >

                  <v-list-tile-content>
                    <v-list-tile-title class="barcolor--text text--darken-4" v-text="item.title"></v-list-tile-title>
                    <v-list-tile-sub-title class="barcolor--text font-weight-medium font-italic" v-text="item.subTitle"></v-list-tile-sub-title>
                    <v-list-tile-sub-title v-if="item.date" class=" ">{{dateString(item.date)}}</v-list-tile-sub-title>
                  </v-list-tile-content>

                  <v-spacer ></v-spacer>

                  <div class="">
                    <span v-if="item.permission == 'ACTIVATE'" v-text="" class="barcolor--text py-2"></span>
                    <span v-else-if="item.permission == 'ADD'" v-text="'+ ' + item.shared[user.uid].addLimit" class="barcolor--text py-2"></span>
                    <span v-else v-text="item.count + '/' + item.maxCount" class="barcolor--text py-2"></span>
                  </div>

                </v-list-tile>
                <!-- card -->
                <v-card class="barcolor pa-3 pb-0 mb-0 lighten-5">
                  <v-layout v-if="accounts.indexOf(key) >= 0"  row wrap justify-end class="">
                    <v-btn small fab v-if="item.permission == 'ADMIN'" class=" orange orange--text text--lighten-5 "  @click="$router.push('/stats/' + item.id)"><v-icon style="font-size:27px;">trending_up</v-icon></v-btn>
                    <v-btn small fab v-if="item.permission == 'ADD'" class=" teal barcolor--text text--lighten-5"  @click="showAddPage(item.id)"><v-icon style="font-size:27px;">add</v-icon></v-btn>
                    <v-btn small fab v-if="item.permission == 'ADMIN'" class=" teal teal--text text--lighten-5"  @click="showListItem(item.id)"><v-icon style="font-size:27px;">add</v-icon></v-btn>
                    <v-btn small fab v-if="item.permission == 'ADMIN'" class=" lime darken-2 lime--text text--lighten-5"  @click.stop="removeDialog = true; removeDialogItemId = item.id"><v-icon style="font-size:27px;">delete</v-icon></v-btn>
                    <!-- TODO: activate page button etc. -->
                    <dashboardShareModal v-if="item.permission == 'ADMIN'" :add="item" :listid="item.id" v-model="shareDialog" @refreshList="refresh"></dashboardShareModal>
                    <v-btn small fab v-if="item.permission == 'ACTIVATE' || item.permission == 'ADMIN'" class="primary light primary--text text--lighten-5"   @click="showActivePage(item.id)"><v-icon style="font-size:27px;">done_all</v-icon></v-btn>

                  </v-layout>

                  <div style=" border-left: 6px solid teal">
                    <!-- <span v-if="item.date" class="ml-3 mt-5 font-weight-medium primary--text text--darken-4">{{dateString(item.date)}}</span> <br> -->
                    <!-- <span v-if="item.title" class="ml-3 mt-5 font-weight-medium primary--text text--darken-3">{{item.title.toUpperCase()}}</span> <br> -->
                    <span class="ml-3 font-italic primary--text text--darken-2">{{item.subTitle}}</span>
                  </div>

                  <div class="mt-1" style=" border-left: 6px solid pink!important; width:100%" >
                  <v-subheader class="pink--text text--darken-2 mt-1" >Hand Outs</v-subheader>
                  <p class="ml-3 mt-2" style="display:inline-block">
                    <span class="pink--text text--lighten-2 pa-1 my-1 mr-1" style="border: 3px solid pink; border-radius:3px;" v-for="(option,index) in item.options" :key="index">{{option}}</span>
                  </p>
                  </div>
                <div class="mt-1" style=" border-left: 6px solid orange">
                <v-subheader class="orange--text text--darken-2 my-0" v-if="item.permission == 'ADMIN' && item.shared != undefined"  >Shared with</v-subheader>
                <v-list v-if="item.permission == 'ADMIN' " class="my-0 py-0 barcolor lighten-5" dense >

                  <div class="px-3 py-0 pb-3" v-for="(share, key ,index) in item.shared" :key="key" >
                    <v-icon small class="mr-0" color="orange">{{icons[share.mode]}}</v-icon>
                    <span py-2 style="height:24px"> {{share.email}}</span> <span class="grey--text"> - {{share.mode}} {{share.addLimit}}</span>
                  </div>
{{item.account}}
                </v-list>
              </div>

              </v-card>


            </v-list-group>
          </v-slide-x-transition>
        </v-card>
        <v-card dark class="elevation-5 mt-3 barcolor lighten-2" style="max-width:800px; width:100%; text-align:center;">
          <!-- <v-toolbar dense flat color="purple darken-1" dark>
            <v-toolbar-title>Account </v-toolbar-title>

          </v-toolbar> -->
          <div v-if="userInfo.accountId"   class="" style="text-align:left;">

            <!-- <div class="" >
              <v-chip disabled class="elevation-5 black--text" avatar v-for="(ac, index) in dashboardAccounts" :key="index">
            <v-avatar  :class="ac[1] ? 'green darken-4' : 'red darken-4'"><v-icon :class="ac[1] ? 'green--text' : 'red--text'" v-text="ac[1] ? 'check_circle' : 'remove_circle'"></v-icon></v-avatar>
            {{ac[0]}}
            </v-chip>
            </div> -->
            <!-- <div class="" >
              <v-chip disabled class="elevation-5 black--text" avatar v-for="(val, key) in dashboardAccounts" :key="key">
            <v-avatar  :class="val ? 'green darken-4' : 'red darken-4'"><v-icon :class="val ? 'green--text' : 'red--text'" v-text="val ? 'check_circle' : 'remove_circle'"></v-icon></v-avatar>
            {{key}}
            </v-chip>
            </div> -->
            <!-- <span  class="label">Account Name:</span><span v-text="userInfo.accountName"></span> <br>
            <span  class="label">Account ID:</span><span v-text="userInfo.accountId"></span> <br>
            <v-btn small @click="$router.push('/account/' + user.uid)" class="primary darken-2 ml-0 mt-1 mb-3"> go to settings</v-btn> -->

          </div>
          <div v-if="!userInfo.accountId && accounts.length == 0" >
            <p class="pa-4 pb-0 mb-0">There are no premium accounts connected to your profile. If you want to add or edit lists consider going premium!</p>
            <v-btn @click="$router.push('/account/' + user.uid)" class="orange mt-0 mb-3">Go Premium!</v-btn>

          </div>
        </v-card>
      </v-layout>
    </v-slide-y-transition>

  </v-container>
  <v-layout row justify-center>
    <v-dialog v-model="removeDialog" persistent max-width="320" >
      <v-card dark class="barcolor pa-4">
        <v-card-title class="headline font-weight-bold">Remove list?</v-card-title>
        <v-card-text>This will delete all guests from all connections. Beware, action cannot be undone.  </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="white " flat @click.native="removeDialog = false">cancel</v-btn>
          <v-btn outline color="white" flat @click.native="removeDialog = false;  removeListItem(removeDialogItemId)">Remove</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-layout>
</div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-list__tile__content {
  width: 40vw;
  overflow: hidden;
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
.v-list__group__header .v-list__group__header__append-icon {
  display: none;
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
@media only screen and (max-width: 959px) {
  .container {
    padding: 0 !important;
  }
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
      ios: store.state.ios,
      allowActions: false,
      loggedIn: false,
      removeDialog: false,
      removeDialogItemId: "",
      shareDialog: false,
      searchInput: "",
      icons: {
        ACTIVATE: "done_all",
        ADD: "add",
        EDIT: "edit",
        ADMIN: "group"
      },
      items: {},
      searchResult: {}
    };
  }, // >
  watch: {
  },
  computed: {

    accounts() {
    let arr = []

    for (var acc in this.userInfo.admin) {
    if (this.userInfo.admin.hasOwnProperty(acc)) {
      if (this.userInfo.admin[acc].isPremium) {
        arr.push(this.userInfo.admin[acc].name)
      } else { alert( 'Your premium membership of "' + this.userInfo.admin[acc].name + '" expired! You cannot manage these lists.')}
    }
    }

    return arr
    },
    userInfo() {
this.allowActions = true;
      return store.state.user;
    },
    dashboardData() {
      return store.state.dashboard;
      this.refresh();

    },
    dashboardAccounts() {
      return store.state.dashboardAccounts;
    },
    totalCount: function() {
      let total = 0;

      for (var part of Object.keys(this.items)) {
        if (this.items.hasOwnProperty(part) && this.items[part] != undefined) {
          total += this.items[part].length;
        }
      }
      return total;
    }
  },
  methods: {
    dateString: function(date) {
      // dd/mm/yyy
      let d = date.split("/");
      let month = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];

      return d[0] + " " + month[d[1]-1] + ", " + d[2];
    },
    search: function() {
      let s = this.searchInput.toLowerCase().trim();
      let obj = {};
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
      this.searchResult = obj;
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
      const listRef = db.collection("lists").doc(item);

      console.log("itemparam", item);
      //DELETE ENTIRE LIST AND ALL ITEMS

      let itemRef = listRef.collection("list_items");
      let listItems = await itemRef.get();
      var batch = db.batch();

      // loop to delete linked items
      for (var list in listItems) {
        if (list.exists) {
          let it = itemRef.doc(list.id);
          batch.delete(item);
        }
      }
       let statsRef = db.collection('stats').doc(item)
      batch.delete(statsRef)

      try {
        batch.commit().then((doc) => {
          db.collection("lists") .doc(item) .delete();
        });

        this.refresh();
      } catch (e) {
        alert("failed to delete connected list_items");
      }

      //only removes from shared! Delete the linked list_items from this user serperately in 'listEdit'
    },
    refresh: async function(userInfo) {
      var d = this;

      userInfo = this.userInfo;

      if (userInfo.admin || userInfo.accountId ) {
        this.allowActions = true;
      } else {
        this.allowActions = false;

      }

      let objj =  store.state.dashboard  //this.dashboardData;

      // for (var seg in objj) {
      //   if (objj.hasOwnProperty(seg)) {
      //     objj[seg] = this.sortOnDate(objj[seg]);
      //   }
      // }
      // push to view
      d.items = objj;
      d.searchResult = objj;
    },
    sortOnDate: function(arr) {
      let sorted = arr.sort((a, b) => {
        let ad = a.date.split("/"); // returns [dd, mm, yyy]
        let bd = b.date.split("/"); // returns [dd, mm, yyy]

        a = new Date(ad[2], ad[1] - 1, ad[0]);
        b = new Date(bd[2], bd[1] - 1, bd[0]);
        return a > b ? 1 : a < b ? -1 : 0;
      });
      return sorted;
    }
  },
  //no real function -remove?
  mounted: function() {
    this.refresh();

  },
  name: "Dashboard"
};
</script>
