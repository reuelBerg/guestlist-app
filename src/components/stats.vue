<template>

  <v-container fluid>
<v-card dark class="pa-2 pl-4 barcolor  ">
<div class="headline">{{config.title}}</div>
<div class="caption">{{config.date}}</div>

</v-card>
<v-card class="pa-3">
  <line-chart :discrete="true"  :curve="true" :colors="['#3a7677', '#dc0f43']" height="200px" :data="chartData" :options="chartOptions"></line-chart>
  <v-progress-linear class="pink" background-opacity="0" color="primary " :value="inCount * 100 / config.count" ></v-progress-linear>

<span class="">Guests checked in </span><span class="primary--text text--darken-3">{{inCount}}</span> <br>
<span class="">List total </span><span class="pink--text text--darken-3">{{config.count}}</span> <br>
</v-card>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap justify-center style="text-align:center;">

  <!-- <v-progress-circular
    :rotate="180"
    :size="100"
    :width="15"
    :value="inCount * 100 / config.count"
    color="pink"
  >
    {{ listProgress }}/{{listTotal}}
</v-progress-circular> -->



      </v-layout>
    </v-slide-y-transition>
<br>
<!-- LOG TOOLBAR -->
    <v-toolbar  flat color="grey darken-2" dark >
      <v-input class="grey darken-3 " style="height:32px;  border-radius:3px; background: #353535; max-width:300px;" >
        <input @keyup="search" class=" white--text pa-2 " style=" width:90%" type="text" placeholder="Search..." v-model="searchInput">
        <v-icon v-show="searchInput != ''" small class="pr-2" @click="searchInput = ''">cancel</v-icon>
      </v-input>
      <v-spacer ></v-spacer>
    </v-toolbar>
    <v-card   style="pa-0">

    <v-container class="ma-0">
<span class="font-italic " style="text-align:center;" v-if="log.length <= 0"> No logs to show. Activate your list and check in guests.</span>
<!--  LOG CONTENT-->
<v-slide-x-transition  v-else tag="v-list" group class="py-0">
<div   v-for="(item, index) in searchResult" :key="index"   style="height:25px;">
<div @click.stop="item.active == '' ? $set(searchResult[index], 'active', 'grey lighten-2') : $set(searchResult[index], 'active', '')" :class="item.active" class="">
  <span  style="border-radius: 3px; background:grey;  display:inline-block; text-align:center;" class=" white--text px-1 mr-1 caption">{{parseTime(item.time)}}</span>
  <span v-if="item.type" style="width:60px;border-radius: 3px; display:inline-block; text-align:center;" :class="colors[item.type]" class=" white--text px-2 mr-3 caption">{{item.type}}</span>
  <span v-else style="width:60px;border-radius: 3px; background:grey; display:inline-block; text-align:center;" class="white--text px-2 mr-3 caption">GUEST</span>
  <span class="pr-2">{{item.name}}</span>

  <span style="float:right" class="pr-2" :class="item.checkedIn ? 'primary--text' : 'pink--text'">{{item.count}}</span>
  <span style="float:right" class="pr-2" :class="item.checkedIn ? 'primary--text' : 'pink--text'" v-text="item.checkedIn ? '+' : '-'"></span>

</div>
</div>
</v-slide-x-transition>
</v-container>

    </v-card>
      <v-card v-if="dialog" dark class="barcolor pa-2 elevation-10" style="position: absolute; top: 0px; right:0px; max-width:250px; z-index:99;">
        <v-card-text>This page has a realtime connection. There is no need to refresh. Statistics might not be up-to-date if your doorhost has no internet connection.</v-card-text>
        <v-card-actions>
<v-spacer/>
          <v-btn small color="white " flat @click.native="dialog = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
   </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-list__tile.theme--light {
height: auto!important;
}
</style>
<script scoped>
import firebase from 'firebase'
import { db } from "../main";

export default {
  data () {
    return {
      dialog: true, //top online warning
      listTotal: 30,
      listProgress: 15,
      chartData: [],
      searchInput: '',
      searchResult: [],
      logHover: '',
      colors: { 'CREW': 'orange', 'PRESS': 'red', 'VIP': 'pink', 'ARTIST': 'blue', 'GROUP': 'primary darken-2', },
      log: [],
      config: {},
      chartOptions: {
             scales: {
                 xAxes: [{
                     type: 'time',
                     time: {
                                         displayFormats: {
                                             minutes: 'hh:mm '
                                         },
unit: 'hour'},
                     distribution: 'linear'

                 }]
             }
         }
    }
  },
created: function() {
let d = this
  db.collection('stats').doc(this.$route.params.id).onSnapshot(function(snap) {
    let log = snap.data().log.sort()
    d.log = log

    d.searchResult = snap.data().log.reverse()
    // data = [
    //   {name: 'Workout', data: {'2017-01-01': 3, '2017-01-02': 4}},
    //   {name: 'Call parents', data: {'2017-01-01': 5, '2017-01-02': 3}}
    // ];
    let inna = {name: 'checked in', data: {}}
    let outta = {name: 'checked out', data: {}}
  for (var item of log) {



let time = d.parseTime(item.time);
if (item.checkedIn) {
  inna.data[time] = (inna.data[time] || 0) + item.count //inna.data.push([time, log[item].count])
  outta.data[time] = 0
} else {
  inna.data[time] = 0 //inna.data.push([time, log[item].count])
  outta.data[time] = (outta.data[time] || 0) + item.count //.push([time, log[item].count])
}

let keyArr = Object.keys(inna.data)
for (let i in outta.data) {
  keyArr.push(i)
}
d.chartData = keyArr.sort()
// inna.data.sort()
// outta.data.sort()
d.chartData = [inna, outta]
  }
});

db.collection('lists').doc(this.$route.params.id).onSnapshot(function(snap) {
  d.config = snap.data()
})

},
  computed: {
    inCount: function() {
      let countIn = 0;
      for (let item of this.log) {
        if (item.hasOwnProperty('checkedIn')) {
if (item.checkedIn) {
  countIn += parseInt(item.count)
} else {
  countIn -= parseInt(item.count)
}
        }
      }

      return countIn
    }
  },
  methods: {
parseTime: function(date) {
  //recieves fire timestamp
date = date.toDate()
let hours = date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours()
let minutes = date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes()

return hours + ':' + minutes
},
    search: function() {
      // let regex = new RegExp(this.searchInput, "i")
      if (!this.searchInput || this.searchInput == '' || this.searchInput === null) {
        this.searchResult = this.log
        return
      }
      let s = this.searchInput.toLowerCase().trim();
      let results = this.log.filter(function(val) {
        // val = JSON.parse(JSON.stringify(val));
        if(!val.name || val.name === null || val.name === '') {console.log(val.name);
; return}
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
this.searchResult = results;
    }
  },
  name: 'Home'
}
</script>
