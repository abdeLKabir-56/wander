const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['admin', 'user']
    },
    name: {
        type: Object,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    bio: String,
    image: {
        type: Object,
        required: false
    },
    banned :{
        type: Boolean,
        default: false
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

module.exports = mongoose.model('User', userSchema);
