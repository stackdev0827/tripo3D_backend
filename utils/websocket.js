const WebSocket = require('ws');

const TRIPO3D_API_KEY = process.env.TRIPO3D_API_KEY || 'tsk_YxFjtE0_S_kCNejdlyRKEWzg0OxdJRqlRKBPejUB_pd';

const receiveOne = (tid) => {
  return new Promise((resolve, reject) => {
    const url = `wss://api.tripo3d.ai/v2/openapi/task/watch/${tid}`;
    const headers = {
      Authorization: `Bearer ${TRIPO3D_API_KEY}`
    };

    const ws = new WebSocket(url, { headers });

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        const status = data.data.status;
        if (status !== 'running' && status !== 'queued') {
          ws.close();
          resolve(data);
        }
      } catch (err) {
        console.log("Received non-JSON message:", message);
        ws.close();
        reject(err);
      }
    });

    ws.on('error', (err) => {
      reject(err);
    });
  });
};

module.exports = {
  receiveOne
}; 