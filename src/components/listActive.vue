<template>

  <v-container fluid class="mt-0 py-0 pa-0" >
    <v-btn fixed absolute bottom right fab color="barcolor " style=" bottom: 20px;" :large="$vuetify.breakpoint.smAndUp" @click="refresh" >
      <v-icon :large="$vuetify.breakpoint.smOnly" >autorenew</v-icon>
    </v-btn>

<!-- <v-card color="#00000095" class=" ma-2 pa-1" style="width: 150px; height:150px; position:fixed; bottom: 50px; margin: auto;; z-index:999;">
<div class=" grey--text" style="width: 100%; height: 100px; text-align:center;">
<h1>TAP <br> TO <br> ADD</h1>
</div>
<v-card-actions color="#00000080" class="" style="width: 100%; height: 50px;">
<v-spacer></v-spacer>
<v-btn block flat x-large class="">
  <v-icon large class="green--text">check</v-icon>
</v-btn >
<v-spacer></v-spacer>
</v-card-actions>
</v-card> -->

      <v-layout row wrap justify-center>
        <div :style="ios ? 'height:76px; padding-top:20px;' : $vuetify.breakpoint.xsOnly ? 'height:56px; width:100%;' : '' "></div>

  <!-- <v-expansion-panel focusable class="" v-model="indexIn">
           <v-expansion-panel-content hide-actions
            v-if="!item.checkedIn"  v-for="(item, index) in searchIn"  :key="item.fieldKey"
           >
             <div slot="header" style="height:21px" >
              <span style="float:left ;">{{item.name}}</span>


<div class="" style="float:right;">
  <span v-text=""  class="orange--text font-weight-bold py-0">{{item.type}}</span>
  <span v-if="item.type == 'GROUP'"  class="grey--text"><span v-text="item.count"></span>/{{item.groupTotal}}</span>
</div>
              </div>

             <v-card class="grey lighten-3 pl-4 pa-0 ma-0" style="">
      <v-layout row no-wrap>
<v-flex class="">

                 <v-flex xs12 sm6 md6 xl6 class="" style=" ">

                   <span v-if="item.info"  class=" grey--text text--darken-2 ">{{item.info}}</span>
                 </v-flex>



                 <v-flex xs12 sm6 md6 class="  " style="  width:100%" >
                   <span v-if="item.clearOptions" class="grey--text ">Given</span>
                   <v-layout v-if="!item.clearOptions" row wrap  align-content-start  class=""  >
                     <v-flex v-if="option > 0"  v-for="(option, key) in item.options" :key="key" class=" mb-1 mr-2 pr-2" :style="option == 0 ? 'opacity: 0.2;' : 'opacity: 1;'" style="text-align:center; flex:unset; border-right: 1px solid lightgrey">
                       <span class="font-weight-bold pink--text pink--darken-4" v-text="key.toUpperCase() "></span><span class="font-weight-bold"> {{option}}</span>
                     <span class="font-weight-bold pink--text pink--darken-4" v-text="key.toUpperCase() "></span><span>{{option}}</span>
                       <v-avatar class="pink darken-2  " style="position: relative; top:-1px" size="34" icon><span class="white--text font-weight-bold" v-text="option"></span></v-avatar>
                     </v-flex>
                   </v-layout>
                 </v-flex>



               </v-flex>

      </v-layout>
             </v-card>
           </v-expansion-panel-content>
         </v-expansion-panel> -->


  <v-card d-block class="mt-3 transparent" style="max-width:800px; width:100%; margin-top: 50px;">
          <!-- =============================================  TOOLBAR LIST 1 ===================================================== -->
<v-toolbar class="barcolor white--text" style="opacity:0.8 ">
<v-toolbar-title>{{listconfig.title}}</v-toolbar-title>
</v-toolbar>
<v-toolbar :fixed="$vuetify.breakpoint.xsOnly"  dense flat color="barcolor darken-1" dark  :style="ios ? 'top:76px; ' : $vuetify.breakpoint.xsOnly ? 'top:56px' : '' " style="width:100%; opacity:0.9">
            <v-input class="barcolor darken-3 title" style="height:32px;  border-radius:3px; background: #353535;" >
              <input @keyup="search" class=" white--text pa-2 " style=" width:100%" type="text" placeholder="Search..." v-model="searchInput">
              <v-icon v-show="searchInput != ''" small class="pr-2" @click="searchInput = ''">cancel</v-icon>
            </v-input>
            <v-spacer ></v-spacer>
            <v-avatar v-if="totalCount" size="30" class="barcolor darken-3 subheading "><span v-text="totalCount"></span></v-avatar>
          </v-toolbar>
          <!-- =============================================  test expansion panel ===================================================== -->

           <!-- =============================================  LIST 1 checkin===================================================== -->






          <v-card v-show="Object.keys(items).length == 0 && searchResult.length == 0" class="pa-2 py-3 subheading font-italic" style="text-align:center; ">
            <span>This list is empty</span>
          </v-card>
          <transition-group name="list" group tag="v-list" class="barcolor lighten-5"  dense >
            <v-list-group  v-if="!item.checkedIn"  v-for="(item, index) in searchIn"  :key="item.fieldKey">
                <!-- list titles -->
                <v-list-tile  slot="activator" class="pa-0" style="" :key="index" avatar @click="" >
                  <v-list-tile-avatar class="hidden-xs-only" color="barcolor">
                    <span  class="white--text ">{{item.name.charAt(0).toUpperCase()}}</span>
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
              <!-- ============================================= LIST 1 DRAWER ===================================================== -->

              <v-card  xs12 sm12 md12 >
                <v-divider></v-divider>
                <div class="">

                  <v-btn dark v-if="!item.checkedIn || item.count <= item.groupTotal "  small  @click.stop.prevent="checkIn(item.ref, item.name, item.type, index, item.fieldKey)" class="ml-1 lime right">check in</v-btn>
                  <v-btn dark v-show="item.count > 0 && item.type === 'GROUP'"  small @click.stop.prevent="checkOut(item.ref, item.name, item.type, index, item.fieldKey)" class="ml-1 red darken-2 right">check out</v-btn>

                </div>
                <div class="mx-3 mt-3 py-4 my-2">
                  <div class="pl-2" style=" border-left: 6px solid teal">
                    <span v-if="item.type" v-text="" class="primary--text text--darken-1 font-weight-bold headline">{{item.type}}</span>
                    <br v-if="item.type">
                    <span v-if="item.name" class=" primary--text text--darken-3 subheading font-weight-medium">{{item.name.toUpperCase()}}</span>
                    <br v-if="item.info">
                    <span v-if="item.info"  class=" grey--text text--darken-2 subheading font-italic">{{item.info}}</span>
                  </div>

                  <div class="mt-1 pl-2" style=" border-left: 6px solid pink!important; width:100%" >
                    <h4 v-show="Object.keys(item.options).length" class="subheading pink--text text--darken-4 font-weight-medium pl-0 mt-2" >Hand Outs</h4>
                    <span v-if="item.clearOptions" class="grey--text ">Given</span>
                    <v-layout v-if="!item.clearOptions" row wrap  align-content-start  class=""  >
                      <v-flex v-if="option > 0"  v-for="(option, key) in item.options" :key="key" class=" pink darken-4 elevation-1 mt-1 mr-1 pa-2" :style="option == 0 ? 'opacity: 0.2;' : 'opacity: 1;'" style="text-align:center; min-width:65px!important;height:65px!important;   border-radius:3px; flex:unset;">
                        <span class="font-weight-bold white--text text--darken-4" v-text="key.toUpperCase()"></span><br>
                        <v-avatar class="pink darken-2  headline" style="position: relative; top:-1px" size="34" icon><span class="white--text font-weight-bold" v-text="option"></span></v-avatar>
                      </v-flex>
                    </v-layout>
                  </div>

                  <div class="mt-1 pl-2" style=" border-left: 6px solid orange">

                    <h4 class="orange--text text--darken-2 pa-0 mt-2 subheading font-weight-medium" >ADDED BY</h4>
                    <span class="pt-0 grey--text" v-text="item.addByName"></span>
                  </div>
                </div>
              </v-card>
          </v-list-group>
        </transition-group>
      </v-card>
      <v-card d-block class="mt-3" style="max-width:800px; width:100%">
        <!-- =============================================  LIST 2 TOOLBAR ===================================================== -->

        <v-toolbar @click="showCheckedIn = !showCheckedIn" dense flat color=" orange" dark >
          <v-toolbar-title class="subheading">CHECKED IN</v-toolbar-title>
          <v-spacer ></v-spacer>
          <v-btn icon ><v-icon v-text="showCheckedIn ? 'visibility' : 'visibility_off'"></v-icon></v-btn>

        </v-toolbar>
        <!-- =============================================  LIST 2 CHECKOUT ===================================================== -->

        <transition-group name="list" tag="v-list" v-show="showCheckedIn" class="" dense >
          <v-list-group  v-if="item.checkedIn" v-for="(item, index) in searchOut" :key="item.fieldKey"  >
              <!-- list titles -->
              <v-list-tile  slot="activator" class="pa-0" style="" avatar @click="" >
                <v-list-tile-avatar class="hidden-xs-only" color="barcolor">
                  <span  class="white--text ">{{item.name.charAt(0).toUpperCase()}}</span>
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
            <!-- =============================================   DRAWER 2 ===================================================== -->

            <v-card  class="py-3" color="">
              <div class="">

                <v-btn dark v-if="item.checkedIn" v-show="item.count >= 0"  small @click.stop.prevent="checkOut(item.ref, item.name, item.type, index, item.fieldKey)" class="ml-1 red darken-2 right">check out</v-btn>

              </div>
              <div class="mx-3 py-4 my-2">
                <div class="pl-2" style=" border-left: 6px solid teal">
                  <span v-if="item.type" v-text="" class="primary--text text--darken-1 font-weight-bold headline">{{item.type}}</span>
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
                <div class="mt-1 pl-2" style=" border-left: 6px solid orange">

                  <h4 class="orange--text text--darken-2 pa-0 mt-2 subheading font-weight-medium" >ADDED BY</h4>
                  <span class="pt-0 grey--text" v-text="item.addByName"></span>
                </div>
              </div>
            </v-card>
        </v-list-group>
      </transition-group>

    </v-card>

  </v-layout>
<!-- =============================================  NO GUESTS MESSAGE ===================================================== -->

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
    <div xs12 class="pb-2" style="float:left; ">

      <v-btn dark small icon style="margin: 1px"  color="grey " @click="countInput--; limit('in')"><v-icon>chevron_left</v-icon></v-btn>
      <v-btn dark small icon style="margin: 1px" color="grey " @click="countInput++; limit('in');"><v-icon>chevron_right</v-icon></v-btn>
      <!-- <v-btn small icon style="margin: 1px" color="primary darken-2" @click="countInput = 0"><v-icon>clear</v-icon></v-btn> -->
      <v-btn dark small round style="margin: 1px; font-size: 1.1em" color="grey " @click="getMax(...groupIndex, 'in')">all</v-btn>

    </div>
  </v-layout>
  <v-divider></v-divider>
  <v-card-actions>
    <v-checkbox color="pink" label="Clear hand outs" style="float:auto" v-model="checkboxOptions"></v-checkbox>

    <v-spacer></v-spacer>
    <v-btn outline color="primary" flat @click.stop.prevent="checkIn(...groupIndex); " > check in </v-btn>
    <span class="red--text" v-text="errorIn"></span>
  </v-card-actions>
</v-card>
</v-dialog>
{{Object.keys(items)}}
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
      <!-- <v-btn small icon style="margin: 1px" color="primary darken-2" @click="countInput = 0"><v-icon>clear</v-icon></v-btn> -->
      <v-btn small round style="margin: 1px; font-size: 1.1em" color="grey darken-2" @click="getMax(...groupIndex, 'out')">all</v-btn>

    </div>
    <br>
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
  transition: opacity 1.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
position: absolute;
}

.v-select,
.v-text-field {
  padding-left: 15px;
  padding-right: 15px;
}

.list-item {
  display: inline-block;
  margin-right: 10px;
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
      checkBox: true,
      dialogIn: false,
      dialogOut: false,
      showCheckedIn: false,
      checkboxOptions: false,
      errorIn: '',
      errorOut: '',
      countInput: 0,
      groupIndex: [], // [id, name, type, index]
      listconfig: {},
      items: {},
      itemsArray: [],
      searchResult: [],
      indexIn: [],
      indexOut: []
    };
  },
  watch: {

  },
  computed: {
searchIn() {
let ins = this.searchResult.filter((guest) => {
if (!guest.checkedIn) { return true}
else { return false }
})
this.indexIn = null
return ins
},
searchOut() {
let outs = this.searchResult.filter((guest) => {
if (guest.checkedIn) { return true}
else { return false }
})
this.indexOut = null

return outs
},
    ios(){
return store.state.ios
},
    userInfo() {
      return store.state.user;
    },
    totalCount: function() {
      let total = 0;
      let items = this.items;
      for (var part of Object.keys(items)) {
        if (this.items.hasOwnProperty(part) && this.items[part] != undefined) {
      for (var name in this.items[part]) {
        if (this.items[part].hasOwnProperty(name)) {
if (this.items[part][name].type == "GROUP") {
  total += parseInt(this.items[part][name].groupTotal);
} else {
  total += 1;
} } }
        } }
      return total;
    }

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
this.searchResult = this.itemsArray
      // if (s == '') { return this.searchResult = this.itemsArray }
      let arr = [];
      this.showCheckedIn = true
      let results = this.searchResult.filter(function(val) {
        val = JSON.parse(JSON.stringify(val));
        //return condition for filter
      try {
        if (
          val.name.toLowerCase().indexOf(s) >= 0 ||
          val.info.toLowerCase().indexOf(s) >= 0
        ) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false
      }
      });
      arr = results;

      this.searchResult = arr.sort();
    },
    getMax: async function (id, name, type, index, key, dialog) {

console.log('max name', name, dialog, key);
      let itemsRef = db .collection("lists") .doc(this.listId).collection("list_items") .doc(id);
      let str = key + ".checkedIn";
      let val = await itemsRef.get();
      let data = val.data();
      let count = data[key].count
console.log(data[key].groupTotal - count);
      if (dialog == 'in') { this.countInput = data[key].groupTotal - count; return  }
      else {  this.countInput = count; return count}


    },
    checkIn: async function(id, name, type, index, fieldKey) {
      // for (let item in this.items) {
      //   console.log('name', name);
      //   if (this.items.hasOwnProperty(item)) {
      //     delete  this.items[item]
      //   }
      // }
      // create itemsRef
      let itemsRef = db .collection("lists") .doc(this.listId).collection("list_items") .doc(id);
      let str = fieldKey + ".checkedIn";
      let countInput = parseInt(this.countInput)
console.log(str);
      if (type == "GROUP") {
        console.log('in group');
        // show dialog IN
        if (this.dialogIn == false) {
          this.groupIndex = [id, name, type, index, fieldKey]
          return (this.dialogIn = true);
        }

        // validate: bounce if group is full / entered
        if ( countInput < 0 ) {
          return this.errorIn = 'No negative values' ;
        }

        // validate IN: bounce if group is full / entered
        if (this.searchIn[index].count >= this.searchIn[index].groupTotal ) {
          return this.errorIn = 'More than group total'
        }
        if (parseInt(countInput) > this.searchIn[index].groupTotal - this.searchIn[index].count) {
          return this.errorIn = 'More than group total'
        }

        //get and set count
        let val = await itemsRef.get();
        let data = val.data();
        let count = data[fieldKey].count
        // SECOND VALIDATE based on real database information
        if (count >= this.searchIn[index].groupTotal) {
          return this.error = 'no guests left...'
        }
        let newcount = parseInt(count) + countInput;

        let check = newcount < data[fieldKey].groupTotal ? false : true
        if (newcount > data[fieldKey].groupTotal) {
          this.error = 'only ' + data[fieldKey].groupTotal - count + ' left'
          return countInput = data[fieldKey].groupTotal - count

        }
        //update
        let countStr = fieldKey + ".count";
        let clearOptStr = fieldKey + ".clearOptions";
        let clearOptions = this.checkboxOptions

        itemsRef.update({ [str]: check, [countStr]: newcount, [clearOptStr]: clearOptions })
        // create a log object for stats page
        const statsRef = db.collection('stats').doc(this.listId)
        // log full item
        let statLog = {...this.searchIn[index]}
        //set timestamp on item
        statLog.time = new Date()
        // set count
        statLog.count = countInput
        //  tell stats it's a check-in log
        statLog.checkedIn = true
        let push = {log: firebase.firestore.FieldValue.arrayUnion(statLog)}

        statsRef.update(push).then(() => {
          console.log('sts updated');
        }).catch((e) => {
          console.log('sts error', e);
        })
} else { //if single guest
        itemsRef.update({ [str]: true });
        const statsRef = db.collection('stats').doc(this.listId)
        let statLog = {...this.searchIn[index]}
        statLog.count = 1
        statLog.time = new Date()
        statLog.checkedIn = true
        let push = {log: firebase.firestore.FieldValue.arrayUnion(statLog)}
        statsRef.update(push).then(() => {
          console.log('sts updated');
        }).catch((e) => {
          console.log('sts error', e);

        })
      }
      this.checkboxOptions = false
      this.dialogIn = false
      this.errorIn = ''
    },
    checkOut: async function(id, name, type, index, fieldKey) {
      //receives number of checkins
      // for (let item in this.items) {
      //   if (this.items.hasOwnProperty(item)) {
      //     delete  this.items[item] //.splice(index,1)
      //   }
      //
      // }

      console.log('fieldKey', fieldKey);
console.log('name2', name);

      let itemsRef = db .collection("lists") .doc(this.listId).collection("list_items") .doc(id);
      let str = fieldKey + ".checkedIn";
      let countInput = parseInt(this.countInput)

      if (type == "GROUP") {
console.log('ingroup out');
        if (this.dialogOut == false) {
          this.groupIndex = [id, name, type, index, fieldKey]
          return (this.dialogOut = true);
        }
        if ( this.searchOut[index].count > this.searchOut[index].groupTotal ) {
          return console.log('err count is higher than total');;
        }
        // validate: bounce if group is full / entered
        if ( countInput < 0 ) {
          return this.errorIn = 'No negative values' ;
        }
        // validate OUT: bounce if group is full / entered
        if (countInput > this.searchOut[index].count ) {
          return this.error = 'More than current count'
        }
        //get and set count
        let val = await itemsRef.get();
        let data = val.data();
console.log('xx', fieldKey, name, data[fieldKey]);
        let count = parseInt(data[fieldKey].count)
        // second validate
        if (count > this.searchOut[index].groupTotal) {
          return ;
        }
        //decrement
        let newcount = count - countInput;
        //set checkedIn to true or false
        let check = newcount < data[fieldKey].groupTotal ? false : true
        // set bottom value of 0
        if (newcount < 0) { newcount = 0 }
        let str2 = fieldKey + ".count";
console.log('newcount', newcount);
        //update as group
        itemsRef.update({ [str]: check, [str2]: newcount }).then(() => {
          const statsRef = db.collection('stats').doc(this.listId)
          let statLog = {...this.searchOut[index]}
          // statspage receives an log object-array
          //set timestamp on item
          statLog.time = new Date()
          // change count to the count that is checkedin (input)
          statLog.count = countInput
          //  tell stats it's a check in log
          statLog.checkedIn = false
          let push = {log: firebase.firestore.FieldValue.arrayUnion(statLog)}

          statsRef.update(push)

        });
      } else {
str = fieldKey + ".checkedIn";
console.log(name, fieldKey, 'singeleout');
        // update as single entry
        itemsRef.update({ [str]: false });
        const statsRef = db.collection('stats').doc(this.listId)
        let statLog = {...this.searchOut[index]}
        statLog.count = 1
        statLog.time = new Date()
        statLog.checkedIn = false
        let push = {log: firebase.firestore.FieldValue.arrayUnion(statLog)}

        statsRef.update(push)
      }

      this.dialogOut = false
    },
    refresh: async function() {
      var id = this.$route.params.id;
      let userInfo = this.userInfo;
      let d = this;

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
          list_config.shared[this.user.uid].mode != "ACTIVATE"
        ) {
          return this.bail();
        }
        if (userInfo.admin && userInfo[id] >= 0) {
          return this.bail();
        }
      }
      // console.log("still in else it would bail with alert");
      let usr = firebase.auth().currentUser;
      let itemGet = await itemsRef.get();
      for (let items of itemGet.docs) {
        //loop each sublist
        await itemsRef.doc(items.id).onSnapshot(function(snap) {
          console.log('oh snap!', snap.data());
console.log('jj', d.items);
          let itemDoc = snap.data();
          // sublist id

          let itemArr = [];

          for (var doc in itemDoc) {
            if (itemDoc.hasOwnProperty(doc)) {
              itemDoc[doc].ref = snap.id;
              itemArr.push(itemDoc[doc]);
           }
          }
          d.$set(d.items, items.id, itemArr);

          console.log("partial list", itemArr);

           delete d.items["undefined"];
           var se = [];
           console.log('watching2');
           for (var seg in d.items) {
             if (d.items.hasOwnProperty(seg)) {
               console.log("watching inn!", seg);
               //loop items segment
               for (var i = 0; i < d.items[seg].length; i++) {
                 se.push(d.items[seg][i]);
               }
             }
           }
           se.sort()
           d.itemsArray = se
           return d.searchResult = se;
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
