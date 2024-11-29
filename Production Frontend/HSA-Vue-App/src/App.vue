<template>
<the-header></the-header>

 <router-view></router-view>

 <the-footer></the-footer>
</template>

<script>



import TheHeader from './components/layouts/TheHeader.vue'
import TheFooter from './components/layouts/TheFooter.vue'
export default {
  name: 'App',
  components: {TheHeader,
    TheFooter
    
  },
 async created(){
  
 this.$store.dispatch('auth/tryLogin');
  
 
  }
}
</script>

<style>
body{
  text-align: center;
  margin: 0;
  padding:0;
  box-sizing: border-box;
}
#app {
  min-height: 100vh;
}

the-header {
  min-height: 4rem;
}


the-footer {
  min-height: 4rem;
}


/* The article fills all the space between header & footer */

#app {
  display: flex;
  flex-direction: column;
}

</style>
