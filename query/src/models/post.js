const e = require('express');
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
    comments: [
        {
            id: String,
            content: String,
            status: String
        }
    ]
});

postSchema.statics.build = (attrs) => {
	return new Post(attrs);
};

const Post = mongoose.model('Post', postSchema);

exports.Post = Post;
