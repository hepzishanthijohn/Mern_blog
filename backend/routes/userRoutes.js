const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require('../models/UserSchema');

const salt = bcrypt.genSaltSync(10);


router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if the email or username already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email is already taken' });
        }

        const hashedPassword = bcrypt.hashSync(password, salt);
        const userDoc = await User.create({
            username,
            email, // Save email
            password: hashedPassword,
        });

        res.status(201).json(userDoc);
    } catch (e) {
        console.error(e);
        res.status(400).json({ error: 'User registration failed' });
    }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      // Find user by email
      const userDoc = await User.findOne({ email });

      // Check if the user exists
      if (!userDoc) {
          return res.status(400).json('User not found');
      }

      // Compare provided password with the stored hash
      const passOk = bcrypt.compareSync(password, userDoc.password);

      if (passOk) {
          // Generate JWT token
          jwt.sign({ id: userDoc._id, email: userDoc.email }, process.env.JWT_SECRET, {}, (err, token) => {
              if (err) {
                  console.error(err);
                  return res.status(500).json('Failed to create token');
              }

              // Send the token as a cookie and user details in response
              res.cookie('token', token).json({
                  id: userDoc._id,
                  email: userDoc.email,
                  username: userDoc.username, // Return username along with email
              });
          });
      } else {
          res.status(400).json('Incorrect password');
      }
  } catch (e) {
      console.error(e);
      res.status(500).json('Login failed');
  }
});




  router.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, (err,info) => {
      if (err) throw err;
      res.json(info);
    });
  });
  
  router.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
  });


module.exports = router;