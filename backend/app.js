const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Post Model defined by mongoose
const Post = require('./models/post');

const app = express();

// monogodb connection url
const uri = 'mongodb+srv://shadab:oDrdZlsbgkZz4UyM@mean-course-cluster-2xlsv.mongodb.net/mean-course-db?retryWrites=true&w=majority';
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true })
  .then( () => {
    console.log('Connected to the database!');
  }).catch( () => {
    console.log('Connection to the database failed!');
  })

// Parsing json data, middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Handling the CORS error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

// adding the posts to the database
app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then( createdPost => {
    res.status(201).json({
      message: 'Post added successfully!',
      postId: createdPost._id
    });
  });
});

// fetching the posts from the database
app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then( documents => {
      res.status(200).json({
        message: 'Post fetched successfully!',
        posts: documents
      });
    });
});

// deleting the post
app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then( result => {
    console.log(result);
    res.status(200).json({ message: 'Post deleted!' });
  });
});

module.exports = app;
