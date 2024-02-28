const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: String,
    username: String,
    email: String,
    password: String,
    bio: String
});

const User = mongoose.model('User', userSchema);
module.exports = User;
