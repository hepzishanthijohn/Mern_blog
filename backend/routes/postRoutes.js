const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const Post = require('../models/PostSchema');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.use('/uploads', express.static(__dirname + '/uploads'));


router.post('/post', uploadMiddleware.single('file'), async (req,res) => {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  
    const {token} = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err,info) => {
      if (err) throw err;
      const {title,summary,content} = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:newPath,
        author:info.id,
      });
      res.json(postDoc);
    });
  
  });
  
  router.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    try {
      let newPath = null;
      if (req.file) {
        const { originalname, path } = req.file;
        const ext = path.extname(originalname);
        newPath = `${path}${ext}`;
        fs.renameSync(path, newPath);
      }
  
      const { token } = req.cookies;
      jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
  
        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        if (!postDoc || !postDoc.author.equals(info.id)) {
          return res.status(403).json({ error: 'Forbidden' });
        }
  
        // Update the document instance
        postDoc.title = title;
        postDoc.summary = summary;
        postDoc.content = content;
        postDoc.cover = newPath ? newPath : postDoc.cover;
  
        await postDoc.save(); // Save the updated document
  
        res.json(postDoc);
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update post' });
    }
  });
  
  
  router.get('/post', async (req, res) => {
    try {
      const posts = await Post.find({})
        .populate('author', ['username'])
        .sort({ createdAt: -1 })
        .limit(20);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });
  
  router.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
  });

//   router.delete('/post/:id', async (req, res) => {
//     const {id} = req.params; // Get the id from req.params

//     if (!id) {
//         return res.status(400).json({ error: 'Post ID is required' });
//     }

//     try {
//         // Find and delete the post by its id
//         const result = await Post.findByIdAndRemove(id);
//         if (!result) {
//             return res.status(404).json({ error: 'Post not found' });
//         }
//         // If the post had a cover image, delete it from the file system
//         if (result.cover) {
//             fs.unlinkSync(result.cover);
//         }
//         res.json({ message: 'Post deleted successfully' });
//     } catch (err) {
//         console.error('Error deleting post:', err);
//         res.status(500).json({ error: 'Failed to delete post', details: err.message });
//     }
// });


module.exports = router;