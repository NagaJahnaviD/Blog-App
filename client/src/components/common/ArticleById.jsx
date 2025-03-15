import React from 'react'
import { useContext,useState } from 'react'
import {useLocation} from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import {useForm} from 'react-hook-form'
import { MdDelete, MdRestore } from 'react-icons/md'
import axios from 'axios'
import {useAuth} from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import {userAuthorContextObj} from '../../contexts/UserAuthorContext'
function ArticleById() {
  const {state}=useLocation()
  const {currentUser}=useContext(userAuthorContextObj)
  const [editArticleStatus, setEditArticleStatus]=useState(false)
  const {register,handleSubmit}=useForm()
  const navigate=useNavigate()
  const {getToken}=useAuth()
  const [currentArticle,setCurrentArticle]=useState(state);
  const [commentStatus,setCommentStatus]=useState('')
  // console.log(state)
  //function to change edit status of article
  function enableEdit(){
    setEditArticleStatus(true)
  }

  //to save mofified article
  async function onSave(modifiedArticle)
  {
    const articleAfterChanges={...state,...modifiedArticle}
    const currentDate=new Date();
    articleAfterChanges.dateOfModification=currentDate.getDate() + "-" + currentDate.getMonth() + "-" + currentDate.getFullYear()
    

    const token= await getToken()
    //make an https post req
    let res =await axios.put(`http://localhost:3000/author-api/article/${articleAfterChanges.articleId}`,
      articleAfterChanges,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    if(res.data.message==='article modified'){
    //change status again to false
    setEditArticleStatus(false)
    console.log("curently: ",articleAfterChanges,"state",state)
    navigate(`/author-profile/articles/${state.articleId}`, { state: res.data.payload })
    }
  }
  //delete article
  async function deleteArticle()
  {
    state.isArticleActive=false;
    const token= await getToken()
    let res =await axios.put(`http://localhost:3000/author-api/articles/${state.articleId}`,
      state,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(res.data.message==="article deleted or restored"){
        setCurrentArticle(res.data.payload)
      }
  }
    //restore article
    async function restoreArticle()
    {
      state.isArticleActive=true;
      const token= await getToken()
      let res =await axios.put(`http://localhost:3000/author-api/articles/${state.articleId}`,
        state,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if(res.data.message==="article deleted or restored"){
          setCurrentArticle(res.data.payload)
        }
    }

//ADD commetn
async function addComment(commentObj){
  commentObj.nameOfUser=currentUser.firstName;
  //http put
  let res=await axios.put(`http://localhost:3000/user-api/comment/${currentArticle.articleId}`,commentObj); //commentObj ist the body of the request
  if(res.data.message==="comment added"){
    setCommentStatus(res.data.message)//same comment
  }
}

  return (
    <div className='container'>
      {
        editArticleStatus===false ? 
        <>
        {/* PRINT FULL ARTICLE */}
        <div className="d-flex justify-content-between">
          <div className="md-5 author-block w-100 py-2 rounded-2 d-flex justify-content-between align-items-center">
            <div>
              <p className="display-3 me-4">{state.title}</p>
              <span className='py-3'>
                <small className="text-secondary me-4">
                  Created on :{state.dateOfCreation}
                </small>
                <small className="text-secondary me-4">
                  Modified on :{state.dateOfModification}
                </small>
              </span>
            </div>
            {/* author details */}
            <div className="author-details text-center">
              <img src={state.authorData.profileImageUrl} width='60px' className='rounded-circle' alt="" />
            </div>
            {/* edit n delete */}
              {
                currentUser.role==='author'&&(
                  <div className="d-flex me-3">
                    {/* edit button */}
                    <button className="me-2 btn btn-light" onClick={enableEdit}>
                      <FaEdit className='text-warning' />
                    </button>
                    {/* if active then delte icon, else restore */}
                    {
                      state.isArticleActive===true?(
                        <button className="me-2 btn btn-light" onClick={deleteArticle}>
                          <MdDelete className='text-danger  fs-4'/>
                        </button>
                      ):(
                        <button className="me-2 btn btn-light" onClick={restoreArticle}>
                          <MdRestore className='text-info fs-4'/>
                        </button>
                      )
                    }
                  </div>
                )
              }
          </div>
         
        </div>
         {/* content */}
         <p className="lead mt-3 article-content" style={{whiteSpace:"pre-line"}}>
              {state.content}
            </p>
        <div>
              <div className="comments my-4">
                {
                  state.comments.length===0?<p className='display-3'>No comments yet...</p>:
                  state.comments.map(commentObj=>{
                    return <div key={commentObj._id}>
                        <p className='user-name'>
                          {commentObj?.nameOfUser}
                        </p>
                        <p className='comment'>
                          {commentObj?.comment}
                        </p>
                      </div>
                  })
                }
              </div>
        </div>
          {/* COMMENTS FORM */}
          <h6>{commentStatus}</h6>
              {
                 currentUser.role==='user'&&<form onSubmit={handleSubmit(addComment)} >
                 <input type="text"  {...register("comment")} className="form-control mb-4" />
                 <button className="btn btn-success">
                   Add a comment
                 </button>
               </form>
              }
        </>:
        <form onSubmit={handleSubmit(onSave)}>
        <div className="mb-4">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            defaultValue={state.title}
            {...register("title")}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="form-label">
            Select a category
          </label>
          <select
            {...register("category")}
            id="category"
            className="form-select"
            defaultValue={state.category}
          >
            <option value="programming">Programming</option>
            <option value="AI&ML">AI&ML</option>
            <option value="database">Database</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <textarea
            {...register("content")}
            className="form-control"
            id="content"
            rows="10"
            defaultValue={state.content}
          ></textarea>
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-success">
            Save
          </button>
        </div>
      </form>

      }
        
        
    </div>
  )
}

export default ArticleById