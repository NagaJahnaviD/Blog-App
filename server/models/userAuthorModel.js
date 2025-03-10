//user or authoe schema
const mongoose=require("mongoose")

//defining user or author schemas
const userAuthorSchema=new mongoose.Schema({
    role:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    profileImageUrl:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{"strict":"throw"})

//create model for user author schema
const UserAuthor=mongoose.model('userauthor',userAuthorSchema)

module.exports=UserAuthor