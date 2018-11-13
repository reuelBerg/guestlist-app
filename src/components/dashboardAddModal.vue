<template>
  <v-dialog v-model="dialog" persistent class="ma-0">
    <v-btn :disabled="disable" fixed absolute bottom right fab class="barcolor darken-4 white--text mb-2"
    :style="$vuetify.breakpoint.xsOnly ? 'bottom: 80px;' :'bottom: 100px;'" slot="activator"
    :large="$vuetify.breakpoint.smAndUp">
    <v-icon :large="$vuetify.breakpoint.smAndUp" style="display:flex ">add</v-icon>
  </v-btn>
  <!-- add name to list ============================================================================  add name to list -->
  <v-card dark transition="slide-y-reverse-transition" class="pa-3 barcolor">

    <h2 class="mt-3">Create a new list</h2>
    <v-select
    :items="accounts"
    no-data-text="no premium accounts"
    label="pick account"
    v-model="add.accountName"
    ></v-select>
    <!-- <v-text-field  disabled v-model="add.accountName" label="account"></v-text-field> -->
    <v-text-field v-model="add.title" label="title"></v-text-field>
    <v-text-field v-model="add.subTitle" label="list reference"></v-text-field>
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
    label="pick a date"
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
    <v-text-field style="width:40vw; float: left;" v-model="formOptionInput" label="add option..." @keyup.enter="formOptionInput == '' ? '' : add.options.push(formOptionInput), formOptionInput = ''"></v-text-field>
    <v-btn class="primary"  style=" float: left;"  @click="formOptionInput == '' ? '' : add.options.push(formOptionInput), formOptionInput = ''">new</v-btn>
    <br>
    <div class="" style="float:left">

      <v-chip small icon v-for="(option, index) in add.options" :key="option">
        <span>{{option}}</span>
        <v-avatar @click="add.options.splice(index, 1)" size="5" class="ma-0 pa-0 ml-1" ><v-icon >cancel</v-icon></v-avatar>
      </v-chip>

    </div>
  </div>
  <v-text-field v-model="add.maxCount" pattern="[0-9]*" label="list maximum"></v-text-field>
  <span class="red--text" v-html="err"></span>
  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn color="white" flat @click.native="clearForm(); dialog = false">Cancel</v-btn>
    <v-btn outline color="white darken-1" flat @click=" newList">Add!</v-btn>
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
  name: "dashboardAddModal",
  data() {
    return {
      user: firebase.auth().currentUser,
      dialog: false,
      disable: false,
      datePicker: false,
      date: "",
      formOptionInput: "",
      err: "",
      add: {
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
      let user = store.state.user;

      return user;
    },
  accounts() {
  let arr = []
  for (var acc in this.userInfo.admin) {
    if (this.userInfo.admin.hasOwnProperty(acc)) {
      if (this.userInfo.admin[acc].isPremium) {
        arr.push(this.userInfo.admin[acc].name)
      }
  }
  }
if (arr.length == 1) {
  this.add.accountName = arr[0]
}
return arr
}
  },
  watch: {
    date() {
      this.add.date = this.formatDate(this.date);
    }

  },
  methods: {
    clearForm: function() {
      if (Object.keys(this.userInfo.admin).length > 0) {
        this.add.accountName = "";
      }
      this.add.title = "";
      this.add.subTitle = "";
      this.add.date = "";
      this.add.created = new Date();
      this.add.count = 0;
      this.add.maxCount = "";
      this.add.options = ["Tokens"];
      this.add.owner = "";
      this.add.accountId = "";

      this.err = "";
    },
    newList: async function() {
      var d = this;
      let add = this.add;
      add.date = this.computedDateFormatted;
      var listRef = db.collection("lists").doc();

      if (add.accountName === "") {
        this.err = "You have to pick an account <br>";
        return;
      }

      if (
        add.title == "" ||
        add.subTitle == "" ||
        add.date == "" ||
        add.date == null
      ) {
        return (this.err = "Enter Title, SubTitle and Date. <br>");
      }
      // vul add object
      var user = this.user;
      add.owner = user.uid;
      let mainItemId = await listRef.collection("list_items").add({});
      add.main_item = mainItemId.id;

      //  get id of accountname.
      for (let account_id in this.userInfo.admin) {
        if (this.userInfo.admin.hasOwnProperty(account_id)) {
          add.accountId = account_id;
        }
      }

      // vul database

      var listDoc = await listRef.set(add); //returns ID in listRef.id
      db.collection("stats")
        .doc(listRef.id)
        .set({ log: [] });

      d.$emit("refreshList");
      d.dialog = false;
      this.clearForm();
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
