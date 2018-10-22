<template>
  <v-dialog v-model="dialog" persistent class="">
    <v-btn :disabled="disable" fixed absolute bottom right fab class="black mb-2"
    style="bottom: 85px;" slot="activator"
    :large="$vuetify.breakpoint.smAndUp">
    <v-icon :large="$vuetify.breakpoint.smAndUp" style="display:flex ">add</v-icon>
  </v-btn>

  <!-- add name to list ============================================================================  add name to list -->
  <v-card transition="slide-y-reverse-transition" class="pa-3">
    <h2 class="mt-3">Create a new list</h2>
    <v-select
    v-if="userInfo"
    :items="userInfo.accounts"
    label="pick account"
    v-model="add.accountName"
    ></v-select>
    <v-text-field v-model="add.title" placeholder="title"></v-text-field>
    <v-text-field v-model="add.subTitle" placeholder="reference e.g. 'Guests PreParty'"></v-text-field>
    <v-menu
    ref="menu"
    :close-on-content-click="false"
    v-model="datePicker"
    :nudge-right="40"
    :return-value.sync="date"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px"
    >
    <v-text-field
    slot="activator"
    v-model="add.date"
    placeholder="pick a date"
    append-icon="event"
    readonly
    ></v-text-field>
    <v-date-picker v-model="date" no-title scrollable>
      <v-spacer></v-spacer>
      <v-btn flat color="primary" @click="datePicker = false">Cancel</v-btn>
      <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
    </v-date-picker>
  </v-menu>
  <div class="d-inline-block">
    <v-text-field style="width:40vw; float: left;" v-model="formOptionInput" placeholder="add option..."></v-text-field>
    <v-btn  style=" float: left;" @click="formOptionInput == '' ? '' : add.options.push(formOptionInput), formOptionInput = ''">new</v-btn>
    <br>
    <div class="" style="float:left">
      <v-chip small icon v-for="(option, index) in add.options" :key="option">
        <span>{{option}}</span>
        <v-avatar @click="add.options.splice(index, 1)" size="5" class="ma-0 pa-0 ml-1" ><v-icon >cancel</v-icon></v-avatar>
      </v-chip>

    </div>
  </div>
  <v-text-field v-model="add.maxCount" pattern="[0-9]*" placeholder="list maximum"></v-text-field>
  <span class="red--text" v-html="err"></span>
  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn color="grey darken-1" flat @click.native="clearForm(); dialog = false">Cancel</v-btn>
    <v-btn color="cyan darken-1" flat @click=" newList">Add!</v-btn>
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
import store from '../store'


export default {
  name: "dashboardAddModal",
  data() {
    return {
      user: firebase.auth().currentUser,
      accounts: [],
      dialog: false,
      disable: false,
      datePicker: false,
      date: "",
      formOptionInput: "",
      err: "",
      add: {
        accountName: "",
        title: "",
        subTitle: "",
        date: "",
        created: new Date(),
        count: 0,
        maxCount: "",
        options: ["Tokens"],
        owner: "",
        accountId: "",
        accountName: ""
      }
    };
  },

  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
    userInfo() {
    return store.state.user
}

  },
  watch: {
    date(val) {
      this.add.date = this.formatDate(this.date);
    },
    userInfo: function () {
    console.log('acc yo', this.userInfo.accounts[0]);
    this.add.accountName = this.userInfo.accounts[0]
}
  },
  methods: {
clearForm: function () {
  this.add.accountName = ""
  this.add.title = ""
  this.add.subTitle = ""
  this.add.date = ""
  this.add.created = new Date()
  this.add.count = 0
  this.add.maxCount = ""
  this.add.options = ["+1", "Tokens"]
  this.add.owner = ""
  this.add.accountId = ""
  this.add.accountName = ""

this.err = ""
},
    newList: async function() {
      var d = this;
      let add = this.add;
      add.date = this.computedDateFormatted
      var listRef = db.collection("lists").doc();


      if (add.accountName === "") {
        this.err = "You have to pick an account <br>";
        return;
      }

      if (add.title == "" || add.subTitle == "" || add.date == "" || add.date == null  ) {
        return this.err = "Enter Title, SubTitle and Date. <br>";
      }
      // vul add object
      var user = this.user;
      add.owner = user.uid;
      let mainItemId = await listRef.collection('list_items').add({})
      add.main_item = mainItemId.id;

      //  get id of accountname.
      for (let account_id in this.userInfo.admin) {
        if (this.userInfo.admin.hasOwnProperty(account_id)) {
          add.accountId = account_id;
        }
      }

      // vul database

      var listDoc = await listRef.set(add); //returns ID in listRef.id
      d.$emit("refreshList");
      d.dialog = false;
this.clearForm()
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }, //> methods
  created: async function() {}
};
</script>
