import express from "express"
import cors from "cors"
import "dotenv/config"
import bcrypt from "bcrypt"
import colors from "colors"
import morgan from "morgan"
import connectDB from "./config/db.js"
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'



//db connnection
connectDB()


//rest object

const app = express();

//middlewares

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//Routes
app.use('/api/v1/auth', userRoutes)
app.use('/api/v1/post', postRoutes)

//port
const PORT = process.env.PORT 

//listen
app.listen(PORT, ()=>{
    console.log(`Server Running at ${PORT}`.bgGreen.white)
})
