import postModel from "../models/postModel.js";

export const createPostController = async(req, res)=>{

    try {
        
        const {title, description} = req.body;
        //validate

        if(!title || !description){
            return res.status(500).send({
                success: false,
                message: 'Please provide all field'
            })
        }

        const post  = await postModel({
            title,
            description,
            postedBy: req.auth._id
        }).save()
        res.status(201).send({
            success: true,
            message: 'Post Created successfully',
            post
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in create post Api', 
            error
        })
    }


}


export const getPostController = async(req, res)=>{

    try {
        const posts  = await postModel.find().populate('postedBy', "_id name").sort({createdAt: -1})
        res.status(200).send({
            success: true,
            message: "These are all posts",
            posts
        })
        
    } catch (error) {

        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error occurrect at the time of fetching posts...',
            error
        })
        
    }

}

export const getUserPostController = async(req, res) =>{
    try {
        const userPosts = await postModel.find({postedBy: req.auth._id})
        res.status(200).send({
            success: true,
            message: 'user post',
            userPosts
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error while fetching user post API',
            error
        })
        
    }
}

//delete post controller

export const deletePostController = async(req,res)=>{
    try {
        const {id} = req.params
        const deletePost = await postModel.findByIdAndDelete({_id: id})
        res.status(200).send({
            success: true,
            message: 'deleted post',
            deletePost
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error while deleting user post API',
            error
        })
        
    }
}

//update post || put

export const updatePostController =async(req, res) =>{ try {
    const {title, description} = req.body
    const post = await postModel.findById({_id: req.params.id})
    if(!title || !description){
        return(
            res.status(500).send({
                success: false,
                message: 'Enter all fields',
            })
        )
    }
    const updatePost = await postModel.findByIdAndUpdate({_id: req.params.id},{
        title : title || post?.title,
        description: description || post?.description
    }, {new: true})
    res.status(200).send({
        success: true,
        message: 'updated post successfully',
        updatePost
    })
    
} catch (error) {
    res.status(500).send({
        success: false,
        message: 'Error while updating user post API',
        error
    })
    
}}