<template>
  <v-dialog v-model="dialog" persistent >
        <v-btn :large="$vuetify.breakpoint.smAndUp" fixed absolute bottom right fab icon class="black mb-2" :style="$vuetify.breakpoint.xsOnly ? 'bottom: 80px;' :'bottom: 100px;'" slot="activator" >
          <v-icon   :large="$vuetify.breakpoint.smAndUp">add</v-icon>
        </v-btn>
        <!-- add name to list ============================================================================  add name to list -->
        <v-card transition="slide-y-reverse-transition" class="pa-5">
          <v-text-field v-model="add.name" label="name"></v-text-field>
          <v-text-field v-model="add.info" label="info"></v-text-field>
          <v-select
      :items="['CREW', 'VIP', 'PRESS', 'GUEST', 'GROUP']"
      label="add type"
      v-model="add.type"
    ></v-select>
    <v-text-field v-show="add.type == 'GROUP'" step="0.5" min=0 oninput="validity.valid||(value='')"
    type="text" pattern="[0-9]*" v-model="add.groupTotal" label="group size"></v-text-field>
<!-- OPTIONS =================================================================================== OPTIONS -->
          <v-layout row no-wrap align-center v-for="(item, index) in options.options" :key="index" class="">
                <span  class="pr-2 subheader font-weight-bold cyan--text text--darken-1" style="font-size:16px; width:30%;  min-width:70px">{{item}}</span>
                <!-- TODO: make the '5' in hint reactive with something from sharedOptions -->
                <v-text-field   :persistent-hint="hint(item) != null" :hint="hint(item)  + ' left' " xs5 style="max-width:100px" step="1.00" min="0" oninput="validity.valid||(value='')"
                type="text" pattern="[0-9]*" class="nr dark transparent pa-1 title"
                v-model="add.options[item]" >
              </v-text-field>
                  <v-btn small icon style="margin: 1px"  color="cyan darken-2" @click="decrement(item); limit(item)" :disabled="add.options[item] <= 0  || !add.options[item] "><v-icon>chevron_left</v-icon></v-btn>
                  <v-btn small icon style="margin: 1px" color="cyan darken-2" @click="increment(item); limit(item)" :disabled="hint(item) <= 0"><v-icon>chevron_right</v-icon></v-btn>
                  <v-btn small icon style="margin: 1px" color="cyan darken-2" @click="clear(item); limit(item)" :disabled="!add.options[item]"><v-icon>clear</v-icon></v-btn>

              </v-layout>
              <v-snackbar
                 v-model="snackbar"
                 color="cyan"
                 :timeout="1900"
                  bottom
                  vertical
               >
                 <h3 style="text-align:center;">Added!</h3>
               </v-snackbar>
            <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn color="grey darken-1" flat @click.native="dialog = false">Close</v-btn>
         <v-btn color="cyan darken-1" flat @click="addToList">Add!</v-btn>
       </v-card-actions>
      </v-card>
      </v-dialog>

</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

<script scoped>
import firebase from "firebase";
import { db } from "../main";
import store from "../store";

export default {
  name: "listEditAddModal",
  props: ["listId", "options", "count"],
  data() {
    return {
      process: process.env,
      uid: firebase.auth().currentUser.uid,
      dialog: false,
      snackbar: false,
      add: {
        name: "",
        info: "Mag koekhappen.",
        type: "GUEST",
        groupTotal: '',
        options: {}
      }
    };
  },
  computed: {
    userInfo() {
      return store.state.user;
    },
shared() {
return this.options.shared[this.uid]
}
},
  methods: {
limit: function (item) {
  let val = this.add.options[item] //input
  let count = this.count[item] == undefined ? 0 : this.count[item] //total used
  let a = this.shared.options[item]  //total allowed
  let newcount = a - count
if (val > newcount) {
  this.add.options[item] = newcount
}
if (val <= 0) {
  this.add.options[item] = ''
}

},
    hint: function(item) {
      let input = this.add.options[item] == undefined ? 0 : this.add.options[item] //input
      let count = this.count[item] == undefined ? 0 : this.count[item] //total used
      if (!count) { return null }
      let a = this.shared.options[item] == undefined ? 0 : this.shared.options[item] //total allowed
      if (!a) { return null }
      let newcount = a - count - input

      return newcount < 0 ? 0 : newcount
    },
    clear: function(option) {
      this.add.options[option] = null;
    },
    clearFullModal: function() {
      this.add = {
        name: "",
        info: "",
        type: "",
        groupTotal: '',
        options: {}
      };
    },
    increment: function(option) {
      var option = option;

      this.add.options = Object.assign(
        {},
        JSON.parse(JSON.stringify(this.add.options)),
        {}
      );
      if (this.add.options[option] == null) {
        this.add.options[option] = 1;
      } else {
        this.add.options[option]++;
      }
    },
    decrement: function(option) {
      var option = option;

      this.add.options = Object.assign(
        {},
        JSON.parse(JSON.stringify(this.add.options)),
        {}
      );
      if (this.add.options[option] == null) {
        return;
      } else if (this.add.options[option] <= 1) {
        this.clear(option);
      } else {
        this.add.options[option]--;
      }
    },
    addToList: function() {
      var user = firebase.auth().currentUser
      let listId = this.$route.params.id

      console.log(user.uid);
      console.log(user.email);

      if (this.add.name == "") {
        return this.error = 'Enter a name'
      }
      if (this.add.name.indexOf('..') != -1 || this.add.name.indexOf('...') != -1 || this.add.name.indexOf('....') != -1){
        this.error = "Name cannot contain '..' <br>";
        return;
      }
      console.log(this.add.name.charAt(0))

      if (this.add.name.charAt(0) == '.' || this.add.name.charAt(this.add.name.length -1) == '.') {
        this.error = "Name cannot start or end with '.' <br>";
        return;
      }
      if (this.add.type == "GROUP" && this.add.groupTotal == '') {
        return this.error = 'Enter the group total'
      }

      for (var option in this.add.options) {
        if (this.add.options.hasOwnProperty(option)) {
          if (this.add.options[option] === '' || this.add.options[option] === 0 || this.add.options[option] === null) {
            delete this.add.options[option]
          }
        }
      }
      // add user id to this new item
      this.add.addById = user.uid;
      this.add.addByName = this.userInfo.fullName != undefined ? this.userInfo.fullName : user.email;
      this.add.count = 0


      var j = JSON.parse(JSON.stringify(this.add));
      const itemAdd = db.collection('lists').doc(listId) .collection("list_items").doc(user.uid).update({[this.add.name]:this.add});
      let item = itemAdd.id;
      console.log(item);
      this.$emit("refreshList");
this.clearFullModal()
this.snackbar = true
    }
  },
  mounted: function() {
    //  for (var i = 0; i < this.options.length; i++) {
    //    var name = this.options[i]
    //     this.add.options[name] = null
    //  }
  }
};
</script>
