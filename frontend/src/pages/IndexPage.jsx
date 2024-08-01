import Post from "../components/Post";
import {useEffect, useState} from "react";
import axios from 'axios'

export default function IndexPage() {
  const [posts,setPosts] = useState([]);
  useEffect(() => {
    fetchPosts()
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://mern-blog-2-9i1u.onrender.com/posts/post');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <>
    <section className='posts'>
    {posts.length > 0 ?(<div className="container posts__container">
      {posts.map((post) => (
        <div key={post._id}><Post 
        _id={post._id}
        key={post._id} 
        title={post.title}
        summary={post.summary}
        createdAt={post.createdAt}
        cover={post.cover} // Ensure your API returns cover images
        content={post.content} /></div>
      ))}
    </div>) : <h2 className='center'>No posts found</h2>}
    </section>
      
      
    </>
  );
}