import React, { useState } from "react";
import axios from "axios";

export default function PostCreate() {
    const [title, setTitle] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        axios.post('http://blog.com/posts/new', { title }).catch((err) => {
            console.log('Error creating post', err.message);
        });
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