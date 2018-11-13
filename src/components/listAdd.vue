<template>
  <v-container fluid class="mt-0 py-0" >
    <v-btn  fixed bottom right fab class="barcolor darken-4 white--text" style=" bottom: 20px;" :large="$vuetify.breakpoint.smAndUp" @click="refresh" >
      <v-icon :large="$vuetify.breakpoint.smAndUp" >autorenew</v-icon>
    </v-btn>
    <listModalAdd   :listId="itemId" :count="optionCount" :options="listconfig" @refreshList="refresh"></listModalAdd>
    <!-- =============================================  HEADER INFO ===================================================== -->

    <v-slide-y-transition mode="out-in">
      <v-layout row wrap justify-center>
        <!-- top info part -->

        <v-card d-flex class="px-3 py-2" style="max-width:800px;  width:100%; text-align:center;">

          <h3  class="grey--text text--darken-2 subheading">You are invited to add <span v-if="listconfig" class="primary--text">{{listconfig.shared[user.uid].addLimit}}</span>
            guests to <br class="hidden-sm-and-up"> <span class="primary--text">{{listconfig.title}}</span> on <span v-text="date" class=" primary--text"></span></h3>

</v-card>
          <v-card   d-flex class="px-3 py-1" style="max-width:800px; width:100%; text-align:center;">
            <v-btn  absolute top right  @click="showInfo = !showInfo" icon ><v-icon class="grey--text">{{showInfo ? 'visibility_off' : 'info' }} </v-icon></v-btn>

            <h4  v-if="listconfig.shared[user.uid].options.hasOwnProperty() && showInfo" class="mb-2 grey--text font-weight-medium caption text--darken-1">You have the following options left to distribute.</h4>


            <div v-if="listconfig && showInfo" :style="$vuetify.breakpoint.xsOnly ? 'width:48%;' : 'width:19.9%;'" style="float:left; border: 1px solid lightblue; border-radius: 4px; margin-right:5px; margin-bottom:2px;"
               v-for="(item, key) in listconfig.shared[user.uid].options" :key="key" class="pa-1 barcolor darken-2 elevation-3"
              >
              <span style="float:left;" class="font-weight-bold white--text">{{key.toUpperCase()}}</span>
              <span style="float:right;" class="white--text">{{!optionCount[key] ? 0 : optionCount[key]}}/{{item}}</span>
              <v-progress-linear color="primary " class="ma-0" style="width:100%;" :value="optionCount[key] > 0 ? 100 / item * optionCount[key] : 0"></v-progress-linear>

            </div>

          </v-card>

          <!-- =============================================  TOOLBAR LIST ===================================================== -->
          <!-- toolbar -->
          <v-card d-block style="max-width:800px; width:100%" class="mt-2">

            <v-toolbar  flat color="barcolor darken-2" dark >
              <v-input class="barcolor darken-3 title" style="height:32px;  border-radius:3px; background: #353535;" >
                <input @keyup="search" class=" white--text pa-2 " style=" width:90%" type="text" placeholder="Search..." v-model="searchInput">
                <v-icon v-show="searchInput != ''" small class="pr-2" @click="searchInput = ''">cancel</v-icon>
              </v-input>
              <v-spacer ></v-spacer>
              <v-avatar size="30"  class="barcolor darken-3  subheading "><span v-text="items.length"></span></v-avatar>
            </v-toolbar>
            <div v-show="items.length < 1" class="font-italic grey--text pa-3" style='text-align:center;'>Time to add some guests!</div>
            <!-- list start -->
            <transition-group group name="list" tag="v-list" light class="barcolor lighten-5"  dense two-line>
<!-- TODO there item.key sa;me as fieldKey? -->
              <v-list-group   v-for="(item, index) in searchResult" :key="item.key"  v-model="item.active">
                  <!-- list titles -->
                  <v-list-tile slot="activator" :key="item.key"  avatar @click="" >
                    <v-list-tile-avatar class="hidden-xs-only" color="barcolor">
                      <span v-text="item.name.charAt(0).toUpperCase()" class="white--text subheading "></span>
                    </v-list-tile-avatar>

                    <v-list-tile-content >
                      <v-list-tile-title class="" v-text="item.name"></v-list-tile-title>
                      <v-list-tile-sub-title v-text="item.info">
                      </v-list-tile-sub-title>

                    </v-list-tile-content>
                    <v-spacer ></v-spacer>

  <v-layout column wrap align-center class="ma-0 pa-0" style="text-align:end; ">
  <span v-text="" class="orange--text font-weight-bold py-0">{{item.type}}</span>
  <span v-if="item.type == 'GROUP'" class="grey--text"><span v-text="item.count"></span>/{{item.groupTotal}}</span>   <!-- TODO make dynamic -->
  </v-layout>


                </v-list-tile>
                <v-card  color="">
                  <v-divider></v-divider>
                  <div class="">
                    <v-btn  fab small  @click="removeDialogItemId = [item.ref, item.fieldKey]; removeDialog = true;" class="ml-1 grey lighten-1 grey--text text--darken-2 right"> <v-icon large style="font-size:27px;">delete</v-icon></v-btn>
                    <!-- <v-btn fab small class="ml-1 primary right"> <v-icon>edit</v-icon></v-btn> -->

                  </div>
                  <div class="mx-3  py-4 my-2">
                    <div class="pl-2" style=" border-left: 6px solid teal">
                      <span v-text="" class="primary--text text--darken-1 font-weight-bold headline">{{item.type}}</span>   <!-- TODO make dynamic -->
                      <br v-if="item.type">
                      <span v-if="item.name" class=" primary--text text--darken-3 subheading font-weight-medium">{{item.name.toUpperCase()}}</span>
                      <br v-if="item.info">
                      <span v-if="item.info"  class=" primary--text text--darken-2 subheading font-italic">{{item.info}}</span>
                    </div>

                    <div class="mt-1 pl-2" style=" border-left: 6px solid pink!important; width:100%" >
                      <h4 v-show="Object.keys(item.options).length" class="subheading pink--text text--darken-4 font-weight-medium pl-0 mt-2" >Hand Outs</h4>
                      <v-layout row wrap  align-content-start  class=""  >
                        <v-flex v-if="option > 0"  v-for="(option, key) in item.options" :key="key" class=" pink darken-4 elevation-1 mt-1 mr-1 pa-2" :style="option == 0 ? 'opacity: 0.2;' : 'opacity: 1;'" style="text-align:center; min-width:65px!important;height:65px!important;   border-radius:3px; flex:unset;">
                          <span class="font-weight-bold white--text text--darken-4" v-text="key.toUpperCase()"></span><br>
      <!-- <span class="pink--text font-weight-bold headline" v-text="option"></span> -->
                          <v-avatar class="pink darken-2  headline" style="position: relative; top:-1px" size="34" icon><span class="white--text font-weight-bold" v-text="option"></span></v-avatar>
                        </v-flex>
                      </v-layout>
                    </div>

                  </div>

                </v-card>
            </v-list-group>
          </transition-group>

        </v-card>

      </v-layout>
    </v-slide-y-transition>
    <v-dialog v-model="removeDialog" persistent max-width="320">
      <v-card dark class="barcolor pa-4">
        <v-card-title class="headline font-weight-bold">Delete guest?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="white " flat @click.native="removeDialog = false">cancel</v-btn>
          <v-btn outline color="white" flat @click.native="removeDialog = false;  removeFromList(removeDialogItemId[0], removeDialogItemId[1])">delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import listModalAdd from "./listModalAdd.vue";

export default {
  components: { inputNumber, listModalAdd },
  data() {
    return {
      user: firebase.auth().currentUser,
      showInfo: true,
      removeDialog: false,
      removeDialogItemId: [],
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
      this.refresh()
    },
    items: function () {
      let obj = {}
      for (let opt of this.listconfig.options)  {
        let count = 0;
        for (var i = 0; i < this.items.length; i++) {
let val = this.items[i].options[opt] != undefined ? this.items[i].options[opt] : 0
          if (val != undefined) {
            count = count + parseInt(val)
          }
          obj[opt] = count
        }
      }
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
    removeFromList: function(id, fieldKey) {
      let list = this.$route.params.id;
      db.collection('lists').doc(list).collection("list_items").doc(id).update({[fieldKey]: firebase.firestore.FieldValue.delete()});
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
      let itemGet = await itemsRef.doc(window.btoa(this.user.email)).get()
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
