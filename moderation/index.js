const express = require('express');
const bodyParser = require('body-parser')
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    if (type === 'CommentCreated') {
        const { id, content, postId } = data;
        const status = content.includes('orange') ? 'rejected' : 'approved';

        axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
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

    res.send({});
});

app.listen(4003, () => {
    console.log('Listening on 4003');
});