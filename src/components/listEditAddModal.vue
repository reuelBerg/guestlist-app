<template>
  <v-dialog v-model="dialog" persistent >
        <v-btn :large="$vuetify.breakpoint.smAndUp" fixed absolute bottom right fab icon class="barcolor darken-4 white--text mb-2" :style="$vuetify.breakpoint.xsOnly ? 'bottom: 80px;' :'bottom: 100px;'" slot="activator" >
          <v-icon   :large="$vuetify.breakpoint.smAndUp">add</v-icon>
        </v-btn>
        <!-- add name to list ============================================================================  add name to list -->
        <v-card dark transition="slide-y-reverse-transition" class="pa-5 barcolor">
          <h2 class="mt-3 headline font-weight-bold">Add a guest</h2>

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
                <span  class="pr-2 subheader font-weight-bold white--text text--darken-1" style="font-size:16px; width:30%;  min-width:70px">{{item}}</span>
                <v-text-field xs5 style="max-width:100px" step="0.5" min=0 oninput="validity.valid||(value='')"
                type="text" pattern="[0-9]*" class="nr dark transparent pa-1 title"
                v-model="add.options[item]">
              </v-text-field>
                  <v-btn small icon style="margin: 1px"  color="cyan darken-2" @click="decrement(item)"><v-icon>chevron_left</v-icon></v-btn>
                  <v-btn small icon style="margin: 1px" color="cyan darken-2" @click="increment(item)"><v-icon>chevron_right</v-icon></v-btn>
                  <v-btn small icon style="margin: 1px" color="cyan darken-2" @click="clear(item)"><v-icon>clear</v-icon></v-btn>

              </v-layout>
            <span class="red--text" v-html="error"></span>
            <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn color="white darken-1" flat @click.native="clearFullModal(); dialog = false">Cancel</v-btn>
         <v-btn outline color="white darken-1" flat @click="addToList">Add!</v-btn>
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
  props: ["listId", "options"],
  data() {
    return {
      user: firebase.auth().currentUser,
      process: process.env,
      dialog: false,
      error: '',
      add: {
        name: "",
        info: "",
        type: "",
        groupTotal: '',
        options: {}
      }
    };
  },
  computed: {
    userInfo() {
      return store.state.user;
    }
},
  methods: {
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
      this.error = ''
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
      var user = this.user;
      console.log(this.listId);
      console.log(user.uid);
      console.log(user.email);
if (this.add.name == "") {
  return this.error = 'Enter a name'
}
if (this.add.name.indexOf('..') != -1 || this.add.name.indexOf('...') != -1 || this.add.name.indexOf('....') != -1){
  this.error = "Name cannot contain '..' <br>";
  return;
}

if (this.add.name.charAt(0) == '.' || this.add.name.charAt(this.add.name.length -1) == '.') {
  this.error = "Name cannot start or end with '.' <br>";
  return;
}
if (this.add.type == "GROUP" && this.add.groupTotal == '') {
  return this.error = 'Enter the group total'
}

for (var option in this.add.options) {
  if (this.add.options.hasOwnProperty(option)) {
    if (this.add.options[option] === '' || this.add.options[option] == 0 || this.add.options[option] === null) {
      delete this.add.options[option]
    }
  }
}
      // add user id to this new item
      this.add.addById = user.uid;
      this.add.addByName = this.userInfo.fullName != undefined ? this.userInfo.fullName : user.email;
      this.add.count = 0

      var j = JSON.parse(JSON.stringify(this.add));

      let str = this.options.main_item
      const itemAddRef = db.collection('lists').doc(this.listId) .collection("list_items").doc(str)
      let itemAdd = itemAddRef.update({[this.add.name]:this.add});
      let item = itemAdd.id;
      console.log(item);
      this.$emit("refreshList");
      this.dialog = false;
    }
  },
  mounted: function() {
  }
};
</script>
