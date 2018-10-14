<template>
  <v-container fluid style="text-align:center; background: url(https://cdn.wonderfulengineering.com/wp-content/uploads/2014/06/galaxy-wallpapers-10.jpg)">
    <h1>AccountSettings</h1>
    <p v-if="welcomeMessage">Welcome to your account settings page. <span>You have no  account connected. Go <span class="cyan--text font-weight-bold" style="">premium</span> or start a free trial!</span> </p>
    <br>
    <v-card  v-show="showAccountBlock" class="pa-3">
      <div  class="" style="text-align:left;">
        <span  class="label">Company Name:</span><span v-text="accountInfo.accountName"></span> <br>
        <span  class="label">Subscription:</span><span v-text="accountInfo.subscription"></span> <br>
        <span  class="label">Premium:</span><span>{{accountInfo.premium}}</span> <br>
        <span  class="label">Premium Ends:</span><span >{{dateFromTimestamp(accountInfo.premiumEnd)}}</span> <br> <!-- else show '-' -->
        <span  class="label">Max Admins:</span><span>{{accountInfo.maxUsers}}</span> <br>
      </div>

      <div class="">
        <v-text-field v-model="inviteAdmin" placeholder="email to invite" type="email"></v-text-field>
        <v-btn @click="sendInvite()"> invite as admin</v-btn>
      </div>
      <div class="grey">
        <v-list>
          <v-list-tile v-for="(admin, key) in accountInfo.admins" :key="key">
            <v-list-tile-content>
              <v-list-tile-title >{{admin.email}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </div>
    </v-card>

    <v-card v-show="showForm" class="pa-3">
      <v-text-field v-model="form.companyName" placeholder="company name" type="name"></v-text-field>
      <v-text-field v-model="form.attentionOf" placeholder="attention of (name)" type="name"></v-text-field>
      <v-text-field v-model="form.address" placeholder="address" type="address"></v-text-field>
      <v-text-field v-model="form.postalCode" placeholder="postal code" type="name"></v-text-field>
      <v-text-field v-model="form.city" placeholder="city"></v-text-field>
      <v-text-field v-model="form.country" placeholder="country"></v-text-field>

      <v-card class="pa-3 cyan--text text--darken-1" style="width:200px; border-radius: 5px; background: white; text-align:center; border: 12px ridge aliceblue; box-shadow: 4px 4px 15px grey inset; background:aliceblue " >
        <h2 class="label">5-day Trial</h2> <br>
        <span class="label">Admins</span><span>3</span> <br>
        <span class="label">Devices</span><span>Unlimited</span> <br>
        <span class="label">Invite Users</span><span>Activate/Add</span> <br>
        <span class="label">Free Chipotle</span><span>30pcs/month</span> <br>

        <v-btn @click="subscribe" class="cyan elevation-5">Pick me!</v-btn>

      </v-card>

    </v-card>

  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.label {
  display: inline-block;
  width: 150px;
  margin-right: 20px;
  font-weight: bold;
}
</style>

<script scoped>
import firebase from "firebase";
import { db } from "../main";

export default {
  data() {
    return {
      user: firebase.auth().currentUser,
      showForm: true,
      showAccountBlock: false,
      welcomeMessage: true,
      inviteAdmin: "",
      form: {
        companyName: "",
        attentionOf: "",
        address: "",
        postalCode: "",
        city: "",
        country: ""
      },
      userInfo: {},
      accountInfo: {}
    };
  },
  created: function() {
    this.getUser();
  },
  methods: {
    sendInvite: async function() {
      if (this.accountInfo == {}) {
        return;
      }
      if (
        Object.keys(this.accountInfo.admins).length >= this.accountInfo.maxUsers
      ) {
        return alert("max admins reached");
      }
      //get inputValueue
      let inputValue = this.inviteAdmin;
      // check if inputValueue is owner
      if (inputValue == this.user.email) {
        return alert("You cannot invite yourself");
      }
      let user = this.user;
      let accountId = this.accountInfo.accountId;
      // update db account

      // check if user exist
      const userCheck = await db .collection("users") .where("email", "==", inputValue) .get();
      // add user if none
      const inviteRef = db.collection("invites");
      let ref;
      let id;
      let name = null;
      // to add to accounts admins obj
      if (userCheck.empty) {
        let inv = await inviteRef.add({ email: inputValue, name: null }); //gets more stuff added
        console.log("temp user =>", inv);
        ref = inviteRef.doc(inv.id);
        id = inv.id;
      } else {
        let u = userCheck.docs[0];
        console.log("user =>", userCheck.docs[0].id);

        ref = inviteRef.doc(u.id);
        id = u.id;
        name = u.data().fullName;
      }
      console.log("hey");

      const accountRef = db.collection("accounts").doc(accountId);

      try {
        await db.runTransaction(async transaction => {
          console.log("ref  ", ref, "id  ", id, "name  ", name);
          let str = "admins." + id;
          // make admins object for /accounts
          let obj = { email: inputValue, name: name };
          transaction.update(accountRef, { [str]: obj });

          // userObj.admin[accountId] = {name: this.accountInfo.accountName, isPremium: true} //can be better
          let userStr = "admin." + accountId;
          transaction.update(ref, {
            [userStr]: { name: this.accountInfo.accountName, isPremium: true, created: new Date() },
            ...userObj
          });

          this.getUser();
          alert("user invited");
        });
      } catch (e) {
        console.log("transaction failed", e);
        alert("transaction failed", e);
        db.collection("invites")
          .doc(id)
          .delete();
      }
    },
    dateFromTimestamp: function(date) {
      if (date == undefined) {
        return null;
      }
      date = date.toDate();
      return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    },
    subscribe: async function() {
      var date = new Date();
      let newDate = new Date().setDate(date.getDate() + 5); // TRIAL ONLY!
      let invoice = this.form;
      // TODO: ask if info is correct, else show form. If info is changed set full doc. Else update doc
      let obj = {
        accountName: this.form.companyName,
        accountOwner: this.user.uid,
        subscription: "Free Trial", //TODO: make dynamic
        maxUsers: 3,
        admins: {},
        created: date,
        invoice: invoice,
        premium: true,
        premiumEnd: new Date(newDate)
      };
      const accountRef = db.collection("accounts");
      // createAccount

      let accountId;
      if ("accountId" in this.userInfo) {
        accountId = this.userInfo.accountId;
        // if account exist then update with part of obj
        let accountDoc = await accountRef.doc(accountId).update({
          accountName: obj.accountName,
          maxUsers: 4,
          invoice: invoice,
          premium: true,
          premiumEnd: new Date(newDate)
        });
        console.log("accountDoc updated => ", accountDoc);
      } else {
        //else create account
        let accountDoc = await accountRef.add(obj);
        obj.admins[this.user.uid] = {
          name: this.userInfo.fullName,
          email: this.user.email
        };
        console.log("accountDoc added => ", accountDoc);
        accountId = accountDoc.id;
      }

      //make 'admin' object for accountholder/user
      let userObj = { accountId: accountId, accountName: obj.accountName }; //accountDoc.name?
      let userStr = "admin." + accountId;
      // update user
      const userRef = db.collection("users").doc(this.user.uid);
      let userDoc = await userRef.update({
        [userStr]: { name: obj.accountName, isPremium: true },
        ...userObj
      });
      console.log("userdoc => ", userDoc);

      this.getUser();
    },

    getUser: async function() {
      var userId = this.user.uid;
      // get user with id
      const userRef = db.collection("users").doc(userId);
      let userDoc = await userRef.get();
      console.log("userdoc => ", userDoc);
      if (!userDoc.exists) {
        return alert("no user with param id");
      } else {
        this.userInfo = userDoc.data();
      }
      let usr = userDoc.data();
      if (usr.accountId) {
        this.getAccount(usr.accountId);
        this.showForm = false;
        this.showAccountBlock = true;
      } else {
        alert("no account in user profile");
      }
    },

    getAccount: async function(accountId) {
      console.log(accountId);
      // get account if any TODO based on IF account ELSE do something with form
      if (accountId !== "") {
        const accountRef = db.collection("accounts").doc(accountId);
        let accountDoc = await accountRef.get();
        console.log("accountDoc => ", accountDoc);
        this.accountInfo = accountDoc.data();
        this.accountInfo["accountId"] = accountDoc.id;
      } else {
        return alert("account not found in /accounts");
      }
    }
  },
  name: "Home"
};
</script>
