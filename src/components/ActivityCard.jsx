import { useEffect, useState } from "react";
import "../styles/ActivityCard.css";
import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";


const ActivityCard = ({post}) => {
    const [activity, setActivity] = useState(post);
    const [likes, setLikes] = useState(post.likes);
    useEffect(() => {
        if (!post) {
            setActivity(post);
        }
        setLikes(post.likes);
    }, [post]);
    

    const handleLikeClick = async () => {
        setLikes((prevLikes) => {
            const newLikes = prevLikes + 1;
            supabase
                .from('Posts')
                .update({ likes: newLikes })
                .eq('post_id', post.post_id)
                .then(({ data, error }) => {
                    if (data) {
                        console.log(data);
                    }
                    if (error) {
                        console.error(error);
                        setLikes(prevLikes);
                    }
                });
            return newLikes;
        });
    };    


    return (
        <div className="ActivityCard">
            {post? 
                <div className="activity-content-container">
                    <img className="activity-card-img" alt="Activity thumbnail" src="https://res.cloudinary.com/the-infatuation/image/upload/c_fill,w_828,ar_4:3,g_center,f_auto/cms/media/reviews/katzs-deli/banners/Theophilus-_252B-Katzs-019_0"></img>

                    <div className="activity-info-container">
                        <h2 className="activity-card-title">{activity.title}</h2>

                        <div className="activity-tags-container">
                            <span className="activity-card-activity-type">{activity.ActivityType.activity_type_name
}</span>

                            <span className="activity-card-tag-break">|</span>

                            <span className="activity-card-weather">{activity.Weather.weather_name
}</span>

                            <span className="activity-card-tag-break">|</span>

                            <span className="activity-card-price">${activity.price}</span>

                            <span className="activity-card-tag-break">|</span>

                            <span className="activity-card-duration">{activity.Duration.duration}</span>
                        </div>
                    </div>

                    <div className="activity-card-btns">
                        <Link className='link-item' to={`/homepage/${post.post_id}`}>
                            <button className="open-post-btn">
                                <img className="arrow-right-image" src="/arrow-right.svg" alt="arrow to the right"></img>
                            </button>
                        </Link>

                        <button className="activity-card-likes-btn" onClick={handleLikeClick}>{likes} likes</button>
                    </div>
                </div>
            : ""}
        </div>
    )
}

export default ActivityCard;