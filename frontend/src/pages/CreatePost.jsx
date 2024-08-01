import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../components/Editor";
import axios from "axios"; // Import Axios

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null); // Set initial value to null
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault(); // Prevent default form submission

    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    if (files) { // Check if files are selected
      data.set('file', files[0]);
    }

    try {
      const response = await axios.post('https://mern-blog-2-9i1u.onrender.com/posts/post', data, {
        withCredentials: true, // Include credentials in the request
      });

      if (response.status === 200) { // Check if the response is successful
        setRedirect(true);
      }
    } catch (error) {
      console.error("Error creating post:", error); // Handle error
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <section className="create-post">
      <div className="container">
        <h2>Create Post</h2>
        <form onSubmit={createNewPost} className="form create-post__form">
          <input
            type="text"
            placeholder={'Title'}
            value={title}
            onChange={ev => setTitle(ev.target.value)}
          />
          <input
            type="text"
            placeholder={'Summary'}
            value={summary}
            onChange={ev => setSummary(ev.target.value)}
          />
          <input
            type="file"
            onChange={ev => setFiles(ev.target.files)}
          />
          <Editor value={content} onChange={setContent} />
          <button style={{ marginTop: '5px' }} className="btn primary">Create post</button>
        </form>
      </div>
    </section>
  );
}
