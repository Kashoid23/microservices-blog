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

#### [Update posts/index.js](https://github.com/Kashoid23/microservices-nodejs-react/blob/4084f7f8f1ee4a951dcebe89d0537be52e58d910/posts/index.js)

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

#### [Update comments/index.js](https://github.com/Kashoid23/microservices-nodejs-react/blob/4084f7f8f1ee4a951dcebe89d0537be52e58d910/comments/index.js)

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

#### client/public/index.html

```
  <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
  </head>
```

#### [Update client/src/index.js](https://github.com/Kashoid23/microservices-nodejs-react/blob/4084f7f8f1ee4a951dcebe89d0537be52e58d910/client/src/index.js)

#### [Update client/src/App.js](https://github.com/Kashoid23/microservices-nodejs-react/blob/4084f7f8f1ee4a951dcebe89d0537be52e58d910/client/src/App.js)

#### [Create client/src/PostCreate.js](https://github.com/Kashoid23/microservices-nodejs-react/blob/4084f7f8f1ee4a951dcebe89d0537be52e58d910/client/src/PostCreate.js)

#### [Create client/src/PostList.js](https://github.com/Kashoid23/microservices-nodejs-react/blob/4084f7f8f1ee4a951dcebe89d0537be52e58d910/client/src/PostList.js)

#### [Create client/src/CommentList.js](https://github.com/Kashoid23/microservices-nodejs-react/blob/4084f7f8f1ee4a951dcebe89d0537be52e58d910/client/src/CommentList.js)

#### [Create client/src/CommentCreate.js](https://github.com/Kashoid23/microservices-nodejs-react/blob/4084f7f8f1ee4a951dcebe89d0537be52e58d910/client/src/CommentCreate.js)

```
npm start
```

# Section 2

Communication strategies between services
- sync (communicate with each other using direct requests)
- async (communicate with each other using events, e.g. Event Bus or Event Broker)

Ready to go Event Bus solutions - RabbitMQ, Kafka, NATS…

#### [Create event-bus/index.js](https://github.com/Kashoid23/microservices-nodejs-react/blob/d5e047583d17c326fb1c9707df750e74aee76ae8/event-bus/index.js)

#### [Update posts/index.js](https://github.com/Kashoid23/microservices-nodejs-react/blob/d5e047583d17c326fb1c9707df750e74aee76ae8/posts/index.js)

#### [Update query/index.js](https://github.com/Kashoid23/microservices-nodejs-react/blob/d5e047583d17c326fb1c9707df750e74aee76ae8/query/index.js)

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

#### [Create posts/.dockerignore](https://github.com/Kashoid23/microservices-nodejs-react/blob/1125425fa2b893ea71f50ada2b226b2bbc96a0ec/query/.dockerignore)

#### [Create posts/Dockerfile](https://github.com/Kashoid23/microservices-nodejs-react/blob/1125425fa2b893ea71f50ada2b226b2bbc96a0ec/query/Dockerfile)

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

#### [Create infra/k8s/posts-deployment.yaml](https://github.com/Kashoid23/microservices-nodejs-react/blob/master/infra/k8s/posts-deployment.yaml)

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

## Types of Kubernetes Services

- <b>Cluster IP</b> - exposes pods inside the cluster, communication between different microservices
- <b>Node Port</b> - accessible from outside the cluster, for testing, demo environments, or situations where you have your own external load-balancing solution and want traffic routed to your Nodes
- <b>Load Balancer</b> - accessible from outside the cluster, the standard way to expose public-facing, production applications on a cloud platform
- <b>External Name</b> - for referencing external services (like a database hosted outside of Kubernetes) using a consistent internal service name

```
cd infra/k8s
touch posts-service.yaml
```

#### [infra/k8s/posts-service.yaml](https://github.com/Kashoid23/microservices-nodejs-react/blob/eeb39fe39d0088298f3c70543c7a27b8f2f41284/infra/k8s/posts-service.yaml)

```
kubectl apply -f posts-service.yaml
kubectl get services
```

#### Test access to the services

```
kubectl port-forward service/posts-service 4000:4000
```

1. kubectl opens a tunnel

```
No NodePort
No Ingress
No VM networking
No firewall rules
```

2. Traffic flow

```
Postman / Browser
↓
localhost:4000
↓
kubectl (port-forward)
↓
Kubernetes API Server
↓
Service: posts-service
↓
Pod IP: 10.244.1.9:4000
↓
Node.js app
```

## Installing Ingress-NGINX

- <b>Ingress Resource</b> - Kubernetes API object that defines the rules for routing external HTTP/HTTPS traffic to services inside the cluster. This defines paths, hostnames, and routing rules.
- <b>Ingress Controller</b> - a piece of software responsible for implementing and managing the Ingress resource by processing and applying the rules defined in it. It typically functions as a reverse proxy or load balancer.

<img width="1440" height="558" alt="K80I4gN" src="https://github.com/user-attachments/assets/46be8502-ec20-4115-a6a8-afe5b4dccacb" />

```
https://kubernetes.github.io/ingress-nginx/deploy/#docker-desktop
```

#### [Create infra/k8s/ingress-service.yaml](https://github.com/Kashoid23/microservices-nodejs-react/blob/8db82f135c803bbcb505d69bae8f210261167c76/infra/k8s/ingress-service.yaml)

```
kubectl apply -f ingress-service.yaml
```

```
sudo nano /etc/hosts
```

#### /etc/hosts

```
...

127.0.0.1 blog.com
```

```
docker build -t kashoid/blog-client .
docker push kashoid/blog-client
```

Replace localhost:400X with blog.com for React components

#### [Create infra/k8s/client-deployment.yaml](https://github.com/Kashoid23/microservices-nodejs-react/blob/8db82f135c803bbcb505d69bae8f210261167c76/infra/k8s/client-deployment.yaml)

#### [Create infra/k8s/client-service.yaml](https://github.com/Kashoid23/microservices-nodejs-react/blob/8db82f135c803bbcb505d69bae8f210261167c76/infra/k8s/client-service.yaml)

```
kubectl apply -f client-deployment.yaml
kubectl apply -f client-service.yaml
```

```
kubectl describe ingress ingress-service
```

## Introducing Skaffold

<b>Skaffold</b> is a command line tool that facilitates continuous development for container based & Kubernetes applications. Skaffold handles the workflow for building, pushing, and deploying your application, and provides building blocks for creating CI/CD pipelines.

```
https://skaffold.dev
```

#### [Create skaffold.yaml](https://github.com/Kashoid23/microservices-nodejs-react/blob/59534cb54a4562b92ef7e9fafc3b3191daedf55d/skaffold.yaml)

```
skaffold dev
```
