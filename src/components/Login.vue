<template>
  <v-layout row justify-center>
  <v-card   class="ma-4" style="max-width:500px; ">

  <v-container >
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <h2 class="headline">Welcome!</h2>
        <h4 class="subheader">Log in and get going!</h4>

<v-text-field v-model="email" placeholder="email"></v-text-field>
<v-text-field v-model="password" placeholder="password" type="password"></v-text-field>

<v-btn small  @click="signIn" color="cyan" >submit</v-btn>

<v-divider  class="mt-3"></v-divider>
<div style="border: 1px dashed lightgrey; padding: 5px; border-radius: 3px; text-align:center; color:lightgrey">

<h2 class="headline ">New?</h2>

<h4 class="subheader">Please <router-link class="or--text cyan--text" to="/signup">sign up</router-link>
 up first.</h4>
</div>


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

export default {
  data () {
    return {
      email: 'tt@test.nl',
      password: ''
    }
  },
  methods: {
    signIn: function () {
      var d = this;
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(function (user) {
      d.$router.replace('/dashboard')
      }, function (err) {
      alert('Oops ' + err)
      })
    }

  },
  name: 'Login'
}
</script>
