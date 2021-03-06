const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const questionSchema=new mongoose.Schema({
    questionName:{
        type:String
    },
    difficulty:{
        type:String
    },
    url:{
        type:String
    },
    topic:{
        type:String
    }
});

const Question=mongoose.model('Question',questionSchema);
module.exports=Question