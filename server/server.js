const exp=require("express")
const app=exp()
require('dotenv').config();//process.env
const mongoose=require("mongoose");
const port=process.env.PORT || 4000;
const cors = require('cors');
app.use(cors());


//db connection
mongoose.connect(process.env.DBURL)
.then(app.listen(port,()=>console.log(`server listening on port ${port}...`)))
.catch(err=>console.log("error in DB connection",err))

const userApp=require("./APIs/userApi")
const adminApp=require("./APIs/adminApi")
const authorApp=require("./APIs/authorApi")

app.use(exp.json())

//connect API routes
app.use('/user-api',userApp)
app.use('/author-api',authorApp)
app.use('/admin-api',adminApp)

//error handler middleware(4 args) // last thing

app.use((err,req,res,next)=>{
    console.log("err obj in exoress error hanlder",err);
    res.send({message:err.message})
})