import React, { useEffect, useState } from "react";
import Comment from "../components/Comment";
import "../styles/PostPage.css";
import { useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";

const PostPage = () => {
    const [postDetails, setDetails] = useState(null);
    const [currInput, setCurrInput] = useState("");
    const params = useParams();

    useEffect(() => {
        const getPostInfo = async () => {
            const {data} = await supabase
            .from("Posts")
            .select(`
            post_id, 
            user_id, 
            title, 
            description, 
            created_at, 
            Cities (city_id, city_name), 
            Weather (weather_id, weather_name), 
            ActivityType (activity_type_id, activity_type_name), 
            Duration (duration_id, duration), 
            Comments (comment_id, user_id, comment, commented_at, Users (username)), 
            price, 
            likes
            `)
            .eq('post_id', parseInt(params.id));

            if (data && data.length > 0) {
                const post = data[0];
                setDetails({
                    ...post,
                    "city": post.Cities.city_name, 
                    "weather": post.Weather.weather_name,
                    "activityType": post.ActivityType.activity_type_name,
                    "duration": post.Duration.duration,
                    "comments": post.Comments
                });
            }
        };
        getPostInfo();
    }, [params])
    
    console.log(postDetails);

    const handleChange = (e) => {
        setCurrInput(e.target.value)
    }

    const handlePostComment = async () => {
        if (currInput === "") return; // Don't allow empty input
    
        let uuid = JSON.parse(sessionStorage.getItem('token')).user.id;
    
        const { data, error } = await supabase
            .from("Comments")
            .insert([{
                post_id: postDetails.post_id,
                user_id: uuid, 
                comment: currInput
            }]);
    
        if (data) {
            const newComment = {
                comment_id: data[0].id, 
                user_id: uuid,
                comment: currInput,
                commented_at: new Date().toISOString() 
            };
            setDetails({
                ...postDetails,
                comments: [...postDetails.comments, newComment]
            });
        } else if (error) {
            console.error(error);
            alert('Failed to post comment. Please try again.'); 
        }
    
        setCurrInput("");
        window.location.reload(false);
    };

    return(
        <div className="PostPage">
             {postDetails != null? 
             <div className="complete-post-page">
                <div className="post-page-container">
                    <h2 className="activity-card-title">{postDetails.title}</h2>
                    <h4 className="activity-card-description">{postDetails.description}</h4>
                    <img className="post-page-img" alt="Activity thumbnail" src="https://res.cloudinary.com/the-infatuation/image/upload/c_fill,w_828,ar_4:3,g_center,f_auto/cms/media/reviews/katzs-deli/banners/Theophilus-_252B-Katzs-019_0"></img>
                </div>
            </div>
            
            :''}

            <form>
                <label htmlFor="comment_input">Share your thoughts: </label>

                <input
                type="text"
                className="comment-input"
                name="comment_input"
                value={currInput} 
                onChange={handleChange}
                />

                <button 
                type="button" 
                className="post-comment-btn" 
                onClick={handlePostComment}>Post</button>
            </form>

            <div className="comments-container">
            {postDetails && postDetails.comments && postDetails.comments.map(comment => (
                <Comment 
                    key={comment.comment_id} 
                    username={comment.Users.username} 
                    comment={comment.comment} 
                    timestamp={comment.commented_at}
                />
                ))}
            </div>
        </div>
    )
}

export default PostPage;