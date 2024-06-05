const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const categorieSchema = new Schema({
    Description: {
        type: String,
        default: ''
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
});

module.exports = mongoose.model('Categorie', categorieSchema);
