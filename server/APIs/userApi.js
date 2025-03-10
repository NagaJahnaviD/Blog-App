const exp=require('express')
const userApp=exp.Router()
const UserAuthor=require("../models/userAuthorModel")
const expressAsyncHandler=require("express-async-handler");
const createUserOrAuthor=require("./createUserOrAuthor")
const Article=require('../models/articleModel')
//API


//create a new user
userApp.post("/user",expressAsyncHandler(createUserOrAuthor))

//add comment
userApp.put('/comment/:articleId',expressAsyncHandler(async(req,res)=>{
    const commentObj=req.body
    //adding it to comments array of article
    const articleWithComments=await Article.findOneAndUpdate(
        {articleId:req.params.articleId},
        {$push:{comments:commentObj}},
        {returnOriginal:false})
        res.status(200).send({message:"commenr added",paylode:articleWithComments})
}))

module.exports=userApp;