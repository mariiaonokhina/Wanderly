import "../styles/Comment.css";

const Comment = ({username, comment, timestamp}) => {
    // Convert it to a Date object
    const date = new Date(timestamp);

    // Options for toLocaleString() to display date and time
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    const commentDate = date.toLocaleString('en-US', options);

    return(
        <div className="Comment">
            <p>{username}</p>
                    
            <p>{comment}</p>
                    
            <p>{commentDate}</p>
        </div>
    )
}

export default Comment;