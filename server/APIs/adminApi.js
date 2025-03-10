const exp=require('express')
const adminApp=exp.Router()

adminApp.get('/',(req,res)=>{
    res.send({message:"frm adminApp"})
})

module.exports=adminApp;