import React from "react";

export default function CommentList({ comments }) {
    const setContentToDisplay = (status, content) => {
        switch (status) {
            case 'approved':
                return content;
            case 'pending':
                return 'This comment is awaiting moderation';
            case 'rejected':
                return 'This comment has been rejected';
            default:
                return content;
        }
    };

    return (
        <ul>
            {Object.values(comments).map(({ id, content, status }) => {
                return <li key={id}>{setContentToDisplay(status, content)}</li>    
            })}
        </ul>
    );
}