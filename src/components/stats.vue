<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center style="text-align:center;">
        <h1 class="headline">This is the stats page of <span>listconfig.name</span></h1>
<v-container fluid>
  <v-progress-circular
    :rotate="180"
    :size="100"
    :width="15"
    :value="listProgress * (100 / listTotal) "
    color="pink"
  >
    {{ listProgress }}/{{listTotal}}
</v-progress-circular>

<v-card class=" pa-3">
<h3>List Total </h3>
<!-- <v-avatar size="40" class="pink"><span>10</span></v-avatar> -->
  <v-progress-linear color="pink" :value="listProgress * (100 / listTotal)" ></v-progress-linear>


<span class="">List total </span><span class="pink--text">20</span> <br>
<span class="">Guests checked in </span><span class="pink--text">20</span> <br>
</v-card>
</v-container>

<h4 class="">Currently there is not much giong on here. Graphs and other realtime elements will be added soon.</h4>

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
      listTotal: 30,
      listProgress: 15,
    }
  },
  methods: {

  },
  name: 'Home'
}
</script>
