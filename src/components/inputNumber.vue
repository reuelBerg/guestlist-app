<template>
  <div class="">
<!-- <span v-text="items"></span>    <v-layout row no-wrap align-center v-for="(option, key, index) in items" :key="key" class="">
      <span id="changeMe" class="pr-2 title" style="width:30%; min-width:100px;">{{key}}</span>
      <input  class="grey pa-1 title" style="width:50px"  :value="items[key]"></input>
      <v-btn small icon  color="teal" @click="$el.changeMe = 'hoi'"><v-icon>chevron_left</v-icon></v-btn>
      <v-btn small icon color="teal" @click="toParent(key)"><v-icon>chevron_right</v-icon></v-btn>

    </v-layout> -->

  </div>

</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

<script scoped>
import firebase from 'firebase'
export default {
  props: ['options'],
  data () {
    return {
      items: {}
    }
  },
  methods: {
    toParent: function (key) {
       this.items[key]++
      console.log('send event!');
      return this.$emit('updateOptions', this.options)
    }
  },
  created: function () {
    var option;
    for (option in this.options) {
this.items[option]  = this.options[option]  }
  },
  name: 'Home'
}
</script>
