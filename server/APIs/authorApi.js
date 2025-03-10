const exp=require('express')
const authorApp=exp.Router()
const UserAuthor=require("../models/userAuthorModel")
const expressAsyncHandler=require("express-async-handler");
const createUserOrAuthor=require("./createUserOrAuthor")
const Article=require("../models/articleModel")
const {requireAuth,clerkMiddleware}=require('@clerk/express')
require('dotenv').config()
//API
// authorApp.use(clerkMiddleware)

//create a new author
authorApp.post("/author",expressAsyncHandler(createUserOrAuthor))

authorApp.post("/article", expressAsyncHandler(async (req, res) => {

    //get new article obj from req
    const newArtilceObj = req.body;
    const newArticle = new Article(newArtilceObj);
    const articleObj = await newArticle.save();
    res.status(201).send({ message: "article published", payload: articleObj })

}))

//read alla rticles
authorApp.get("/articles",requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
    const listOfArticles=await Article.find({isArticleActive:true});
    res.status(200).send({message:"articles",payload:listOfArticles})
}))
authorApp.get('/unauthorized',(req,res)=>{
    res.send({message:"Unauthorized request...please login"})
})

//modify an article by article id
authorApp.put('/article/:articeleId',requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
    //get modified article
    const modifiedArticle=req.body
    const dbRes=await Article.findByIdAndUpdate(modifiedArticle._id,{...modifiedArticle},{returnQriginal:false})//if this not used then the original is sent
    //send res
    res.status(200).send({message:"article modified",paylode:dbRes}) 
}))

//delete(soft wala)
authorApp.put('/articles/:articeleId',requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
    //get modified article
    const modifiedArticle=req.body
    const dbRes=await Article.findByIdAndUpdate(modifiedArticle._id,{...modifiedArticle},{returnQriginal:false})//if this not used then the original is sent
    //send res
    res.status(200).send({message:"article deleted",paylode:dbRes}) 
}))

module.exports=authorApp;