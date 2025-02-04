const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB; 