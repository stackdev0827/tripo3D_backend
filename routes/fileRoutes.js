const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const mongoose = require("mongoose")
const Product = require("../models/product");
const { upload, uploadDir } = require('../config/multerConfig');
const { uploadToTripo3D, createTripo3DTask } = require('../services/tripo3dService');
const { receiveOne } = require('../utils/websocket');
const Project = require('../models/project');

router.post('/files', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log("files", req.file)

    const { projectId } = req.body

    const fileUrl = `/uploads/${req.file.filename}`;
    
    const imageToken = await uploadToTripo3D(req.file.path, req.file.originalname, req.file.mimetype);
    const taskId = await createTripo3DTask(imageToken, req.file.mimetype);

    const result = await receiveOne(taskId);

    console.log(result.data)

    const newProduct = new Product({
      id: projectId,
      projectName: "asasas",
      twoD: fileUrl,
      threeD: result.data.output.pbr_model
    });

    await newProduct.save()
    
    res.json({
      localFile: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      },
      tripo3dResponse: result.data
    });

  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ 
      error: 'Failed to upload file',
      details: error.message 
    });
  }
});

router.post('/projectbuild', async (req, res) => {
  try {
    console.log("project:", req.body)

    const fileUrl = `/uploads/${req.body.fileName}`;
    const filePath = `D:/work_space/Real Jobs/New folder/tripo3D_API_integration/backend/uploads/${req.body.fileName}`;
    
    const imageToken = await uploadToTripo3D(filePath, req.body.fileName, req.body.mimeType);
    const taskId = await createTripo3DTask(imageToken, req.body.mimeType);

    const result = await receiveOne(taskId);

    console.log(result.data)

    const newProduct = new Product({
      id: req.body.id,
      projectName: "asasas",
      twoD: fileUrl,
      threeD: result.data.output.pbr_model
    });

    await newProduct.save()
    
    res.json({
      tripo3dResponse: result.data
    });

  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ 
      error: 'Failed to upload file',
      details: error.message 
    });
  }
});

router.post('/setStatus', async (req, res) => {
  try {
    console.log(req.body.id)
    const updatedProject = await Project.findOneAndUpdate(
      { id: req.body.id, state: 0 }, // Find project with ID and status = 0
      { state: 1 }, // Update status to 1
    );

    if (!updatedProject) {
      return res.status(404).send({ message: 'Project not found or already updated' });
    }

    res.status(200).send({ message: 'Status updated successfully', updatedProject });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while updating the status' });
  }
})

router.delete('/files/:filename', (req, res) => {
  const filepath = path.join(uploadDir, req.params.filename);
  
  if (!filepath.startsWith(uploadDir)) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  fs.unlink(filepath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete file' });
    }
    res.json({ message: 'File deleted successfully' });
  });
});

module.exports = router; 