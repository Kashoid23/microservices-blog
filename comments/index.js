const express = require('express');
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];
    comments.push({ id: commentId, content });
    commentsByPostId[req.params.id] = comments;

    axios.post('http://event-bus-service:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    }).catch((err) => {
        console.log('Error sending event to Event Bus', err.message);
    });

    res.status(201).send(comments);
});

app.post('/events', (req, res) => {
    console.log('Received Event:', req.body.type);

    if (req.body.type === 'CommentModerated') {
        const { id, postId, status, content } = req.body.data;
        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => {
            return comment.id === id;
        });

        if (comment) {
            comment.status = status;

            axios.post('http://event-bus-service:4005/events', {
                type: 'CommentUpdated',
                data: {
                    id,
                    postId,
                    content,
                    status
                }
            }).catch((err) => {
                console.log('Error sending event to Event Bus', err.message);
            });
        }
    }

    res.send({});
});

app.listen(4001, () => {
    console.log('Listening on 4001');
});
