const express = require('express')
const PostController = require('../controllers/postController');
const passport = require('passport')
const getRouter = express.Router();


getRouter.get('/:postId', PostController.getPost)

getRouter.get('/', PostController.getPosts)



module.exports = postRouter;