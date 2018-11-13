<template>
  <v-container fluid class="mt-0 py-0" >
    <v-btn fixed absolute bottom right fab color="barcolor darken-4 white--text" style=" bottom: 20px;" :large="$vuetify.breakpoint.smAndUp" @click="refresh" >
      <v-icon :large="$vuetify.breakpoint.smAndUp" >autorenew</v-icon>
    </v-btn>
    <listModalAdd  :listId="listId" :options="listconfig" @refreshList="refresh"></listModalAdd>

    <v-slide-y-transition mode="out-in">
      <v-layout row justify-center>
        <v-card d-block style="max-width:800px; width:100%">

<v-btn @click="uploadDialog = !uploadDialog"><v-icon class="pr-1">cloud_upload</v-icon> .xlsx</v-btn>

<v-toolbar class="barcolor white--text" >
          <v-toolbar-title>{{listconfig.title}}</v-toolbar-title>
          </v-toolbar>
          <v-toolbar  flat color="barcolor darken-2" dark style=" position: -webkit-sticky; position: sticky; top: 55px; z-index:99" :style="">
            <v-input class="barcolor darken-3 title" style="height:32px;  border-radius:3px; background: #353535;" >
              <input @keyup="search()" class=" white--text pa-2 " style=" width:100%" type="text" placeholder="Search..." v-model="searchInput">
              <v-icon v-show="searchInput != ''" small class="pr-2" @click="searchInput = ''; search()">cancel</v-icon>
            </v-input>
            <v-spacer ></v-spacer>
            <v-avatar size="30" class="barcolor darken-3 subheading "><span v-text="totalCount"></span></v-avatar>
          </v-toolbar>
<div v-if="Object.keys(items).length < 1" class="font-italic grey--text pa-3" style='text-align:center;'>Time to add some guests!</div>

          <v-list v-for="(doc, key) in searchResult"  :key="key" dense two-line>
              <v-subheader  class="white--text barcolor">{{key.toUpperCase()}}
              <v-spacer></v-spacer>
              <v-avatar size="20" class="barcolor lighten-1 mr-1"><span v-if="doc" class="white--text " v-text="segmentCount(doc)"></span></v-avatar>
            </v-subheader>
            <v-list-group   v-for="(item, index) in doc" :key="index" v-model="item.active">
              <template  >
                <!-- list titles -->
                <v-list-tile slot="activator" :key="item.key" avatar @click="" >
                  <v-list-tile-avatar class="hidden-xs-only subheading white--text " color="barcolor">
                    <span v-text="item.name.charAt(0).toUpperCase()" class=" "></span>
                  </v-list-tile-avatar>

                  <v-list-tile-content >
                    <v-list-tile-title  v-text="item.name"></v-list-tile-title>
                    <!-- TODO: make subtitle that shows who added this -->
                    <v-list-tile-sub-title >{{item.info}}</v-list-tile-sub-title>

                  </v-list-tile-content>

                  <v-spacer ></v-spacer>

<v-layout column wrap align-center class="ma-0 pa-0" style="text-align:end; ">
<span v-text="" class="orange--text font-weight-bold py-0">{{item.type}}</span>
<span v-if="item.type == 'GROUP'" class="grey--text"><span v-text="item.count"></span>/{{item.groupTotal}}</span>   <!-- TODO make dynamic -->
</v-layout>
              </div>

          </v-list-tile>
          <v-card  color="">
            <v-divider></v-divider>
            <div class="">
              <v-btn dark fab small v-if="key == 'Account List'" @click="removeDialogItemId = [item.ref, item.fieldKey]; removeDialog = true;" class="ml-1 grey lighten-1 grey--text text--darken-2 right"> <v-icon style="font-size:27px;">delete</v-icon></v-btn>
<span v-else class="ml-1 grey white--text pa-1 right"> NOT YOUR ITEM</span>
            </div>
            <div class="mx-3  py-4 my-2">
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
                  <v-flex v-if="option > 0"  v-for="(option, key) in item.options" :key="key" class=" pink darken-4 elevation-1 mt-1 mr-1 pa-2" style="text-align:center; min-width:65px!important;height:65px!important;   border-radius:3px; flex:unset;">
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
        </template>
      </v-list-group>
    </v-list>
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

<v-dialog v-model="uploadDialog" persistent max-width="420" >
  <v-card dark class="barcolor pa-4">
    <v-card-title class="headline font-weight-bold">Upload .XLSX file</v-card-title>
    <v-card-text>If you have not downloaded and used our <a href="/files/excel-template.xlsx" download>Excel Template</a>. Please do this now, the upload will not work otherwise. Beware, the current 'account list' will be replaced.</v-card-text>
    <v-card-text>

<label class="subheading font-weight-medium">Upload a file</label>
 <input class="mt-1" type="file" name="" value="" ref="fileInput" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" ></v-card-text>

    <!-- <v-card-text>Would you like to add the items to this list or replace the current list with the upload?  </v-card-text> -->
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="white " flat @click.native="uploadDialog = false">cancel</v-btn>
      <v-btn outline color="white" flat @click.native="uploadDialog = false;  handleDrop()">Upload</v-btn>
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
import XLSX from "xlsx";
import { db } from "../main";
import store from "../store";
import inputNumber from "./inputNumber.vue";

// import listEditAddModal from "./listEditAddModal.vue";
import listModalAdd from "./listModalAdd.vue";

export default {
  components: { inputNumber, listModalAdd },
  data() {
    return {
      searchInput: "",
      removeDialog: false,
      removeDialogItemId: [],
      uploadDialog: false,
      listconfig: {},
      listId: this.$route.params.id,
      items: {},
      searchResult: []
    };
  },
  watch: {
    userInfo: function() {
      if (!this.items.hasOwnProperty()) {
        this.refresh();
      }
    }
    // dropFile: function(e) {
    //   this.handleDrop(e)
    // },
  },
  computed: {
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
}
        }
      }

        }
      }
      return total;
    }
  },
  methods: {
    segmentCount: function(seg) {
      let total = 0;
    //receive segment Array and loop each person obj in array
      for (var person of seg) {
        if (person.hasOwnProperty('name')) {
          if (person.type == "GROUP") {
          total += parseInt(person.groupTotal);
          } else {
          total += 1;
          }

        }
      }
    return total
    },
    handleDrop: function() {
      const user = firebase.auth().currentUser;
      let rABS = true;
      let d = this;
      var files = (this.files = this.$refs.fileInput.files),
        f = files[0];
      var reader = new FileReader();
      reader.onload = function(e) {
        var data = e.target.result;
        if (!rABS) data = new Uint8Array(data);
        var workbook = XLSX.read(data, { type: rABS ? "binary" : "array" });

        var sheetList = workbook.SheetNames;
        var list = XLSX.utils.sheet_to_json(workbook.Sheets[sheetList[0]]);

        var newobj = {};

        // TODO: validate sheet: Group and grouptotal , option or grouptotal is text
        for (var nm in list) {
          if (nm.Type == "GROUP" && nm["GROUP total"] == undefined) {
            //Groups without a total
            return alert(
              'Check your sheet! type: GROUP must also have a "GROUP total"'
            );
          }
          if (
            parseInt(nm["GROUP total"]) == NaN ||
            parseInt(nm["GROUP total"]) == "NaN"
          ) {
            //Grouptotal is not a number
            return alert('Check your sheet! "GROUP total" must be a number');
          }
          for (var title in nm) {
            if (nm.hasOwnProperty(title)) {
              if ((title == "" || title == undefined) && nm[title]) {
                return alert(
                  "Check your sheet! We found data in columns without a header/title"
                );
              }
            }
          }
        }

        for (var nm of list) {
          if (nm.Name === "" || nm.Name === null || nm.Name === undefined) {
            continue;
          }
          console.log("nm", nm);

          let hash = window.btoa(nm.Name.toLowerCase().trim());
          newobj[hash] = {
            addById: user.uid,
            addByName:
              this.userInfo != undefined ? this.userInfo.fullName : user.email,
            count: 0,
            name: nm.Name.trim(),
            info: nm.Info ? nm.Info.trim() : null,
            type: nm.Type ? nm.Type.toUpperCase().trim() : null,
            fieldKey: hash,
            groupTotal: nm.Type == "GROUP" ? nm["GROUP total"] : null,
            options: {}
          };

          console.log("nm", nm);
          // key is the option name
          for (let key in nm) {
            if (nm.hasOwnProperty(key)) {
              console.log("keyz", key);
              if (
                key != "Name" &&
                key != "Info" &&
                key != "Type" &&
                key != "GROUP total"
              ) {
                console.log(nm[key]);
                newobj[hash].options[key] = nm[key];
              }
            }
          }
        }
        let str = d.listconfig.main_item;

        const itemAddRef = db
          .collection("lists")
          .doc(d.$route.params.id)
          .collection("list_items")
          .doc(str);
        let itemAdd = itemAddRef.set({ ...newobj });
        d.refresh();

        console.log(newobj);
        /* DO SOMETHING WITH workbook HERE */
        console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheetList[0]]));
      }; // end of for loop

      if (rABS) reader.readAsBinaryString(f);
      else reader.readAsArrayBuffer(f);
    },
    search: function() {
      let s = this.searchInput.toLowerCase().trim();
      let obj = {};
      for (var segment in this.items) {
        if (this.items.hasOwnProperty(segment)) {
          let results = this.items[segment].filter(function(val) {
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
          obj[segment] = results;
        }
      }
      // console.log('searching', obj);

      this.searchResult = obj;
    },
    removeFromList: function(id, fieldKey) {
        console.log(id, fieldKey);
        db.collection("lists")
        .doc(this.listId)
        .collection("list_items")
        .doc(id)
        .update({ [fieldKey]: firebase.firestore.FieldValue.delete() });
        this.refresh();
    },
    refresh: async function() {
      var id = this.listId; //list parent id
      if (!this.userInfo.fullName) {
        return;
      }
      let userInfo = this.userInfo;
      if (!this.listId) {
        this.listId = id;
      } // !something valid expression?
      console.log("** refreshing:" + id);

      const listRef = db.collection("lists").doc(id);
      //await list config
      let config = await listRef.get();
      let list_config = config.data();
      //bail if not admin or if admin account is not premium
      if (!this.userInfo.admin.hasOwnProperty(list_config.accountId)) {
        return this.bail();
      }
      //if not premium
      if (!this.userInfo.admin[list_config.accountId].isPremium) {
        return this.bail();
      }

      console.log("still in");
      this.items = {};
      const itemsRef = listRef.collection("list_items");
      // loop config.shared to get linked items
      let usr = firebase.auth().currentUser;
      // get all the lists connected, main and shared
      let itemGet = await itemsRef.get();
      for (let items of itemGet.docs) {
        //loop each list_item doc
        let itemDoc = items.data();
        // loop the guests and make obj
        let name;
        if (items.id == list_config.main_item) {
          name = "Account List";
        } else {
          name =
            window.atob(items.id)
        }
        //loop guests on the list
        let itemArr = [];
        for (var doc in itemDoc) {
          if (itemDoc.hasOwnProperty(doc)) {
            itemDoc[doc].ref = items.id;
            itemArr.push(itemDoc[doc]);
            // this.items[name] = itemArr
            this.$set(this.items, name, itemArr);
          }
        }
      }

      this.listconfig = list_config;
      this.searchResult = this.items;
    },

    bail: function() {
      alert("You are not allowed to be here");
      this.$router.push("/dashboard");
    }
  },
  created: function() {
    this.refresh();
  },
  name: "listEdit"
};
</script>
