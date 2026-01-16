import React, { useEffect, useState } from "react";
import axios from "axios";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

export default function PostList() {
    const [posts, setPosts] = useState({});

    const fetchPosts = async () => {
        const res = await axios.get('http://localhost:4002/posts');
        setPosts(res.data);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="d-flex flex-row flex-wrap justify-content-between">
            {Object.values(posts).map(({ id, title, comments }) => (
                <div key={id} className="card" style={{ width: '49%', marginBottom: '20px' }}>
                    <div className="card-body">
                        <h3>{title}</h3>
                        <CommentList comments={comments} />
                        <CommentCreate postId={id} />
                    </div>
                </div>
            ))}
        </div>
    );
}