require('dotenv').config();
const express = require('express');
const router = express.Router();
const Post = require('../models/blog');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.CHAT_API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // Add other safety settings if needed
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [
          { text: "hi i'm wander chatbot and this is my detailed :Purpose: ..." },
        ],
      },
      {
        role: "model",
        parts: [
          { text: "Hello! Welcome to Wander. My name is Wander Chatbot. What's your name?" },
        ],
      },
      {
        role: "user",
        parts: [
          { text: "Hi" },
        ],
      },
      {
        role: "model",
        parts: [
          { text: "Hi there! Thanks for reaching out to Coding Money. Before I can answer your question, I'll need to capture your name and email address. Can you please provide that information?" },
        ],
      },
      // Add other dialogues as needed
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

router.get('/', async (req, res) => {
    
    try{
        const locals ={
            title: 'My First blog post',
            content : 'lorem Ipsum  is simply dumm  dolor Lorem Ipsum is simply ipsum. Lorem Ips'
        }

        let perPage = 5;
        let page = req.query.page || 1;
        const data = await Post.aggregate([{ $sort : { createdAt: -1} }])
        .skip(perPage*page -perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        console.log(req.user);
        res.render('index',{
            user : req.cookies.token,
            blogs : data,
            locals,
            currentPage : page,
            nextPage : hasNextPage ? nextPage : null,

        });
    }
    catch(error){
        console.log(error);
    }
    
});
router.get('/post/:id', async (req, res) => {
    
    try{
      
        let id = req.params.id;
        const data = await Post.findById({_id : id})
        .populate('author', 'username')
        .populate('comments');
        const locals ={
            title: data.title,
            content : 'lorem Ipsum  is simply dumm  dolor Lorem Ipsum is simply ipsum. Lorem Ips'
        }
        const postComment = data.comments;
        const commentsCount = data.comments ? data.comments.length : 0;
        const likesCount = data.likes ? data.likes.length : 0;
        const dislikesCount = data.dislikes ? data.dislikes.length : 0;
        res.render('post', {locals,data,postComment,user : req.cookies.token,counts: { commentsCount, likesCount,dislikesCount }, image: data.image});
    }
    catch(error){
        console.log(error);
    }
    
});


router.post('/search', async (req, res) => {
    try {
      const locals = {
        title: "Seach",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }
  
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
  
      const data = await Post.find({
        $or: [
          { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
          { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
        ]
      });
  
      res.render("search", {
        user : req.cookies.token,
        data,
        locals
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });

router.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.message;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
    console.log(response);
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//about
router.get('/about', async(req, res) => {
    res.render('about',{user : req.user});
});
//contact

router.get('/contact', (req, res) => {
    res.render('contact',{user : req.cookies.token});
});

//sign in

router.get('/signIn', (req, res) => {
    res.render('sign',{user : req.cookies.token});
});
module.exports = router;