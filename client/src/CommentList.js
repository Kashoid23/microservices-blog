import React from "react";

export default function CommentList({ comments }) {
    return (
        <ul>
            {Object.values(comments).map(({ id, content }) => (
                <li key={id}>{content}</li>
            ))}
        </ul>
    );
}