<template>
  <br/><br/><br/><br/>
  <div>
    <form @submit.prevent="onUpload">
      <!-- Safari doesn't recognise mp4 or m4v files as videos -->
      <input 
        class='upload'
        type="file" 
        accept="video/mp4,video/x-m4v,video/*" 
        @change="onFileSelected">
      <button class='upload' type="submit">Upload</button>
    </form>
  </div>
  <br/><br/>
  <div>
    <h1>Your link will appear below</h1>
    <br/>
    <h2 id="link">{{ linkText }}</h2>
  </div>
</template>

<script>
import axios from 'axios';
// get domain name from Vue project config file
import config from '@/../config';

export default {
  name: 'VideoUpload',
  data() {
    return {
      selectedFile: null,
      linkText: ''
    };
  },
  methods: {
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
    },
    async onUpload() {
      try {
        const filename = this.selectedFile.name;
        const filetype = filename.slice(filename.lastIndexOf('.'));
        const videoName = await axios.get(`${config.API_DOMAIN}api/generate-upload-url`);

        // so data can be posted to the back-end when calling function to upload
        const formData = new FormData();
        formData.append('videoName', videoName.data.uploadURL);
        formData.append('filetype', filetype);
        // Need to convert data to a blob so that it can be posted
        const fileBlob = new Blob([this.selectedFile]);
        formData.append('video', fileBlob);

        this.linkText = 'Uploading video...';
        const uploadResponse = await axios.post(`${config.API_DOMAIN}api/upload-video`, formData);

        if (uploadResponse.status === 200) {
          this.linkText = `${config.API_DOMAIN}` + videoName.data.uploadURL + filetype;
        } else {
          this.linkText = 'Upload failed';
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.upload {
  background-color: rgba(51, 51, 51, 0.05);
  border-radius: 8px;
  border-width: 0;
  color: #333333;
  cursor: pointer;
  display: inline-block;
  font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  list-style: none;
  margin: 0;
  padding: 10px 12px;
  text-align: center;
  transition: all 200ms;
  vertical-align: baseline;
  white-space: nowrap;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}
</style>
