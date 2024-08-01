const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
const router = express.Router();

// POST /auth/register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      username,
      email,
      password,
    });

    await user.save();
    // const payload = {
    //     user: {
    //       id: user._id,
    //     },
    //   };
    res.status(201).json({ msg: "User registered successfully" });

    

    // jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }),
    //   (err, token) => {
    //     if (err) throw err;
    //     res.json({ token });
    //   };
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
//get all authenticated users
router.get('/', async (req, res) => {
  try {
  const user = await User.find();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const {email, password} = req.body;
  const name =req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }else{
      console.log(user.name)
    }

    const isMatch = await bcrypt.compare(password, user.password,console.log(user.name));
    
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        username: user.username,
        email: user.email,
        id: user._id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token,username:user.username,email:user.email,id:user. _id,
              
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// GET /auth/logout
router.get("/logout", (req, res) => {
  res.json({ msg: "User logged out successfully" });
});

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require("jsonwebtoken");
// const User = require('../models/UserSchema');

// const salt = bcrypt.genSaltSync(10);


// router.post('/register', async (req, res) => {
//     const { username, email, password } = req.body;
//     try {
//         // Check if the email or username already exists
//         const existingUser = await User.findOne({ $or: [{ username }, { email }] });
//         if (existingUser) {
//             return res.status(400).json({ error: 'Username or email is already taken' });
//         }

//         const hashedPassword = bcrypt.hashSync(password, salt);
//         const userDoc = await User.create({
//             username,
//             email, // Save email
//             password: hashedPassword,
//         });

//         res.status(201).json(userDoc);
//     } catch (e) {
//         console.error(e);
//         res.status(400).json({ error: 'User registration failed' });
//     }
// });


// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//       // Find user by email
//       const userDoc = await User.findOne({ email });

//       // Check if the user exists
//       if (!userDoc) {
//           return res.status(400).json('User not found');
//       }

//       // Compare provided password with the stored hash
//       const passOk = bcrypt.compareSync(password, userDoc.password);

//       if (passOk) {
//           // Generate JWT token
//           jwt.sign({ id: userDoc._id, email: userDoc.email }, process.env.JWT_SECRET, {}, (err, token) => {
//               if (err) {
//                   console.error(err);
//                   return res.status(500).json('Failed to create token');
//               }

//               // Send the token as a cookie and user details in response
//               res.cookie('token', token).json({
//                   id: userDoc._id,
//                   email: userDoc.email,
//                   username: userDoc.username, // Return username along with email
//               });
//           });
//       } else {
//           res.status(400).json('Incorrect password');
//       }
//   } catch (e) {
//       console.error(e);
//       res.status(500).json('Login failed');
//   }
// });




//   router.get('/profile', (req,res) => {
//     const {token} = req.cookies;
//     jwt.verify(token, process.env.JWT_SECRET, {}, (err,info) => {
//       if (err) throw err;
//       res.json(info);
//     });
//   });
  
//   router.post('/logout', (req,res) => {
//     res.cookie('token', '').json('ok');
//   });


// module.exports = router;