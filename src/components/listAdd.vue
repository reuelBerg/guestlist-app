<template>
  <v-container fluid class="mt-0 py-0" >
    <v-btn  absolute bottom right fab color="black" style=" bottom: -20px;" :large="$vuetify.breakpoint.smAndUp" @click="refresh" >
      <v-icon :large="$vuetify.breakpoint.smOnly" >autorenew</v-icon>
    </v-btn>
    <listAddAddModal  :listId="itemId" :options="listconfig" @refreshList="refresh"></listAddAddModal>



    <v-slide-y-transition mode="out-in">
      <v-layout row wrap justify-center>
        <!-- top info part -->
        <v-card d-flex class="pa-3" style="max-width:400px; width:100%; ">
          <h3 style="">You are invited to add <span class="cyan--text">{{shared.addLimit}}</span>
          guests to <br> <span class="cyan--text">{{listconfig.title}}</span> on <span v-text="date" class=" cyan--text"></span></h3>

        </v-card>
        <v-card d-flex class="pa-3" style="max-width:400px; width:100%; ">
          <h4>You have the following options left to distribute.</h4>
          <div v-for="(item, key) in shared.options" class="pa-1">
            <span class="label">{{key.toUpperCase()}}</span>
            <v-avatar icon size="22" class="cyan white--text">{{item}}</v-avatar icon small>
            of
            <v-avatar icon size="25" class="cyan white--text">{{item}}</v-avatar icon small>

          </div>
        </v-card>

        <!-- toolbar -->
        <v-card d-block style="max-width:800px; width:100%">
          <v-toolbar  flat color="grey darken-3" dark >
            <v-spacer></v-spacer>
            <!-- search -->
            <v-input color="" style="max-width: 210px; height:32px;  border-radius:3px; background: #353535;" >
              <input @keyup="search" class=" white--text pa-2 " style=" " type="text" placeholder="Search names" v-model="searchInput">
              <v-icon v-show="searchInput != ''" small class="" @click="searchInput = ''">cancel</v-icon>
            </v-input>
            <v-spacer ></v-spacer>
          </v-toolbar>
          <div v-show="items.length < 1" style='text-align:center;'>Time to add some guests!</div>
            <!-- list start -->
          <v-list  dense two-line>
            <v-list-group   v-for="(item, index) in searchResult"  v-model="item.active">
              <template  >
                <!-- list titles -->
                <v-list-tile slot="activator"  :key="item.key" avatar @click="" >
                  <v-list-tile-avatar class="hidden-xs-only" color="blue-grey">
                    <span v-text="item.name.charAt(0).toUpperCase()" class=" "></span>
                  </v-list-tile-avatar>

                  <v-list-tile-content >
                    <v-list-tile-title  v-text="item.name"></v-list-tile-title>
                    <!-- TODO: make subtitle that shows who added this -->
                    <v-list-tile-sub-title >{{item.info}}</v-list-tile-sub-title>

                  </v-list-tile-content>

                  <v-spacer ></v-spacer>

                  <span v-text="" class="orange--text font-weight-bold pa-2">{{item.type}}</span>   <!-- TODO make dynamic -->
                  <v-avatar v-if="item.type == 'GROUP'" size="25" class="cyan"><span class="white--text">5</span></v-avatar>

              </div>



          </v-list-tile>
          <v-card  color="">
            <v-divider></v-divider>
            <div class="">
              <v-btn fab small @click="removeFromList(item.ref, item.name)" class="ml-1 cyan right"> <v-icon>delete</v-icon></v-btn>
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
import store from '../store'
import inputNumber from "./inputNumber.vue";
import listAddAddModal from "./listAddAddModal.vue";

export default {
  components: { inputNumber, listAddAddModal },
  data() {
    return {
      user: firebase.auth().currentUser,
      searchInput: "",
      listconfig: {},
      itemId: '',
      month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      items: [],
      searchResult: []
    };
  },
  watch: {
  userInfo: function () {
    this.refresh()
  }
  },
    computed: {
      userInfo() {
      return store.state.user
  },
  shared() {
if (this.listconfig != {}) {
  return this.listconfig.shared[this.user.uid]

}
},
date(val) {
  let d = this.listconfig.date
  let s = d.split('/') //dd/mm/yyyy

return  s[0] + ' ' + this.month[s[1]] + ', '  + s[2]
}

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
    removeFromList: function(id, name) {

      db.collection("list_items").doc(id).update({[name]: firebase.firestore.FieldValue.delete()});
      this.refresh();
    },
    refresh: async function() {
      var id = this.$route.params.id;
      let userInfo = this.userInfo;
      if (!this.listId) {
        this.listId = id;
      } // !something valid expression?
      console.log("** refreshing:" + id);
      const listRef = db.collection("lists").doc(id);
      const itemsRef = db.collection("list_items");
      //await list config
      let config = await listRef.get();
      let list_config = config.data();



      console.log("still in yeah");

// Bail if not in shared
      if (!list_config.shared.hasOwnProperty(this.user.uid)) {  return this.bail()
}
// clear and replace old list
this.items = []
let itemId = list_config.shared[this.user.uid].item_id
this.itemId = itemId
let str = list_config.shared[this.user.uid].item_id
let itemGet = await itemsRef.doc(str).get()
let itemDoc = itemGet.data()
for (var doc in itemDoc) {
  if (itemDoc.hasOwnProperty(doc)) {
itemDoc[doc].ref = itemGet.id
    this.items.push(itemDoc[doc])
  }
}
      // loop config.shared to get linked items

console.log(this.items);
      this.listconfig = list_config;
      this.searchResult = this.items;
    },
    bail: function() {
      alert("Security! You are not allowed to be here my friend.");
      this.$router.replace("/dashboard");
    }
  },
  created: function() {
    this.refresh();
  },
  name: "listAdd"
};
</script>
