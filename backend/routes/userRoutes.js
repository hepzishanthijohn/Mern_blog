const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require('../models/UserSchema');

const salt = bcrypt.genSaltSync(10);

// Middleware for JWT verification
const verifyToken = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = info; // Attach user info to the request
        next();
    });
};

// User registration
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
            email,
            password: hashedPassword,
        });

        res.status(201).json({ 
            id: userDoc._id,
            username: userDoc.username,
            email: userDoc.email
        });
    } catch (e) {
        console.error(e);
        res.status(400).json({ error: 'User registration failed' });
    }
});

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userDoc = await User.findOne({ email });
        if (!userDoc) {
            return res.status(400).json({ error: 'User not found' });
        }

        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({ id: userDoc._id, email: userDoc.email }, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Failed to create token' });
                }

                // Set cookie with secure options
                res.cookie('token', token, {
                    httpOnly: true, // Prevent JavaScript access to the cookie
                    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                    sameSite: 'Strict', // Prevent CSRF
                }).json({
                    id: userDoc._id,
                    email: userDoc.email,
                    username: userDoc.username,
                });
            });
        } else {
            res.status(400).json({ error: 'Incorrect password' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get user profile
router.get('/profile', verifyToken, (req, res) => {
    res.json(req.user); // Send user info from the request
});

// User logout
router.post('/logout', (req, res) => {
    res.cookie('token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' }).json('ok');
});

module.exports = router;
