<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <VideoUpload/>
</template>

<script>
import VideoUpload from './components/VideoUpload.vue';

export default {
  name: 'App',
  components: {
    VideoUpload,
}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
