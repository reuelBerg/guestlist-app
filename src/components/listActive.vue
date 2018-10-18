<template>

  <v-container fluid class="mt-0 py-0" >
    <v-btn  absolute bottom right fab color="black" style=" bottom: -20px;" :large="$vuetify.breakpoint.smAndUp" @click="refresh" >
      <v-icon :large="$vuetify.breakpoint.smOnly" >autorenew</v-icon>
    </v-btn>

    <v-slide-y-transition mode="out-in">
      <v-layout row justify-center>

        <v-card d-block class="mt-3" style="max-width:800px; width:100%">
          <v-toolbar  flat color="blue-grey darken-2" dark >
            <v-spacer></v-spacer>
            <v-input color="" style="max-width: 210px; height:32px;  border-radius:3px; background: #353535;" >
              <input @keyup="search" class=" white--text pa-2 " style=" " type="text" placeholder="Search names" v-model="searchInput">
              <v-icon v-show="searchInput != ''" small class="" @click="searchInput = ''">cancel</v-icon>
            </v-input>
            <v-spacer ></v-spacer>
          </v-toolbar>
          <v-list   dense two-line>
            <v-list-group   v-for="(item, index) in searchResult"  v-model="item.active">
              <template  >
                <!-- list titles -->
                <v-list-tile  slot="activator" class="pr-0" style="" :key="index" avatar @click="" >
                  <v-list-tile-avatar class="hidden-xs-only" color="blue-grey">
                    <!-- <span  class=" ">{{item.name.charAt(0).toUpperCase()}}</span> -->
                  </v-list-tile-avatar>

                  <v-list-tile-content >
                    <v-list-tile-title  v-text="item.name"></v-list-tile-title>
                    <v-list-tile-sub-title >{{item.info}}</v-list-tile-sub-title>

                  </v-list-tile-content>
                  <v-spacer ></v-spacer>

                  <span v-text="" class="orange--text font-weight-bold pa-2">{{item.type}} <span class="grey--text">{{item.count}}/{{item.groupTotal}}</span></span>   <!-- TODO make dynamic -->

              </div>

          </v-list-tile>

          <v-card  color="">
            <v-divider></v-divider>
            <div class="">
{{item}}
              <v-btn fab small  @click="checkIn(item.ref, item.name, item.type, index)" class="ml-1 green right"> <v-icon>add</v-icon></v-btn>
              <v-btn fab  small @click="checkOut(item.ref, item.name, item.type, index)" class="ml-1 red right"> <v-icon>remove</v-icon></v-btn>
              <v-btn fab small v-if="item.type == 'GROUP'"  @click="" class="ml-1 orange right"> <v-icon>playlist_add_check</v-icon></v-btn>


            </div>
            <div class="mx-3 my-2">
              <span v-text="" class="orange--text font-weight-bold headline">{{item.type}}</span>   <!-- TODO make dynamic -->
              <br>
              <span class="subheader">{{item.info}}</span>
              <br>

              <h3 v-if="item.type == 'GROUP'" class="mt-3">Group size</h3>
              <span v-if="item.type == 'GROUP'">5</span>
              <h3 class="mt-3">Options</h3>
              <v-layout row wrap  align-content-start  class=""  >
                <v-flex   v-for="(option, key) in item.options" :key="key" class="white mr-1 pa-1" :style="option == 0 ? 'opacity: 0.2;' : 'opacity: 1;'" style="text-align:center; min-width:50px!important;height:50px!important; flex:unset;">
                  <span class="font-weight-bold grey--text text--darken-2" v-text="key"></span><br>
                  <v-avatar  class="grey darken-2 " style="position: relative; top:-3px" size="25" icon><span class="white--text font-weight-bold" v-text="option"></span></v-avatar>
                </v-flex>
              </v-layout>

            </div>


          </v-card>
        </template>
      </v-list-group>
    </v-list>

  </v-card>

</v-layout>
</v-slide-y-transition>

<div v-show="items.length < 1" >No guests on this list!</div>
</v-container>
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

export default {
  data() {
    return {
      user: firebase.auth().currentUser,
      searchInput: "",
      listconfig: {},
      items: [],
      searchResult: []
    };
  },
  watch: {
  userInfo: function () {
    // this.refresh()
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
this.searchResult = obj
    },
    checkIn: async function(id, name, type, index) {

    let itemsRef = db.collection("list_items").doc(id)
      let str =  name + '.checkedIn'
      if (type == 'GROUP') {
        if (this.items[index].count >= this.items[index].groupTotal) { return }
        //get and set count
        let val = await itemsRef.get()
        let data = val.data()
// TODO remove ?: if below and set count equal to groupTotal directly when creating group
        let count = data[name].hasOwnProperty('count') ? data[name].count : 0
if (count >= this.items[index].groupTotal) { return }
        let newcount = count + 1

        let check = newcount < data[name].groupTotal ? false : true
        let str2 =  name + '.count'
         itemsRef.update({[str]: check, [str2]: newcount}).then(() => {this.items[index].count++});
      } else {
         itemsRef.update({[str]: true});
      }

     },
    checkOut: async function(id, name, type, index) {
      let itemsRef = db.collection("list_items").doc(id)
        let str =  name + '.checkedIn'
        if (type == 'GROUP') {
          if (this.items[index].count <= 0) { return }
          //get and set count
          let val = await itemsRef.get()
          let data = val.data()
          let count = data[name].hasOwnProperty('count') ? data[name].count : 0
if (count <= 0) { return }
          let newcount = count - 1

          let check = newcount < data[name].groupTotal ? false : true
          let str2 =  name + '.count'
           itemsRef.update({[str]: check, [str2]: newcount}).then(() => {this.items[index].count--});
        } else {
           itemsRef.update({[str]: true});
        }

    },
    refresh: async function() {
      var id = this.$route.params.id;
      let userInfo = this.userInfo;
      console.log(userInfo);
      if (!this.listId) {
        this.listId = id; //list id
      } // !something valid expression?
      console.log("** refreshing:" + id);

      const listRef = db.collection("lists").doc(id);
      const itemsRef = db.collection("list_items");
      //await list config
      let config = await listRef.get();
      let list_config = config.data();
    //bail if not admin or if admin account is not premium
    for (var uid in list_config.shared) {
      if (list_config.shared.hasOwnProperty('mode') && list_config.shared[this.user.uid].mode != 'ACTIVATOR' ) {
      return  this.bail()
      }
      if (userInfo.admin && this.userInfo[id] >= 0 ) {
      return  this.bail()
      }

    }
      console.log("still in else it would bail with alert");
this.items = []
      //get main list item from 'config'
      let mainGet = await itemsRef.doc(list_config.main_item).get()
      let main = mainGet.data()
console.log(main);
// if not empty, loop and push items
    if (Object.keys(main).length > 0) {
      for (var item in main) {
        if (main.hasOwnProperty(item)) {
          main[item].ref = mainGet.id
          this.items.push(main[item])
console.log(this.items['account list']);
        }
      }
    }
      // loop config.shared to get linked items
      for (var uid in list_config.shared) {
        if (list_config.shared.hasOwnProperty(uid)) {
          let itemGet = await itemsRef.doc(list_config.shared[uid].item_id).get()
          let itemDoc = itemGet.data()
          // loop the guests and make obj
          let name = list_config.shared[uid].name || list_config.shared[uid].email
          for (var doc in itemDoc) {
            if (itemDoc.hasOwnProperty(doc)) {
              itemDoc[doc].ref = itemGet.id
          this.items.push(itemDoc[doc])
  }
}
        }
      }
console.log(this.items);
      this.listconfig = list_config;
      this.items.sort()
      this.searchResult = this.items;
    },
    bail: function() {
      alert("You are not allowed to be here");
      this.$router.push("/dashboard");
    }
  },
  mounted: function() {
    this.refresh();
  },
  name: "listActive"
};
</script>
