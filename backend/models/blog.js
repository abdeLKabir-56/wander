const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for the post
const postSchema = new Schema({
    title: {
        type: String,
        trim: true,
        maxlength: 100,
    },
    body: {
        type: String,
        maxlength: 5000
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user', // Reference to the User model
    },
    imageUrl: { type: String } ,
    likes: [{ type: Schema.Types.ObjectId, ref: 'user' }], // Array of user IDs who liked the post
    dislikes: [{ type: Schema.Types.ObjectId, ref: 'user' }], // Array of user IDs who disliked the post
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment' // Reference to the Comment model
    }]
}, {
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
});

// Create the Post model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
