const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const { upload } = require('../config/multerConfig');
const { uploadDir } = require('../config/multerConfig');
const fs = require('fs');
const axios = require('axios');

router.post("/createProject", upload.single('avatar'), async (request, response) => {
  try {
    console.log(request.body);
    let avatarUrl = null;
    let downloadUrl = null;

    // If file was uploaded successfully, create the URL
    if (request.file) {
      avatarUrl = `/uploads/${request.file.filename}`;
    }

    // If download URL is provided, download the file
    if (request.body.downloadUrl) {
      try {
        const fileName = `download-${Date.now()}${path.extname(request.body.downloadUrl)}`;
        const filePath = path.join(uploadDir, fileName);
        
        const response = await axios({
          method: 'get',
          url: request.body.downloadUrl,
          responseType: 'stream'
        });

        await new Promise((resolve, reject) => {
          const writer = fs.createWriteStream(filePath);
          response.data.pipe(writer);
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        downloadUrl = `/uploads/${fileName}`;
      } catch (downloadError) {
        console.error('Download error:', downloadError);
        // Continue with project creation even if download fails
      }
    }
    
    const createProject = new Project({
      id: request.body.id,
      projectName: request.body.name,
      description: request.body.description,
      avatar: avatarUrl,
      downloadUrl: downloadUrl,
      state: 0
    });

    await createProject.save();
    response.json({
      message: "Project created successfully",
      project: createProject
    });
  } catch (error) {
    console.log(error);
    response.json({
      message: "Failed to create project",
      error: error.message
    });
  }
});

router.post("/getproject", async(request, response) => {
  try {
    const data = await Project.find();
    if(data) {
      console.log(data)
      response.json(data);
    }
  } catch (error) {
    console.log(error);
    response.json(error);
  }
});

module.exports = router; 