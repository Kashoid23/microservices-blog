const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');

const { Post } = require('./src/models/post');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const handleEvent = async (type, data) => {
    if (type === 'PostCreated') {
        const { id, title } = data;

        const existingPost = await Post.findOne({ id });

        if (!existingPost) {
            const newPost = Post.build({ id, title });

            await newPost.save();
        }
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;

        const post = await Post.findOne({ id: postId });

        if (post) {
            const existingComment = post.comments.find(comment => comment.id === id);

            if (!existingComment) {
                post.comments.push({ id, content, status });
                await post.save();
            }
        }
    }

    if (type === 'CommentUpdated') {
        const { id, postId, status } = data;
        const post = await Post.findOne({ id: postId });

        if (post) {
            const comment = post.comments.find(comment => comment.id === id);

            if (comment) {
                comment.status = status;
                await post.save();
            }
        }
    }
};

app.get('/posts', async (req, res) => {
    const posts = await Post.find({});

    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send({});
});

const start = async () => {
    try {
        await mongoose.connect('mongodb://query-mongo-service:27017/query');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error);
    }

    app.listen(4002, () => {
        console.log('Listening on 4002');

        axios.get('http://event-bus-service:4005/events').then((res) => {
            for (let event of res.data) {
                console.log('Processing event:', event.type);
                handleEvent(event.type, event.data);
            }
        }).catch((err) => {
            console.log('Error fetching events from Event Bus', err.message);
        });
    });
};

start();
