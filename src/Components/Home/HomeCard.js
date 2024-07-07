import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import "../Blog/blogCard.css";

const HomeCard = ({ blog }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState('');
  const navigate = useNavigate();

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const expandBlog = () => {
    setIsExpanded(true);
  };

  const closeBlog = (e) => {
    e.stopPropagation();
    setIsExpanded(false);
  };

  const toggleOptions = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  const stripHtmlTags = (str) => {
    return str.replace(/<[^>]*>/g, '');
  };

  const getDescription = () => {
    const cleanDescription = stripHtmlTags(blog.blog_description);
    if (showFullDescription) {
      return cleanDescription;
    } else {
      const words = cleanDescription.split(' ');
      if (words.length > 8) {
        return words.slice(0, 8).join(' ') + '...';
      } else {
        return cleanDescription;
      }
    }
  };

  useEffect(() => {
    const fetchUserProfilePic = async () => {
      try {
        const response = await axios.get(`https://zipthought-backend.onrender.com/users/${blog.userId}/profilepic`);
        const profilePicPath = response.data.userProfilePic;
        setUserProfilePic(`https://zipthought-backend.onrender.com/${profilePicPath}`);
      } catch (error) {
        console.error('Error fetching user profile picture:', error.message);
      }
    };

    fetchUserProfilePic();
  }, [blog.userId]);

  return (
    <div
      className={`card ${isExpanded ? 'expanded' : ''}`}
      onClick={expandBlog}
      onMouseEnter={toggleOptions}
      onMouseLeave={toggleOptions}
    >
      <div className="card__header">
        <img src={`https://zipthought-backend.onrender.com/public${blog.blog_media}`} alt="card__image" className="card__image" />
      </div>
      <div className="card__body">
        <span className={`tag ${getTagColor(blog.blog_category)}`}>{blog.blog_category}</span>
        <h4>{blog.blog_title}</h4>
        <p>{getDescription()}</p>
      </div>
      <div className={`card__footer ${showOptions ? 'show-options' : ''}`}>
        <div className="user">
          <img src={userProfilePic} alt="user__image" className="user__image" />
          <div className="user__info">
            <h5>{blog.username}</h5>
            <small>{new Date(blog.createdAt).toLocaleString()}</small>
          </div>
        </div>
      </div>
      <div className={`expanded-blog ${isExpanded ? 'show' : ''}`} onClick={closeBlog}>
        <div className="close-button" onClick={closeBlog}>&#10006;</div>
        <div className="blog-content">
          <img src={`https://zipthought-backend.onrender.com/public${blog.blog_media}`} alt={blog.blog_title} />
          <h1>{blog.blog_title}</h1>
          <p className="card-description">{stripHtmlTags(blog.blog_description)}</p>
        </div>
      </div>
    </div>
  );
};

const getTagColor = (category) => {
  switch (category.toLowerCase()) {
    case 'technology':
      return 'tag-blue';
    case 'food':
      return 'tag-brown';
    case 'cinema':
      return 'tag-red';
    case 'design':
      return 'tag-blue';
    case 'art':
      return 'tag-brown';
    case 'science':
      return 'tag-red';
    default:
      return '';
  }
};

export default HomeCard;
