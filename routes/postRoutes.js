const express = require('express')
const PostController = require('../controllers/postController');
const passport = require('passport')
const postRouter = express.Router();

postRouter.get('/:postId', PostController.getPost)
postRouter.get('/', PostController.getPosts)
postRouter.post('/', passport.authenticate("jwt", { session: false }), PostController.createPost)
postRouter.put('/:id', passport.authenticate("jwt", { session: false }), PostController.updatePost)
postRouter.delete('/:id', passport.authenticate("jwt", { session: false }), PostController.deletePost)


module.exports = postRouter;