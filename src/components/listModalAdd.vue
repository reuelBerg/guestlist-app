<template>
<div class="">
  <v-snackbar id="snack"
     v-model="snackbar"
     color="primary"
     :timeout="1900"
absolute
top
vertical
   >
     <h3 style="text-align:center;">Added!</h3>
   </v-snackbar>
  <v-dialog id="modal" v-model="dialog" persistent >
        <v-btn @click.native.prevent :large="$vuetify.breakpoint.smAndUp" fixed absolute bottom right fab icon class="barcolor darken-4 white--text mb-2" :style="$vuetify.breakpoint.xsOnly ? 'bottom: 80px;' :'bottom: 100px;'" slot="activator" >
          <v-icon   :large="$vuetify.breakpoint.smAndUp">add</v-icon>
        </v-btn>



        <!-- add name to list ============================================================================  add name to list -->
        <v-card dark transition="slide-y-reverse-transition" class="pa-5 barcolor">


          <h2 class="mt-3 headline font-weight-bold">Add a guest</h2>
<v-form  ref="form" v-model="valid">
          <v-text-field :rules="[v => !!v || 'Name is required']" hint required v-model="add.name" label="name"></v-text-field>
          <v-text-field v-model="add.info" label="info"></v-text-field>
          <v-select
      :items="['CREW', 'VIP', 'PRESS', 'ARTIST', 'GROUP']"
      label="add type"
      v-model="add.type"
    ></v-select>
    <v-text-field v-show="add.type == 'GROUP'" step="0.5" min=0 oninput="validity.valid||(value='')"
    type="text" pattern="[0-9]*" v-model="add.groupTotal" label="group size"></v-text-field>


<!-- OPTIONS =================================================================================== OPTIONS -->
          <v-layout  row no-wrap align-center v-for="(item, index) in options.options" :key="index"
                v-if="userInfo.hasOwnProperty('admin') && userInfo.admin.hasOwnProperty(options.accountId)"  class="">
                <span  class="pr-2 subheader font-weight-bold white--text text--darken-1" style="font-size:16px; width:30%;  min-width:70px">{{item}}</span>
                <v-text-field box height="20px" xs5 style="max-width:50px; height; 30px" step="0.5" min=0 oninput="validity.valid||(value='')"
                type="text" pattern="[0-9]*" class="nr dark transparent py-1 title"
                v-model="add.options[item]">
              </v-text-field>
                  <v-btn tabindex="-1" small icon style="margin: 1px"  color="primary darken-2" @click="decrement(item)"><v-icon>chevron_left</v-icon></v-btn>
                  <v-btn tabindex="-1" small icon style="margin: 1px" color="primary darken-2" @click="increment(item)"><v-icon>chevron_right</v-icon></v-btn>
                  <v-btn tabindex="-1" small icon style="margin: 1px" color="primary darken-2" @click="clear(item)"><v-icon>clear</v-icon></v-btn>

              </v-layout>

              <v-layout v-else-if="!options.shared.hasOwnProperty(uid) ? false : options.shared[uid].options.hasOwnProperty(item)" row no-wrap align-center v-for="(item, index) in options.options" :key="index" class="">
                    <span  class="pr-2 subheader font-weight-bold primary--text " style="font-size:16px; width:30%;  min-width:70px">{{item}}</span>
                    <!-- TODO: make the '5' in hint reactive with something from sharedOptions -->
                    <v-text-field box height="20" :persistent-hint="hint(item) != null" :hint="hint(item)  + ' left' " xs5 style="max-width:50px" step="1.00" min="0" oninput="validity.valid||(value='')"
                    type="text" pattern="[0-9]*" class="nr dark transparent pa-1 title"
                    v-model="add.options[item]" >
                  </v-text-field>
                      <v-btn tabindex="-1" small icon style="margin: 1px"  color="primary darken-2" @click="decrement(item); limit(item)" :disabled="add.options[item] <= 0  || !add.options[item] "><v-icon>chevron_left</v-icon></v-btn>
                      <v-btn tabindex="-1" small icon style="margin: 1px" color="primary darken-2" @click="increment(item); limit(item)" :disabled="hint(item) <= 0"><v-icon>chevron_right</v-icon></v-btn>
                      <v-btn tabindex="-1" small icon style="margin: 1px" color="primary darken-2" @click="clear(item); limit(item)" :disabled="!add.options[item]"><v-icon>clear</v-icon></v-btn>

                  </v-layout>
</v-form>

            <span class="red--text" v-html="error"></span>
            <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn color="white darken-1" flat @click.native="clearFullModal(); dialog = false">Close</v-btn>
         <v-btn outline color="white darken-1" flat @click="addToList">Add!</v-btn>

       </v-card-actions>


      </v-card>

      </v-dialog>
</div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#snack {
z-index: 210!important;
}
</style>

<script scoped>
import firebase from "firebase";
import { db } from "../main";
import store from "../store";


export default {
  name: "listModalAdd",
  props: ["listId", "options", "count"],
  data() {
    return {
      process: process.env,
      uid: firebase.auth().currentUser.uid,
      valid: true,
      dialog: false,
      snackbar: false,
      error: '',
      add: {
        name: null,
        info: null,
        type: null,
        groupTotal: null,
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
        name: null,
        info: null,
        type: null,
        groupTotal: null,
        options: {}
      };
      this.error = ''
      this.$refs.form.reset()
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
this.$refs.form.validate()
if (!this.valid) { return }
      var user = firebase.auth().currentUser;
      console.log(this.listId);
      console.log(user.uid);
      console.log(user.email);
//trim all trailing and pre spaces on strings in add object
      for (var key in this.add) {
        if (this.add.hasOwnProperty(key)) {
          if (typeof this.add[key] == 'string') {
console.log(typeof this.add[key]);
            this.add[key].trim()         }
        }
      }
if (this.add.name == "") {
  return this.error = 'Enter a name'
}
// if (this.add.name.indexOf('..') != -1 || this.add.name.indexOf('...') != -1 || this.add.name.indexOf('....') != -1){
//   this.error = "Name cannot contain '..' <br>";
//   return;
// }

// if (this.add.name.charAt(0) == '.' || this.add.name.charAt(this.add.name.length -1) == '.') {
//   this.error = "Name cannot start or end with '.' <br>";
//   return;
// }
if (this.add.type == "GROUP" && this.add.groupTotal.trim() == '') {
  return this.error = 'Enter the group total'
}
if (this.$route.name == 'add') {
  //TODO limit adding guests when add amount is reached
}


// if option is 0 or '', delete from obj
for (var option in this.add.options) {
  if (this.add.options.hasOwnProperty(option)) {
    if (this.add.options[option] === '' || this.add.options[option] == 0 || this.add.options[option] === null || this.add.options[option] === undefined) {
      delete this.add.options[option]
    }
  }
}
for (var key in this.add) {
  if (this.add.hasOwnProperty(key)) {
    if (this.add[key] === undefined) {
      delete this.add[key]
    }
  }
}

this.add.info = this.add.info == undefined ? '' : this.add.info;
console.log(this.add);
      // add user id to this new item
      this.add.addById = user.uid;
      this.add.addByName = this.userInfo.fullName != undefined ? this.userInfo.fullName : user.email;
      this.add.count = 0
      //add fieldKey to object
      this.add.fieldKey = window.btoa(this.add.name.toLowerCase())

console.log(user.uid);
console.log(this.$route.params.id);
      let str = this.$route.name == 'edit' ? this.options.main_item : window.btoa(user.email)

console.log(str);
      const itemAddRef = db.collection('lists').doc(this.$route.params.id) .collection("list_items").doc(str)
      let itemAdd = itemAddRef.update({[this.add.fieldKey]:this.add});
      this.snackbar = true
      this.$emit("refreshList");
      this.clearFullModal()
    }
  },
  mounted: function() {
// set each option to null
    //  for (var i = 0; i < this.options.length; i++) {
    //    var name = this.options[i]
    //     this.add.options[name] = null
    //  }
  }
};
</script>
