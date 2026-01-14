## Client

```
npx create-react-app client
```

## Posts service

```
mkdir posts
cd posts
npm init -y
npm install express cors axios nodemon
touch index.js
```

#### posts/index.js

```
const express = require('express');
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id, title
    };

    res.status(201).send(posts[id]);
});

app.listen(4000, () => {
    console.log('Listening on 4000');
});
```

#### posts/package.json

```
  "scripts": {
    "start": "nodemon index.js"
  },
```

```
npm start
```

## Comments service

```
mkdir comments
cd comments
npm init -y
npm install express cors axios nodemon
```
