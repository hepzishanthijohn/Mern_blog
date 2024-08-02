const express = require('express');
const cors = require('cors');
const connectDB = require('./db'); 
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

require("dotenv").config();
connectDB();

const app = express();
app.use(express.json());

app.use('/uploads', express.static(__dirname + '/uploads'));


const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(cors({origin:"https://mern-blog-9tdf.vercel.app"}));
app.use(express.json());
app.use(cookieParser());


app.use('/users', userRoutes);
app.use('/posts', postRoutes);

app.get('/',(req,res)=>{
    res.send("Welcome To My Blog Page")
})


const PORT = process.env.PORT || 8001;

app.listen(PORT, ()=>{
    console.log(`server running on port : http://localhost:${PORT}`)
})