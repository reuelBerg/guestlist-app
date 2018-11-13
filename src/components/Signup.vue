<template>
  <v-layout row justify-center>
  <v-card   dark class="ma-3 pa-4 barcolor darken-2" style="min-width:300px; width:40%" >

  <v-container >
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <h2 class="headline">Sign up</h2>
        <h4 style="max-width: 60%; text-align:center;" class="subheader mb-2">Please register your account or <router-link :to="{ name: 'login' }">log in</router-link> here</h4>


<v-text-field v-model="email" label="your email"></v-text-field>
<v-text-field v-model="firstName" label="first name"></v-text-field>
<v-text-field v-model="lastName" label="last name"></v-text-field>

<v-text-field v-model="password" label="create password" type="password"></v-text-field>
<v-text-field v-model="passwordCheck" label="verify password" type="password"></v-text-field>

<v-btn small  @click.prevent="signUp" color="primary" >sign up</v-btn>
<span class="red--text" >{{err}}</span>

      </v-layout>
    </v-slide-y-transition>
  </v-container>
</v-card>
</v-layout>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input {
  background: lightgrey;
  border-radius:4px;
}
</style>

<script scoped>
import firebase from 'firebase'
import { db } from "../main";

export default {
  data () {
    return {
      fakeCounterEmail: 0,
      email: 'tt@test.nl',
firstName: '',
lastName: '',
      password: 'wwwxxx',
    passwordCheck: '' ,
  err: ''   }
  },
  methods: {
    signUp: function () {
      //check if password match
      this.err = ''
      if (this.password != this.passwordCheck) {
        this.err = 'Passwords do not match!'
        return
      }
      // if OK create users auth
      var d = this;
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then( async function (doc) {
        alert('user created! ' + doc.user.uid);
        let firstName = d.firstName.charAt(0).toUpperCase() + d.firstName.slice(1);
        let lastName = d.lastName.charAt(0).toUpperCase() + d.lastName.slice(1);
        let fullName = firstName + ' ' + lastName
        let email = d.email
        let obj = {firstName, lastName, fullName, email}
        // if auth set user obj in db
        await db.collection('users').doc(doc.user.uid).set(obj)
        d.$router.replace('/dashboard')

      }, function (err) {
        alert(err);
        d.response = err;
      })
    }
  },
  name: 'Signup'
}
</script>
