const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Routes
app.use('/api', require('./routes/projectRoutes'));
app.use('/api', require('./routes/productRoutes'));
app.use('/api', require('./routes/fileRoutes'));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});