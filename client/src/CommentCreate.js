import React, { useState } from "react";
import axios from "axios";

export default function CommentCreate({ postId }) {
    const [content, setContent] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        axios.post(`http://blog.com/posts/${postId}/comments`, { content, postId }).catch((err) => {
            console.log('Error creating comment', err.message);
        });
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