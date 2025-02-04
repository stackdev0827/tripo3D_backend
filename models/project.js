const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    id : String,
    projectName: String,
    description: String,
    avatar: String,
    downloadUrl: String,
    state: Number,
    uploadDate: { type: Date, default: Date.now },
});

const Project = mongoose.model('Project', fileSchema);

module.exports = Project;