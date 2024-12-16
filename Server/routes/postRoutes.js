import express from 'express'
import { requireSignIn } from '../controllers/userController.js'
import { createPostController, deletePostController, getPostController, getUserPostController, updatePostController } from '../controllers/postController.js'

//router object

const router = express.Router()

//Create Post 

router.post('/create-post', requireSignIn, createPostController);


//Get post

router.get('/get-all-posts', getPostController);

//get user post
router.get('/get-user-posts', requireSignIn, getUserPostController)

//delete post

router.delete('/delete-post/:id', requireSignIn,deletePostController)


//update  post

router.put('/update-post/:id', requireSignIn,updatePostController)


export default router

