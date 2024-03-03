const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: String,
    username: String,
    name: Object,
    email: Object,
    bio: String,
    image: Object
});

const User = mongoose.model('User', userSchema);
module.exports = User;
