import React, { useState } from "react";
import axios from "axios";

export default function CommentCreate({ postId }) {
    const [content, setContent] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`http://comments-service:4001/posts/${postId}/comments`, { content, postId });
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