<template>
  <v-dialog v-model="dialog" persistent >
        <v-btn :large="$vuetify.breakpoint.smAndUp" absolute bottom right fab icon class="black mb-2" style=" bottom: 55px;" slot="activator" >
          <v-icon   :large="$vuetify.breakpoint.smAndUp">add</v-icon>
        </v-btn>
        <!-- add name to list ============================================================================  add name to list -->
        <v-card transition="slide-y-reverse-transition" class="pa-5">
          <v-text-field v-model="add.name" label="name"></v-text-field>
          <v-text-field v-model="add.info" label="info"></v-text-field>
          <v-select
      :items="['CREW', 'VIP', 'PRESS', 'GUEST']"
      label="add type"
      v-model="add.type"
    ></v-select>

<!-- OPTIONS =================================================================================== OPTIONS -->
          <v-layout row no-wrap align-center v-for="(item, index) in options.options" :key="index" class="">
                <span  class="pr-2 subheader font-weight-bold cyan--text text--darken-1" style="font-size:16px; width:30%;  min-width:70px">{{item}}</span>
                <!-- TODO: make the '5' in hint reactive with something from sharedOptions -->
                <v-text-field  pesistent-hint :hint="5 - add.options[item] + ' left'" xs5 style="max-width:100px" step="1.00" min=0 oninput="validity.valid||(value='')"
                type="text" pattern="[0-9]*" class="nr dark transparent pa-1 title"
                v-model="add.options[item]">
              </v-text-field>
                  <v-btn small icon style="margin: 1px"  color="cyan darken-2" @click="decrement(item)"><v-icon>chevron_left</v-icon></v-btn>
                  <v-btn small icon style="margin: 1px" color="cyan darken-2" @click="increment(item)"><v-icon>chevron_right</v-icon></v-btn>
                  <v-btn small icon style="margin: 1px" color="cyan darken-2" @click="clear(item)"><v-icon>clear</v-icon></v-btn>

              </v-layout>

            <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn color="grey darken-1" flat @click.native="dialog = false">Cancel</v-btn>
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

export default {
  name: "listEditAddModal",
  props: ["listId", "options"],
  data() {
    return {
      user: firebase.auth().currentUser,
      process: process.env,
      dialog: false,
      add: {
        name: "",
        info: "Mag koekhappen.",
        type: "GUEST",
        options: {}
      }
    };
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
      var user = this.user;
      console.log(this.listId);
      console.log(user.uid);
      console.log(user.email);

      // add user id to this new item
      this.add.addById = user.uid;
      this.add.addByName =
        user.fullName != undefined ? user.fullName : user.email;

      var j = JSON.parse(JSON.stringify(this.add));
      const itemAdd = db .collection("list_items").doc(this.listId).update({[this.add.name]:this.add});
      let item = itemAdd.id;
      console.log(item);
      this.$emit("refreshList");
      this.dialog = false;
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
