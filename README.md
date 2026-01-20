# Section 1

Data management between services is the big problem of microservices

Database-Per-Service pattern
- we want to run each service independently
- DB schema/structure might change unexpectedly 
- different types of DB’s (SQL VS NoSQL)

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

# Section 2

Communication strategies between services
- sync (communicate with each other using direct requests)
- async (communicate with each other using events, e.g. Event Bus or Event Broker)

Ready to go Event Bus solutions - RabbitMQ, Kafka, NATS…

#### event-bus/index.js

```
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

    axios.post('http://localhost:4000/events', event).catch((err) => {
        console.log('Error forwarding event to Posts Service', err.message);
    });
    axios.post('http://localhost:4001/events', event).catch((err) => {
        console.log('Error forwarding event to Comments Service', err.message);
    });
    axios.post('http://localhost:4002/events', event).catch((err) => {
        console.log('Error forwarding event to Query Service', err.message);
    });
    axios.post('http://localhost:4003/events', event).catch((err) => {
        console.log('Error forwarding event to Moderation Service', err.message);
    });

    res.send({ status: 'OK' });
});

app.listen(4005, () => {
    console.log('Listening on 4005');
});
```

#### posts/index.js

```
const express = require('express');
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

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

    axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: { id, title }
    }).catch((err) => {
        console.log('Error sending event to Event Bus', err.message);
    });

    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log('Received Event:', req.body.type);

    res.send({});
});

app.listen(4000, () => {
    console.log('Listening on 4000');
});
```

#### query/index.js

```
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    if (type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        if (post) {
            post.comments.push({ id, content, status });
        }
    }

    if (type === 'CommentUpdated') {
        const { id, postId, status } = data;
        const post = posts[postId];
        if (post) {
            const comment = post.comments.find(comment => comment.id === id);
            if (comment) {
                comment.status = status;
            }
        }
    }
};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send({});
});

app.listen(4002, () => {
    console.log('Listening on 4002');

    axios.get('http://localhost:4005/events').then((res) => {
        for (let event of res.data) {
            console.log('Processing event:', event.type);
            handleEvent(event.type, event.data);
        }
    }).catch((err) => {
        console.log('Error fetching events from Event Bus', err.message);
    });
});
```

# Section 3

- <b>Docker</b> is an open-source platform for developing, shipping, and running applications in isolated environments called containers.
- <b>Build</b> - process of creating a Docker Image from instructions in a Dockerfile.
- <b>Image</b> - a read-only template (blueprint) that contains the application, libraries, dependencies, and configuration needed to run an application.
- <b>Container</b> - a runnable, isolated instance of a Docker Image

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

- <b>Kubernetes</b> is an open-source platform for automating the deployment, scaling, and management of containerized applications
- A <b>Kubernetes Cluster</b> is a set of physical or virtual machines, called <b>Nodes</b>, that are grouped together to run and manage (with program called Master) containerized applications.
- <b>Pod</b> is the smallest unit in Kubernetes, a logical wrapper for one or more tightly-grouped containers sharing resources (like storage/network) that run on a single node within the cluster, acting as a single application instance.
- <b>Deployment</b> - monitors a set of pods, make sure they are running and restarts them if they crash
- <b>Service</b> - provides an easy to remember URL to access a running container

## Orchestrating Collections of Services with Kubernetes Deployments

```
kubectl version
```

```
mkdir infra
cd infra
mkdir k8s
cd k8s
touch posts-deployment.yaml
```

#### infra/k8s/posts-deployment.yaml

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

#### To rebuild latest Docker Image, push to Docker Hub and apply for Kubernetes Deployments

```
docker build -t kashoid/blog-posts .
docker push kashoid/blog-posts
kubectl rollout restart deployment posts-deployment
```

## Types of Kubernetes Services:

- Cluster IP - exposes pods inside the cluster, communication between different microservices
- Node Port - accessible from outside the cluster, for testing, demo environments, or situations where you have your own external load-balancing solution and want traffic routed to your Nodes
- Load Balancer - accessible from outside the cluster, the standard way to expose public-facing, production applications on a cloud platform
- External Name - for referencing external services (like a database hosted outside of Kubernetes) using a consistent internal service name

```
cd infra/k8s
touch posts-service.yaml
```

#### infra/k8s/posts-service.yaml

```
apiVersion: v1
kind: Service
metadata:
  name: posts-service
spec:
  type: NodePort
  selector:
    app: posts
  ports:
    - name: posts
      protocol: TCP
      port: 4000
      targetPort: 4000
```

```
kubectl apply -f posts-service.yaml
kubectl get services
```