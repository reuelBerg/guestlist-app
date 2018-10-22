<template>
  <v-container fluid class="mt-0 py-0" style="background: linear-gradient(grey, grey, purple)">
    <v-btn  fixed bottom right fab color="black" style=" bottom: -20px;" :large="$vuetify.breakpoint.smAndUp" @click="refresh" >
      <v-icon :large="$vuetify.breakpoint.smOnly" >autorenew</v-icon>
    </v-btn>
    <listAddAddModal v-if="optionCount"  :listId="itemId" :count="optionCount" :options="listconfig" @refreshList="refresh"></listAddAddModal>
    <!-- =============================================  HEADER INFO ===================================================== -->

    <v-slide-y-transition mode="out-in">
      <v-layout row wrap justify-center>
        <!-- top info part -->

        <v-card d-flex class="pa-3" style="max-width:800px;  width:100%; ">
          <h3 style="">You are invited to add <span v-if="listconfig" class="cyan--text">{{listconfig.shared[user.uid].addLimit}}</span>
            guests to <br class="hidden-sm-and-up"> <span class="cyan--text">{{listconfig.title}}</span> on <span v-text="date" class=" cyan--text"></span></h3>
          </v-card>
          <v-card d-flex class="pa-3" style="max-width:800px; width:100%; ">
            <v-btn class="" @click="showInfo = !showInfo" icon ><v-icon class="grey--text">{{showInfo ? 'visibility_off' : 'visibility' }}</v-icon></v-btn>

            <h4 class="mb-2">You have the following options left to distribute.</h4>


            <div  :style="$vuetify.breakpoint.xsOnly ? 'width:48%;' : 'width:19.9%;'" style="float:left; border: 1px solid lightblue; border-radius: 4px; margin-right:5px; margin-bottom:2px;"
              v-if="listconfig && showInfo" v-for="(item, key) in listconfig.shared[user.uid].options" class="pa-1 blue-grey darken-4 elevation-3"
              >
              <span style="float:left;" class="font-weight-bold">{{key.toUpperCase()}}</span>
              <span style="float:right;" class="">{{!optionCount[key] ? 0 : optionCount[key]}}/{{item}}</span>
              <v-progress-linear color="cyan darken-2" class="ma-0" style="width:100%;" :value="100 / item * optionCount[key]"></v-progress-linear>

            </div>

          </v-card>

          <!-- =============================================  TOOLBAR LIST ===================================================== -->
          <!-- toolbar -->
          <v-card d-block style="max-width:800px; width:100%">
            <v-toolbar  flat color="grey darken-3" dark >
              <v-spacer></v-spacer>
              <!-- search -->
              <v-input color="" style="max-width: 240px; height:32px;  border-radius:3px; background: #353535;" >
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
                      <v-list-tile-title class="font-weight-bold" v-text="item.name"></v-list-tile-title>
                      <!-- TODO: make subtitle that shows who added this -->
                      <v-list-tile-sub-title >

                        <span v-text="" class="grey--text font-weight-bold ">{{item.type}}</span>   <!-- TODO make dynamic -->
                        <span v-if="item.type == 'GROUP'" size="25" class="grey--text ml-1">{{item.groupTotal}}</span></span>
                      </v-list-tile-sub-title>

                    </v-list-tile-content>



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
                      <v-flex  v-for="(option, key) in item.options"  v-if="option > 0" :key="key" class="white mr-1 pa-1" :style="option == 0 ? 'opacity: 0.2;' : 'opacity: 1;'" style="text-align:center; min-width:50px!important;height:50px!important; flex:unset;">
                        <span class="font-weight-bold grey--text text--darken-2" v-text="key"></span><br>
                        <v-avatar class="grey darken-2 " style="position: relative; top:-3px" size="25" icon><span class="white--text font-weight-bold" v-text="option"></span></v-avatar>
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
      showInfo: true,
      optionCount: {},
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
      // this.refresh()
    },
    items: function () {
      let obj = {}
      for (let opt of this.listconfig.options)  {
        let count = 0;
        for (var i = 0; i < this.items.length; i++) {
let val = this.items[i].options[opt] != undefined ? this.items[i].options[opt] : 0
console.log(val);
          if (val != undefined) {
            count = count + parseInt(val)
          }
          obj[opt] = count
        }
      }
      console.log('optionCount', obj);
      return  this.optionCount = obj
    },
  },
  computed: {
    userInfo() {
      return store.state.user
    },

    date() {
      let d = this.listconfig.date
      let s = d.split('/') //dd/mm/yyyy

      return  s[0] + ' ' + this.month[s[1]] + ', '  + s[2]
    },


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
      let list = this.$route.params.id;
      db.collection('lists').doc(list).collection("list_items").doc(id).update({[name]: firebase.firestore.FieldValue.delete()});
      this.refresh();
    },
    refresh: async function() {
      var id = this.$route.params.id; //list parent id
      if (!this.listId) {
        this.listId = id;
      }
      console.log("** refreshing:" + id);
      const listRef = db.collection("lists").doc(id);
      const itemsRef = listRef.collection("list_items");
      //await list config
      let config = await listRef.get();
      let list_config = config.data();
      this.listconfig = list_config;

      let userInfo = this.userInfo;


      console.log("still in yeah");
      this.items = []
      let itemGet = await itemsRef.doc(this.user.uid).get()
      if (itemGet == undefined) {
        return this.bail()
      }
      let itemDoc = itemGet.data()
      for (var doc in itemDoc) {
        if (itemDoc.hasOwnProperty(doc)) {
          itemDoc[doc].ref = itemGet.id

          this.items.push(itemDoc[doc])
        }
      }


      console.log(this.items);
      this.searchResult = this.items;

    },
    bail: function() {
      alert("Security! You are not allowed to be here my friend.");
      this.$router.replace("/dashboard");
    }
  },
  mounted: function() {
    this.refresh();
  },
  name: "listAdd"
};
</script>
