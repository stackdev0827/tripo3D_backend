const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const TRIPO3D_API_KEY = process.env.TRIPO3D_API_KEY || 'tsk_YxFjtE0_S_kCNejdlyRKEWzg0OxdJRqlRKBPejUB_pd';
const TRIPO3D_API_URL = 'https://api.tripo3d.ai/v2/openapi/upload';
const TRIPO3D_TASK_URL = 'https://api.tripo3d.ai/v2/openapi/task';

const uploadToTripo3D = async (filePath, originalname, mimetype) => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath), {
    filename: originalname,
    contentType: mimetype,
  });

  const response = await axios.post(TRIPO3D_API_URL, formData, {
    headers: {
      Authorization: `Bearer ${TRIPO3D_API_KEY}`
    },
  });
  return response.data.data.image_token;
};

const createTripo3DTask = async (imageToken, fileType) => {
  const data = {
    type: 'image_to_model',
    file: {
      type: fileType,
      file_token: imageToken
    }
  };

  const response = await axios.post(TRIPO3D_TASK_URL, JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TRIPO3D_API_KEY}`
    },
  });

  return response.data.data.task_id;
};

module.exports = {
  uploadToTripo3D,
  createTripo3DTask
}; 