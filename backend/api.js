const express = require('express');
// middleware to allow routing between front and back ends
const formidable = require('express-formidable');
const router = express.Router();

// use middleware to interface with front-end
router.use(formidable());

const { generateUploadURL, uploadVideo } = require('./BucketHandler');

router.get('/generate-upload-url', async (req, res) => {
  const uploadURL = await generateUploadURL();
  res.json({ uploadURL });
});

router.post('/upload-video', async (req, res) => {
  const { videoName, filetype } = req.fields;
  const video = req.files.video;
  const name = await uploadVideo(videoName, filetype, video);
  res.json({ name });
})

module.exports = router;