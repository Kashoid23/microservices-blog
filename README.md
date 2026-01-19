# Section 1

<kbd><img width="1288" height="213" alt="Screenshot 2026-01-14 at 21 16 55" src="https://github.com/user-attachments/assets/d7136881-5af7-4627-8c8b-1002cb9347c2" /></kbd>
<kbd><img width="1340" height="542" alt="Screenshot 2026-01-14 at 21 13 28" src="https://github.com/user-attachments/assets/2baa1ae7-0a06-48ac-8c8c-900d8442b3e5" /></kbd>


## Posts service

```
mkdir posts
cd posts
npm init -y
npm install express cors nodemon
touch index.js
```

#### posts/index.js

```
const express = require('express');
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

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
npm install express cors nodemon
touch index.js
```

#### comments/index.js

```
const express = require('express');
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];
    comments.push({ id: commentId, content });
    commentsByPostId[req.params.id] = comments;

    res.status(201).send(comments);
});

app.listen(4001, () => {
    console.log('Listening on 4001');
});
```

#### comments/package.json

```
  "scripts": {
    "start": "nodemon index.js"
  },
```

```
npm start
```

## Client

```
npx create-react-app client
npm install axios
```

#### client/src/index.js

```
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### client/public/index.html

```
  <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
  </head>
```

#### client/src/App.js

```
import React from "react";
import PostCreate from "./PostCreate";
import PostList from "./PostList";

export default function App() {
    return (
        <div className="container">
            <h1>Create Post</h1>
            <PostCreate />
            <hr />
            <h1>Posts</h1>
            <PostList />
        </div>
    );
}
```

#### client/src/PostCreate.js

```
import React, { useState } from "react";
import axios from "axios";

export default function PostCreate() {
    const [title, setTitle] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:4000/posts', { title });
        setTitle("");
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label htmlFor="title">Title</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} type="text" id="title" className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}
```

#### client/src/PostList.js

```
import React, { useEffect, useState } from "react";
import axios from "axios";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

export default function PostList() {
    const [posts, setPosts] = useState({});

    const fetchPosts = async () => {
        const res = await axios.get('http://localhost:4000/posts');
        setPosts(res.data);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="d-flex flex-row flex-wrap justify-content-between">
            {Object.values(posts).map(({ id, title }) => (
                <div key={id} className="card" style={{ width: '49%', marginBottom: '20px' }}>
                    <div className="card-body">
                        <h3>{title}</h3>
                        <CommentList postId={id} />
                        <CommentCreate postId={id} />
                    </div>
                </div>
            ))}
        </div>
    );
}
```

#### client/src/CommentList.js

```
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CommentList({ postId }) {
    const [comments, setComments] = useState([]);

    const fetchComments = async () => {
        const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`);
        setComments(res.data);
    };

    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <ul>
            {Object.values(comments).map(({ id, content }) => (
                <li key={id}>{content}</li>
            ))}
        </ul>
    );
}
```

#### client/src/CommentCreate.js

```
import React, { useState } from "react";
import axios from "axios";

export default function CommentCreate({ postId }) {
    const [content, setContent] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`http://localhost:4001/posts/${postId}/comments`, { content, postId });
        setContent("");
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label htmlFor="content">New Comment</label>
                    <input value={content} onChange={e => setContent(e.target.value)} type="text" id="content" className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}
```

```
npm start
```

# Section 3

## Dockerizing the Posts service

```
cd posts
touch Dockerfile
touch .dockerignore
```

#### posts/.dockerignore

```
node_modules
```

#### posts/Dockerfile

```
FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "start"]
```

```
docker build -t kashoid/blog-posts .
docker run kashoid/blog-posts
docker ps
```

# Section 4

## Orchestrating Collections of Services with Kubernetes

```
kubectl version
```

```
cd posts
docker build -t kashoid/blog-posts .
mkdir infra
cd infra
mkdir k8s
cd k8s
touch posts-deployment.yaml
```

#### posts/infra/k8s/posts-deployment.yaml

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: posts-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: posts
  template:
    metadata:
      labels:
        app: posts
    spec:
      containers:
        - name: posts
          image: kashoid/blog-posts
```

```
kubectl apply -f posts-deployment.yaml
kubectl get deployments
kubectl get pods
```

## To apply new code changes

```
docker build -t kashoid/blog-posts .
docker push kashoid/blog-posts
kubectl rollout restart deployment posts-deployment
```