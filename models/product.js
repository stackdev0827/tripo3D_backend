const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    id: String,
    projectName: String,
    twoD: String,
    threeD: String,
    state: Number,
    uploadDate: { type: Date, default: Date.now },
  });
  
const Product = mongoose.model('product', fileSchema);

module.exports = Product;