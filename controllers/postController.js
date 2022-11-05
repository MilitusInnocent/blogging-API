const  { PostModel, postState }  = require('../models/postModel')

const moment = require('moment');


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
            tags: postBody.tags,
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
        const { query } = req;
        const { 
            timestamp, 
            author, 
            title,
            tags,
            read_count = 'asc', 
            reading_time = 'asc',
            order_by = 'timestamp', 
            page = 1, 
            per_page = 20 
        } = query;

        const findQuery = {};

    if (timestamp) {
        findQuery.timestamp = {
            $gt: moment(timestamp).startOf('day').toDate(), 
            $lt: moment(timestamp).endOf('day').toDate(),
        }
    } 

    if (author) {
        findQuery.author = author;
    }

    if (title) {
        findQuery.title = title;
    }

    if (tags) {
        findQuery.tags = tags;
    }

    const sortQuery = {};

    const sortAttributes = order_by.split(',')

    for(const attribute of sortAttributes) {
        if(read_count === 'asc' && reading_time === 'asc'){
            sortQuery[attribute] = 1
        }
        if(read_count === 'desc' && reading_time === 'desc'){
            sortQuery[attribute] = -1
       }
    }

    const posts = await PostModel

        .find({state: postState.published}, findQuery)
        .sort(sortQuery)
        .skip(page)
        .limit(per_page)
        .populate('author', '-password -__v')
        res.status(200).json({ status: true, posts })
    } catch (error) {
        res.status(500).send(error)
        console.log(error)
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
        res.status(500).send(error)  
    }
    
}

exports.updatePost = async (req, res, next) => {
    try {
        const id = req.params.id
        const post = await PostModel.findById(id)
        post.timestamp.updated_at = new Date() // set the lastUpdateAt to the current date
        if(post.state === postState.published) return res.status(401).json({error: "post already published"})
       post.state = postState.published;
       await post.save();
    
       res.status(200).json({status: true, post})
        } catch(error){
            next(error);
        }
//     const { id: taskID } = req.params
//     const postBody = req.body;
//     const wordCount = postBody.body.split(" ").length
//     const reading_time = `${Math.floor(wordCount/200)} minute(s)`

//     const post = await PostModel.findOneAndUpdate({ _id: taskID }, {
//         author: postBody.author,
//         title: postBody.title,
//         description: postBody.description,
//         tag: postBody.tag,
//         body: postBody.body,
//         reading_time
//     }, {
//         new: true,
//         runValidators: true,
//       })


//     if (!post) {
//         return res.status(404).json({ status: false, post: "No blog post found" })
//     }



//     await post.save()
//     return res.json({ status: true, post })
 }

exports.deletePost = async (req, res) => {
    const { id } = req.params;

    const post = await PostModel.deleteOne({ _id: id})

    return res.json({ status: true, message: 'Post successfully deleted' })
}
