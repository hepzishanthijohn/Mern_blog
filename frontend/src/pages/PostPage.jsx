import {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {formatISO9075} from "date-fns";
import {UserContext} from "../context/UserContext";
import {Link} from 'react-router-dom';
import axios from 'axios'

export default function PostPage() {
  const [postInfo,setPostInfo] = useState(null);
  const {userInfo} = useContext(UserContext);
  const {id} = useParams();
  useEffect(() => {
    const fetchPostInfo = async () => {
      try {
        const response = await axios.get(`https://mern-blog-1-puw7.onrender.com/posts/post/${id}`);
        setPostInfo(response.data);
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    fetchPostInfo();
  }, [id]);


  const username = userInfo?.username;


  if (!postInfo) return '';

  return (

    <section className="post-detail">
      <div className="container post-detail__container">
      <div className="post-detail__header">
      by @{postInfo.author.username}
         {username && ( <div className="post-detail__buttons">
            <Link to={`/edit/${postInfo._id}`} className='btn sm primary'>Edit</Link>
            <Link to={`/delete/${postInfo._id}`} className='btn sm danger'>Delete</Link>
          </div>)}
        </div>
        <h3>{postInfo.title}</h3>
        <div className="post-detail__thumbnail">
          <img src={`https://mern-blog-1-puw7.onrender.com/${postInfo.cover}`} alt="" />
        </div>
        <h4>{postInfo.summary}</h4>
        <div className="content" dangerouslySetInnerHTML={{__html:postInfo.content}} />
      </div>
    </section>
      
   
  //     <div className="container">
  //     <div className="post-page">
      
  //     <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
  //     <div className="author">by @{postInfo.author.username}</div>
      
  //     <div className="image">
  //       <img src={`https://mern-blog-1-puw7.onrender.com/posts/post/${postInfo.cover}`} alt=""/>
  //     </div>
  //     <div className="content" dangerouslySetInnerHTML={{__html:postInfo.content}} />
  //   </div>
    
  //       <div className="edit-row">
  //         <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
  //         <button className="btn primary">Edit this post</button>
            
  //         </Link>
  //       </div>
     
  //     </div>
      
  //   </section>
  //  </div>
    
  );
}