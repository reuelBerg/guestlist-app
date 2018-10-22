<template>
  <v-container fluid class="mt-0 py-0" style="background: linear-gradient(grey, orange)">
    <v-btn  absolute bottom right fab color="black" style=" bottom: -20px;" :large="$vuetify.breakpoint.smAndUp" @click="refresh" >
      <v-icon :large="$vuetify.breakpoint.smOnly" >autorenew</v-icon>
    </v-btn>
    <listEditAddModal  :listId="listId" :options="listconfig" @refreshList="refresh"></listEditAddModal>

    <v-slide-y-transition mode="out-in">
      <v-layout row justify-center>
        <v-card d-block style="max-width:800px; width:100%">
          <v-toolbar  flat color="blue-grey darken-2" dark >
            <v-spacer></v-spacer>

            <v-input color="" style="max-width: 210px; height:32px;  border-radius:3px; background: #353535;" >
              <input @keyup="search" class=" white--text pa-2 " style=" " type="text" placeholder="Search names" v-model="searchInput">
              <v-icon v-show="searchInput != ''" small class="" @click="searchInput = ''">cancel</v-icon>
            </v-input>
            <v-spacer ></v-spacer>
          </v-toolbar>
          <v-list v-for="(doc, key) in searchResult"  :key="key" dense two-line>
            <v-subheader  class="white--text blue-grey">{{key.toUpperCase()}}</v-subheader>
            <v-list-group   v-for="(item, index) in doc"  v-model="item.active">
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
                  <v-avatar v-if="item.type == 'GROUP'" size="25" class="cyan"><span class="white--text">{{item.groupTotal}}</span></v-avatar>

              </div>

          </v-list-tile>
          <v-card  color="">
            <v-divider></v-divider>
            <div class="">
              <v-btn fab small v-if="key == 'account list'" @click="removeFromList(item.ref, item.name)" class="ml-1 cyan right"> <v-icon>delete</v-icon></v-btn>
              <v-btn fab small v-if="key == 'account list'" class="ml-1 cyan right"> <v-icon>edit</v-icon></v-btn>

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
                  <v-avatar class="grey darken-2" style="position: relative; top:-3px" size="25" icon><span class="white--text font-weight-bold" v-text="option"></span></v-avatar>
                </v-flex>
              </v-layout>
              <h3 class="mt-3">Added By</h3>
              <span v-text="item.addByName"></span>
              {{doc}}

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
import store from '../store'
import inputNumber from "./inputNumber.vue";
import listEditAddModal from "./listEditAddModal.vue";

export default {
  components: { inputNumber, listEditAddModal },
  data() {
    return {
      searchInput: "",
      listconfig: {},
      listId: this.$route.params.id,
      items: {},
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
              val.name.toLowerCase().indexOf(s) >= 0 ||
              val.info.toLowerCase().indexOf(s) >= 0
            ) {
              return true;
            } else {
              return false;
            }
          });
          obj[segment] = results;
        }
      }
      // console.log('searching', obj);

this.searchResult = obj
    },
    removeFromList: function(id, name) {
      db.collection("lists").doc(this.listId).collection("list_items").doc(id).update({[name]: firebase.firestore.FieldValue.delete()});
      this.refresh();
    },
    refresh: async function() {
      var id = this.listId; //list parent id
      if (!this.userInfo.fullName) {
return
      }
      let userInfo = this.userInfo;
      if (!this.listId) {
        this.listId = id;
      } // !something valid expression?
      console.log("** refreshing:" + id);

      const listRef = db.collection("lists").doc(id);
      const itemsRef = listRef.collection("list_items");
      //await list config
      let config = await listRef.get();
      let list_config = config.data();
    //bail if not admin or if admin account is not premium
      if (!this.userInfo.admin.hasOwnProperty(list_config.accountId)) {
        return this.bail();
      }
//if not premium
      if (!this.userInfo.admin[list_config.accountId].isPremium) {
        return this.bail();
      }



      console.log("still in");
this.items = {}
let itemArr = []


      // loop config.shared to get linked items
          let usr = firebase.auth().currentUser
          // get all the lists connected, main and shared
          let itemGet = await itemsRef.get()
          for (let items of itemGet.docs) { //loop each list_item doc
            let itemDoc = items.data()
            // loop the guests and make obj
            let name;
            if (this.userInfo.admin.hasOwnProperty(list_config.accountId)) { name = 'Account List' }
            else { name = list_config.shared[usr.uid].name || list_config.shared[usr.uid].email}

            for (var doc in itemDoc) {
              if (itemDoc.hasOwnProperty(doc)) {
            itemDoc[doc].ref = itemGet.id
            itemArr.push(itemDoc[doc])
            this.items[name] = itemArr
          }
        }
          }


      this.listconfig = list_config;
      this.searchResult = this.items;
    },

    bail: function() {
      alert("You are not allowed to be here");
      this.$router.push("/dashboard");
    }
  },
  created: function() {
    this.refresh();
  },
  name: "listEdit"
};
</script>
