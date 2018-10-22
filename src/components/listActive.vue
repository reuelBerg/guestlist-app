<template>

  <v-container fluid class="mt-0 py-0" >
    <v-btn  absolute bottom right fab color="black" style=" bottom: -20px;" :large="$vuetify.breakpoint.smAndUp" @click="refresh" >
      <v-icon :large="$vuetify.breakpoint.smOnly" >autorenew</v-icon>
    </v-btn>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap justify-center>

        <v-card d-block class="mt-3" style="max-width:800px; width:100%">
          <!-- =============================================  TOOLBAR LIST ===================================================== -->

          <v-toolbar  flat color="blue-grey darken-2" dark >
            <v-spacer></v-spacer>
            <v-input class="blue-grey " style="max-width: 210px; height:32px;  border-radius:3px; background: #353535;" >
              <input @keyup="search" class=" white--text pa-2 " style=" " type="text" placeholder="Search names" v-model="searchInput">
              <v-icon v-show="searchInput != ''" small class="" @click="searchInput = ''">cancel</v-icon>
            </v-input>
            <v-spacer ></v-spacer>
          </v-toolbar>
          <!-- =============================================  LIST checkin===================================================== -->

          <v-list   dense >
            <v-list-group  v-if="!item.checkedIn"  v-for="(item, index) in searchResult"  >
              <template  >
                <!-- list titles -->
                <v-list-tile  slot="activator" class="pa-0" style="" :key="index" avatar @click="" >
                  <v-list-tile-avatar class="hidden-xs-only" color="blue-grey">
                    <!-- <span  class=" ">{{item.name.charAt(0).toUpperCase()}}</span> -->
                  </v-list-tile-avatar>
                  <v-list-tile-content >
                    <v-list-tile-title  v-text="item.name"></v-list-tile-title>
                    <v-list-tile-sub-title >{{item.info}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-spacer ></v-spacer>

<v-layout column wrap align-center class="ma-0 pa-0" style="text-align:end; ">
<span v-text="" class="orange--text font-weight-bold py-0">{{item.type}}</span>
<span v-if="item.type == 'GROUP'" class="grey--text"><span v-text="item.count"></span>/{{item.groupTotal}}</span>   <!-- TODO make dynamic -->
</v-layout>
              </div>
          </v-list-tile>
          <!-- =============================================   DRAWER ===================================================== -->

          <v-card  xs12 sm12 md12 >
            <v-divider></v-divider>
            <div class="">

              <v-btn v-if="!item.checkedIn " v-show="item.count <= item.groupTotal"  small  @click.stop.prevent="checkIn(item.ref, item.name, item.type, index)" class="ml-1 cyan right">check in</v-btn>
              <v-btn v-if="item.checkedIn" v-show="item.count >= 0"  small @click.stop.prevent="checkOut(item.ref, item.name, item.type, index)" class="ml-1 red right">check out</v-btn>

            </div>
            <div class="mx-3 my-2">
              <span v-text="item.type" class="orange--text font-weight-bold headline"></span>   <!-- TODO make dynamic -->
              <br>
              <span v-if="item.info" class="subheader">{{item.info}}</span>
              <br>

              <h3 v-if="item.type == 'GROUP'" class="mt-3">Group size</h3>
              <span v-if="item.type == 'GROUP'">{{item.groupTotal}}</span>
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
    <v-card d-block class="mt-3" style="max-width:800px; width:100%">
      <!-- =============================================  TOOLBAR LIST ===================================================== -->

      <v-toolbar  flat color="red darken-2" dark >
        <v-toolbar-title>CHECKED IN</v-toolbar-title>
        <v-spacer ></v-spacer>
      </v-toolbar>
    <!-- =============================================  LIST CHECKOUT ===================================================== -->

    <v-list   class="mt-4" dense >
      <v-list-group  v-if="item.checkedIn" v-for="(item, index) in searchResult"  >
        <template  >
          <!-- list titles -->
          <v-list-tile   slot="activator" class="pa-0" style="" :key="index" avatar @click="" >
            <v-list-tile-avatar class="hidden-xs-only" color="blue-grey">
              <!-- <span  class=" ">{{item.name.charAt(0).toUpperCase()}}</span> -->
            </v-list-tile-avatar>
            <v-list-tile-content >
              <v-list-tile-title  v-text="item.name"></v-list-tile-title>
              <v-list-tile-sub-title >{{item.info}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-spacer ></v-spacer>

  <v-layout column no-wrap align-center class="ma-0 pa-0" style="text-align:end; ">
  <span v-text="" class="orange--text font-weight-bold py-0">{{item.type}}</span>
  <span v-if="item.type == 'GROUP'" class="grey--text"><span v-text="item.count"></span>/{{item.groupTotal}}</span>   <!-- TODO make dynamic -->
  </v-layout>
        </div>
    </v-list-tile>
    <!-- =============================================   DRAWER ===================================================== -->

    <v-card  color="">
      <v-divider></v-divider>
      <div class="">

        <v-btn v-if="!item.checkedIn " v-show="item.count <= item.groupTotal"  small  @click.stop.prevent="checkIn(item.ref, item.name, item.type, index)" class="ml-1 cyan right">check in</v-btn>
        <v-btn v-if="item.checkedIn" v-show="item.count >= 0"  small @click.stop.prevent="checkOut(item.ref, item.name, item.type, index)" class="ml-1 red right">check out</v-btn>

      </div>
      <div class="mx-3 my-2">
        <span v-text="item.type" class="orange--text font-weight-bold headline"></span>   <!-- TODO make dynamic -->
        <br>
        <span v-if="item.info" class="subheader">{{item.info}}</span>
        <br>

        <h3 v-if="item.type == 'GROUP'" class="mt-3">Group size</h3>
        <span v-if="item.type == 'GROUP'">{{item.groupTotal}}</span>
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
<!-- =============================================  NO GUESTS MESSAGE ===================================================== -->

<div v-show="items.length < 1" >No guests on this list!</div>
<!-- =============================================  CHECK IN ===================================================== -->

<v-dialog v-model="dialogIn" width="500" persistent >
     <v-card class="pa-3">
 <v-btn icon style="position:absolute; top: 5px; right: 5px; display:inline-block" flat @click="dialogIn = false; countInput = 0; error = '';" ><v-icon>close</v-icon> </v-btn>
<br><br>
       <v-layout row nowrap justify-center align-center class="">
         <v-text-field xs5 style="max-width:50px" step="0.5" maxlength="2" oninput="validity.valid||(value='')"
         type="text" pattern="[0-9]*" class="nr dark transparent pa-1 title"
         v-model="countInput">
       </v-text-field>
       <div xs12 class="pb-2" style="float:left">

           <v-btn small icon style="margin: 1px"  color="dialogType == 'in ? grey darken-2 : red darken-1" @click="countInput--; limit('in')"><v-icon>chevron_left</v-icon></v-btn>
           <v-btn small icon style="margin: 1px" color="grey darken-2" @click="countInput++; limit('in');"><v-icon>chevron_right</v-icon></v-btn>
           <!-- <v-btn small icon style="margin: 1px" color="cyan darken-2" @click="countInput = 0"><v-icon>clear</v-icon></v-btn> -->
           <v-btn small round style="margin: 1px; font-size: 1.1em" color="grey darken-2" @click="getMax(...groupIndex, 'in')">all</v-btn>

       </div>
</v-layout>
       <v-divider></v-divider>
       <v-card-actions>
         <v-spacer></v-spacer>
          <v-btn color="cyan" flat @click.stop.prevent="checkIn(...groupIndex); " > check in </v-btn>
          <span class="red--text" v-text="errorIn"></span>
       </v-card-actions>
     </v-card>
   </v-dialog>
<!-- =============================================  CHECK OUT ===================================================== -->
   <v-dialog v-model="dialogOut" width="500" persistent >
        <v-card class="pa-3">
    <v-btn icon style="position:absolute; top: 5px; right: 5px; display:inline-block" flat @click="dialogOut = false; countInput = 0; error = '';" ><v-icon>close</v-icon> </v-btn>
   <br><br>
          <v-layout row nowrap justify-center align-center class="">
            <v-text-field  xs5 style="max-width:50px" step="0.5" maxlength="2" oninput="validity.valid||(value='')"
            type="text" pattern="[0-9]*" class="nr dark transparent pa-1 title"
            v-model="countInput">
          </v-text-field>
          <div xs12 class="pb-2" style="float:left">

              <v-btn small icon style="margin: 1px"  color="dialogType == 'in ? grey darken-2 : red darken-1" @click=" countInput--; limit('out');"><v-icon>chevron_left</v-icon></v-btn>
              <v-btn small icon style="margin: 1px" color="grey darken-2" @click=" countInput++; limit('out');"><v-icon>chevron_right</v-icon></v-btn>
              <!-- <v-btn small icon style="margin: 1px" color="cyan darken-2" @click="countInput = 0"><v-icon>clear</v-icon></v-btn> -->
              <v-btn small round style="margin: 1px; font-size: 1.1em" color="grey darken-2" @click="getMax(...groupIndex, 'out')">all</v-btn>

          </div>
   </v-layout>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
          <v-btn color="red"  flat @click.stop.prevent="checkOut(...groupIndex); " >check out</v-btn>
             <span class="red--text" v-text="errorOut"></span>
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
import store from "../store";

export default {
  data() {
    return {
      listId: this.$route.params.id,
      user: firebase.auth().currentUser,
      searchInput: "",
      dialogIn: false,
      dialogOut: false,
      errorIn: '',
      errorOut: '',
      countInput: 0,
      groupIndex: [], // [id, name, type, index]
      listconfig: {},
      items: {},
      itemsArray: [],
      searchResult: []
    };
  },
  watch: {
    items: function() {
      var se = [];
console.log('watching');
      for (var seg in this.items) {
        if (this.items.hasOwnProperty(seg)) {
          // console.log("watching!", seg);
          //loop items segment
          for (var i = 0; i < this.items[seg].length; i++) {
            // console.log('seg =>', this.items[seg][i]);
            se.push(this.items[seg][i]);
          }
        }
      }
      se.sort()
    this.itemsArray = se
      return this.searchResult = se;
   }
  },
  computed: {
    userInfo() {
      return store.state.user;
    },

    },
  methods: {

    limit: function(toggle) {
console.log('hi');
let val = this.countInput
let count = this.searchResult[this.groupIndex[3]].count
let total;
    if (toggle == 'in') { total = this.searchResult[this.groupIndex[3]].groupTotal - count}
if (toggle == 'out') { total = count }

if (val <= 0) {
      this.countInput = 0
      }
      if (val > total) {
      this.countInput = total
      }
},
    search: function() {
      let s = this.searchInput.toLowerCase().trim();
if (s == '') { return this.searchResult = this.itemsArray }
      let arr = [];

          let results = this.searchResult.filter(function(val) {
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
          arr = results;

      this.searchResult = arr;
    },
getMax: async function (id, name, type, index, dialog) {

  let itemsRef = db .collection("lists") .doc(this.listId).collection("list_items") .doc(id);
  let str = name + ".checkedIn";
  let val = await itemsRef.get();
  let data = val.data();
  let count = data[name].count
if (dialog == 'in') { this.countInput = data[name].groupTotal - count; return  }
else {  this.countInput = count; return count}



},
    checkIn: async function(id, name, type, index) {
      for (let item in this.items) {
      console.log(this.items[item], index, item);
      if (this.items.hasOwnProperty(item)) {
        delete  this.items[item] //.splice(index,1)
      }

      }      // console.log(this.listId);
      let itemsRef = db .collection("lists") .doc(this.listId).collection("list_items") .doc(id);
      let str = name + ".checkedIn";
      if (type == "GROUP") {
        if (this.dialogIn == false) {
          this.groupIndex = [id, name, type, index]
          return (this.dialogIn = true);
        }
        if (
          this.searchResult[index].count >= this.searchResult[index].groupTotal
        ) {
          return this.errorIn = 'no guests left...'
        }
        //get and set count
        let val = await itemsRef.get();
        let data = val.data();
        let count = data[name].count
        if (count >= this.searchResult[index].groupTotal) {
          return this.errorInOut = 'no guests left...'
        }
        let newcount = count + this.countInput;

        let check = newcount < data[name].groupTotal ? false : true
        if (newcount > data[name].groupTotal) {
          this.error = 'only ' + data[name].groupTotal - count + ' left'
          return this.countInput = data[name].groupTotal - count

        }
console.log(newcount);
        let str2 = name + ".count";
        itemsRef.update({ [str]: check, [str2]: newcount }).then(() => {
          // this.searchResult[index].count++;
          console.log('group');

        });
      } else {
console.log('single update');
        itemsRef.update({ [str]: true });
      }
this.dialogIn = false
this.errorIn = ''
    },
    checkOut: async function(id, name, type, index) {
      //receives number of checkins
for (let item in this.items) {
console.log(this.items[item], index, item);
if (this.items.hasOwnProperty(item)) {
  delete  this.items[item] //.splice(index,1)
}

}
      let itemsRef = db .collection("lists") .doc(this.listId).collection("list_items") .doc(id);
      let str = name + ".checkedIn";
      if (type == "GROUP") {

        if (this.dialogOut == false) {
          this.groupIndex = [id, name, type, index]
          return (this.dialogOut = true);
        }
        if ( this.searchResult[index].count > this.searchResult[index].groupTotal ) {
          return console.log('err count is higher than total');;
        }
        //get and set count
        let val = await itemsRef.get();
        let data = val.data();
        let count = data[name].count
        if (count > this.searchResult[index].groupTotal) {
          return ;
        }
//decrement
        let newcount = count - this.countInput;
//set checkedIn to true or false
        let check = newcount < data[name].groupTotal ? false : true
// set bottom value of 0
        if (newcount < 0) { newcount = 0 }
        let str2 = name + ".count";

        itemsRef.update({ [str]: check, [str2]: newcount }).then(() => {
          // this.searchResult[index].count++;
          console.log('group');

        });
      } else {

console.log('single update');
        itemsRef.update({ [str]: false });
      }

this.dialogOut = false
},
    refresh: async function() {
      var id = this.$route.params.id;
      let userInfo = this.userInfo;
      // console.log(userInfo);
      if (!this.listId) {
        this.listId = id; //list id
      } // !something valid expression?
      console.log("** refreshing:" + id);

      const listRef = db.collection("lists").doc(id);
      const itemsRef = listRef.collection("list_items");
      //await list config
      let config = await listRef.get();
      let list_config = config.data();
      //bail if not admin or if admin account is not premium
      for (var uid in list_config.shared) {
        if (
          list_config.shared.hasOwnProperty("mode") &&
          list_config.shared[this.user.uid].mode != "ACTIVATOR"
        ) {
          return this.bail();
        }
        if (userInfo.admin && userInfo[id] >= 0) {
          return this.bail();
        }
      }
      // console.log("still in else it would bail with alert");
      this.items = {};
      let d = this;
      let usr = firebase.auth().currentUser;
      let itemGet = await itemsRef.get();
      for (let items of itemGet.docs) {
        //loop each list_item doc
        await itemsRef.doc(items.id).onSnapshot(function(snap) {
          console.log('oh snap!', snap.data());
          let itemDoc = snap.data();
          // loop the guests and make obj
          let name = items.id;

          let itemArr = [];

          for (var doc in itemDoc) {
            // console.log(doc);
            if (itemDoc.hasOwnProperty(doc)) {
              itemDoc[doc].ref = snap.id;
              itemArr.push(itemDoc[doc]);
              d.$set(d.items, name, itemArr);
            }
          }
          console.log("partial list", itemArr);

          delete d.items["undefined"];
        });
      }
      this.listconfig = list_config;

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
