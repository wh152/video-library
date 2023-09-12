const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

const { downloadVideo } = require('./BucketHandler');

// Serve your Vue.js app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Parse JSON request bodies
app.use(bodyParser.json());

// Include API routes from api.js
const apiRoutes = require('./api');
app.use('/api', apiRoutes);

app.get('/:fileID', async (req, res) => {
    const { fileID } = req.params;

    // Check if fileID is a valid S3 object identifier
    if (/^[0-9a-f]{32}.*$/.test(fileID)) {
        const videoData = await downloadVideo(fileID);
        if (videoData != null) {
            // Download video as attachment
            res.setHeader('Content-Disposition', `attachment; filename=${fileID}`);
            res.end(videoData);
        } else {
            res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
        }
    }
})

app.get('/', (req, res) => {
    // serve uploading page for the site
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
