const mongoose=require("mongoose")

const authorDataSchema=new mongoose.Schema({
    nameOfAuthor:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    profileImageUrl:{
        type:String,
        required:true
    }

},{"strict":"throw"})

const userCommentSchema=new mongoose.Schema({
    nameOfUser:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    }
},{"strict":"throw"})

//creare article schema'
const articleSchema=new mongoose.Schema({
    authorData:{
        type:authorDataSchema
    },
    articleId:{
        type:String,//timestamps
        required:true
    },
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    dateOfCreation:
    {
    type:String,
    required:true},
    dateOfModification:{
        type:String,
        required:true},
    isArticleActive:{
        type:Boolean,
        default:true
    },

    comments:[userCommentSchema]
    

},{"strict":"throw"})


const Article=mongoose.model('article',articleSchema)
module.exports=Article;