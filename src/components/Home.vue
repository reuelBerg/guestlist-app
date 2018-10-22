<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <h1 class="headline" style="text-align:center;">Welcome, this app is currently in BETA. It has full functionality but is still missing some awesome features. Bear with us!</h1>
<v-btn large class=" cyan mt-5" v-if="dashLink" @click="$router.replace('/dashboard')">Dashboard</v-btn>
<v-btn large class=" cyan mt-5" v-if="!dashLink" @click="$router.replace('/login')">Log In</v-btn>

      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

<script scoped>
import firebase from 'firebase'
export default {
  data () {
    return {
    }
  },
  computed: {
    dashLink: function() {
  let usr = firebase.auth().currentUser
  if (usr) {
    return true
  } else {return false }
  }
  },
  name: 'Home'
}
</script>
