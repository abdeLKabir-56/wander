const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: ''
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    categorie : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorie'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    visitors: 
        {
            timestamp: {
                type: Date,
                default: Date.now
            },
            count: {
                type: Number,
                default: 0
            }
        }
    ,
    signaler :{
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('Post', postSchema);
