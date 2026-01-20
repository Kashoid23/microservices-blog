const express = require('express');
const bodyParser = require('body-parser')
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.get('/events', (req, res) => {
    res.send(events);
});

app.post('/events', (req, res) => {
    const event = req.body;

    events.push(event);

    axios.post('http://posts-service:4000/events', event).catch((err) => {
        console.log('Error forwarding event to Posts Service', err.message);
    });
    axios.post('http://comments-service:4001/events', event).catch((err) => {
        console.log('Error forwarding event to Comments Service', err.message);
    });
    axios.post('http://query-service:4002/events', event).catch((err) => {
        console.log('Error forwarding event to Query Service', err.message);
    });
    axios.post('http://moderation-service:4003/events', event).catch((err) => {
        console.log('Error forwarding event to Moderation Service', err.message);
    });

    res.send({ status: 'OK' });
});

app.listen(4005, () => {
    console.log('Listening on 4005');
});
