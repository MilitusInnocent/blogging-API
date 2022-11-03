const  PostModel  = require('../models/postModel')

const moment = require('moment');
const Post = require('../models/postModel');


exports.createPost = async (req, res) => {
    try {
        const postBody = req.body;
        const wordCount = postBody.body.split(" ").length
        const reading_time = `${Math.floor(wordCount/200)} minute(s)`
        postBody.author = req.user._id
        const post = await PostModel.create({ 
            author: postBody.author,
            title: postBody.title,
            description: postBody.description,
            tag: postBody.tag,
            body: postBody.body,
            reading_time
        })
        
        return res.status(201).json({ status: true, post })
    } catch (error) {
        res.status(500).send(error)
    }
   
}

exports.getPosts  = async (req, res) => {
    try {
        const posts = await PostModel
    .find()
    .populate('author', '-password -__v')
        res.status(200).json({ status: true, posts })
    } catch (error) {
        res.status(500).send(err)
    }
    
}

exports.getPost = async (req, res) => {
    try {
        const { postId } = req.params;
    const post = await PostModel.findById(postId)
    .populate('author', '-password -__v')

    if (!post) {
        return res.status(404).json({ status: false, post: null })
    }
    post.read_count += 1
    post.save()
    return res.json({ status: true, post })
    } catch (error) {
        res.status(500).send(err)  
    }
    
}

exports.updatePost = async (req, res) => {
    const { id: taskID } = req.params
    const postBody = req.body;
    const wordCount = postBody.body.split(" ").length
    const reading_time = `${Math.floor(wordCount/200)} minute(s)`

    const post = await Post.findOneAndUpdate({ _id: taskID }, {
        author: postBody.author,
        title: postBody.title,
        description: postBody.description,
        tag: postBody.tag,
        body: postBody.body,
        reading_time
    }, {
        new: true,
        runValidators: true,
      })


    if (!post) {
        return res.status(404).json({ status: false, post: "No blog post found" })
    }



    await post.save()
    return res.json({ status: true, post })
}

exports.deletePost = async (req, res) => {
    const { id } = req.params;

    const post = await PostModel.deleteOne({ _id: id})

    return res.json({ status: true, message: 'Post successfully deleted' })
}
