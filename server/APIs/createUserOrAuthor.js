const UserAuthor=require("../models/userAuthorModel")

async function createUserOrAuthor(req,res){
    //business logic to create 
    //get user or author obj
    const newUserAuthor=req.body;
    //find user by mailid
    const userInDb=await UserAuthor.findOne({email:newUserAuthor.email})
    //check id there
    if(userInDb!==null){
        if(newUserAuthor.role===userInDb.role){
            res.status(200).send({message:newUserAuthor.role,paylode:userInDb})
        }else{
            res.status(200).send({message:"Invalid role"})
        }

    }else{
        let newUser= new UserAuthor(newUserAuthor);
        let newUserOrAuthorDoc=await newUser.save()
        res.status(201).send({message:newUserOrAuthorDoc.role,paylode:newUserOrAuthorDoc})
    }
    
}
module.exports=createUserOrAuthor;