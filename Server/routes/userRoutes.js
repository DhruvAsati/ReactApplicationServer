import{loginController, registerController, requireSignIn, updateUserController} from '../controllers/userController.js'
import express from "express"

const router = express.Router()

//routes register ||post
router.post('/register', registerController)

//Login || post
router.post('/login', loginController)

//update || PUT

router.put('/update-user',requireSignIn, updateUserController)


export default router