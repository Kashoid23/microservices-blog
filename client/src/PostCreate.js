import React, { useState } from "react";
import axios from "axios";

export default function PostCreate() {
    const [title, setTitle] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://posts-service:4000/posts', { title });
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