<template>
  <v-layout row justify-center>
  <v-card  dark class="ma-3 pa-4 barcolor" style="max-width:500px; ">

  <v-container >
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center >
        <h2 class="headline">Welcome!</h2>
        <h4 class="subheader">Are you on the list?</h4>
<br>
<v-text-field style="text-align:center;" v-model="email" label="email"></v-text-field>
<v-text-field style="text-align:center;" v-model="password" label="password" type="password"></v-text-field>

<v-btn small  @click="signIn" color="primary " >log in</v-btn>
<a @click.stop.prevent="resetDialog = true" class="primary--text text--darken-4">I forgot my password</a>
<v-divider  class="mt-3"></v-divider>
<div style="border: 1px dashed lightgrey; padding: 5px; border-radius: 3px; text-align:center; color:lightgrey">

<h2 class="headline grey--text text--lighten-4">New?</h2>

<h4 class="subheading grey--text text--lighten-4">Please <router-link class="font-weight-medium " to="/signup">sign up</router-link>
 up first!</h4>
</div>


      </v-layout>
    </v-slide-y-transition>
  </v-container>
</v-card>
<v-dialog v-model="resetDialog" persistent max-width="320" >
  <v-card dark class="barcolor pa-4">
    <v-card-title class="headline font-weight-bold">Reset password?</v-card-title>
    <v-card-text>This will send a 'password reset' email to <span class="pink--text text--darken-1">{{email}}</span> </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="white " flat @click.native="resetDialog = false">cancel</v-btn>
      <v-btn outline color="white" flat @click.native="resetDialog = false;  ">Send email</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
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
      password: '',
      resetDialog: false
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
