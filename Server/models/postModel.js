import mongoose from "mongoose";

//schema

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true,'please add post title' ]
    },
    description:{
        type: String,
        required: [true, 'please add post description']
    },
    postedBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required : true
    }
},
{
    timestamps: true
})

export default mongoose.model('post', postSchema)