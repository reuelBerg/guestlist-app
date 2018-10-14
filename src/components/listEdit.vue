<template>
  <v-container fluid class="mt-0 py-0" >
    <v-btn  absolute bottom right fab color="black" style=" bottom: -20px;" :large="$vuetify.breakpoint.smAndUp" @click="refresh" >
      <v-icon :large="$vuetify.breakpoint.smOnly" >autorenew</v-icon>
    </v-btn>
    <listEditAddModal  :listId="listId" :options="listconfig.options" @refreshList="refresh"></listEditAddModal>

    <v-slide-y-transition mode="out-in">
      <v-layout row justify-center>
        <v-card d-block style="max-width:800px; width:100%">
          <v-toolbar  flat color="grey darken-3" dark >
            <v-spacer></v-spacer>

            <v-input color="" style="max-width: 250px; height:32px;  border-radius:3px; background: #353535;" >
              <input @keyup="search" class=" white--text pa-2 " style=" " type="text" placeholder="Search names" v-model="searchInput">
              <v-icon v-show="searchInput != ''" small class="" @click="searchInput = ''">cancel</v-icon>
            </v-input>
            <v-spacer ></v-spacer>
          </v-toolbar>
          <v-list  dense two-line>
            <v-list-group    v-for="(item, index) in searchResult"  :key="index" v-model="item.active">
              <template >
                <!-- list titles -->
                <v-list-tile slot="activator" :key="item.name" avatar @click="" >
                  <v-list-tile-avatar class="hidden-xs-only" color="blue-grey">
                    <span v-text="item.name.charAt(0)" class=" "></span>
                  </v-list-tile-avatar>

                  <v-list-tile-content >
                    <v-list-tile-title  v-text="item.name"></v-list-tile-title>
                    <!-- TODO: make subtitle that shows who added this -->
                    <v-list-tile-sub-title >{{item.info}}</v-list-tile-sub-title>

                  </v-list-tile-content>

                  <v-spacer ></v-spacer>

                  <span v-text="" class="orange--text font-weight-bold pa-2">{{item.type}}</span>   <!-- TODO make dynamic -->
                  <v-divider vertical inset></v-divider>
                  <!-- list action button -->
                  <!-- <div class="" v-for="(option, key) in item.options" :key="option" >
                  <v-list-tile-action  style="dispay: block; align-items:center; text-align:center;">
                  <span class="font-weight-bold" v-text="key"></span>
                  <span v-text="option"></span>
                </v-list-tile-action> -->
              </div>

              <!-- <v-list-tile-action  style="dispay: block; align-items:center; text-align:center;">
              <v-icon large color="teal">edit</v-icon>
            </v-list-tile-action> -->

          </v-list-tile>
          <v-card  color="">
            <v-divider></v-divider>
            <div class="">
              <v-btn fab small @click="removeFromList(index)" class="ml-1 cyan right"> <v-icon>delete</v-icon></v-btn>
              <v-btn fab small class="ml-1 cyan right"> <v-icon>edit</v-icon></v-btn>

            </div>
            <div class="mx-3 my-2">
              <span v-text="" class="orange--text font-weight-bold headline">{{item.type}}</span>   <!-- TODO make dynamic -->
              <br>
              <span class="subheader">{{item.info}}</span>
              <br>

              <h3 class="mt-3">Options</h3>
              <v-layout row wrap  align-content-start  class=""  >
                <v-flex   v-for="(option, key) in item.options" :key="key" class="white mr-1 pa-1" :style="option == 0 ? 'opacity: 0.2;' : 'opacity: 1;'" style="text-align:center; min-width:50px!important;height:50px!important; flex:unset;">
                  <span class="font-weight-bold grey--text text--darken-2" v-text="key"></span><br>
                  <v-avatar tile class="grey darken-2" size="25" icon><span class="white--text font-weight-bold" v-text="option"></span></v-avatar>
                </v-flex>
              </v-layout>
              <h3 class="mt-3">Added By</h3>
              <span v-text="item.addByName"></span>
            </div>


          </v-card>
        </template>
      </v-list-group>
    </v-list>
  </v-card>

</v-layout>
</v-slide-y-transition>
<div v-show="items.length < 1" >Time to add some guests!</div>
</v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-list__tile__content {
  width: 40vw;
  overflow: hidden;
}
.v-list__group__header--active,
.v-list--group :hover {
  background-color: red;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.theme--dark.v-list,
.v-list__group__items {
  background-color: #42424295;
  color: #fff;
}
.v-select,
.v-text-field {
  padding-left: 15px;
  padding-right: 15px;
}
</style>

<script scoped>
import firebase from "firebase";
import { db } from "../main";
import inputNumber from "./inputNumber.vue";
import listEditAddModal from "./listEditAddModal.vue";

/* list object
{
name: '',
info: '',
extraOptions: {
option_1: 5 // guests or coins or t-shirts whatev
},

} */
export default {
  components: { inputNumber, listEditAddModal },
  data() {
    return {
      user: firebase.auth().currentUser,
      searchInput: "",
      userInfo: {},
      listconfig: {},

      items: [],
      searchResult: []
    };
  },
  methods: {
    search: function() {
      // let regex = new RegExp(this.searchInput, "i")
      let s = this.searchInput.toLowerCase().trim();
      let results = this.items.filter(function(val) {
        val = JSON.parse(JSON.stringify(val));
        // console.log(JSON.parse(JSON.stringify(val)));
        if (
          val.name.toLowerCase().indexOf(s) >= 0 ||
          val.info.toLowerCase().indexOf(s) >= 0
        ) {
          return true;
        } else {
          return false;
        }
      });
      this.searchResult = results;
    },
    removeFromList: function(index) {
      let id = this.items[index].id;
      db.collection("lists")
      .doc(this.listId)
      .collection("items")
      .doc(id)
      .delete();
      this.getUser();
    },
    refresh: async function(userInfo) {
      var d = this;
      var id = this.$route.params.id;
      if (!this.listId) {
        this.listId = id;
      } // !something valid expression?
      console.log("** refreshing:" + id);

      const listRef = db.collection("lists").doc(id);
      const itemsRef = listRef.collection("items");
      //await list config
      let config = await listRef.get();
      let list_config = config.data();
      if (!this.userInfo.admin.hasOwnProperty(list_config.accountId)) {
        return this.bail();
      }
      if (!this.userInfo.admin[list_config.accountId].isPremium) {
        return this.bail();
      }

      console.log("still in");
      //await list items
      let list_items = await itemsRef.get();
      console.log("item => ", list_items);
      this.items = [];
      for (let item of list_items.docs) {
        let obj = { id: item.id, ...item.data() };
        this.items.push(obj);
      }

      this.listconfig = list_config;
      this.searchResult = this.items;
    },
    bail: function() {
      alert("You are not allowed to be here");
      this.$router.push("/dashboard");
    },
    getUser: async function() {
      let check = [];

      var userDoc = await db
      .collection("users")
      .doc(this.user.uid)
      .get();
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
      console.log(user);
      this.refresh(user);
    }
  },
  created: function() {
    this.getUser();
    this.refresh();
  },
  computed: {},
  watch: {},
  name: "listEdit"
};
</script>
