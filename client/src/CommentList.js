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