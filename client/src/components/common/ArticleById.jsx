import React from 'react'
import { useContext } from 'react'
import {useLocation} from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import { MdDelete, MdRestore } from 'react-icons/md'
import {userAuthorContextObj} from '../../contexts/UserAuthorContext'
function ArticleById() {
  const {state}=useLocation()
  const {currentUser}=useContext(userAuthorContextObj)
  const [editArticleStatus, setEditArticleStatus]=useState(false)
  // console.log(state)

  function enableEdit(){
    
  }
  return (
    <div className='container'>
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
                    <button className="me-2 btn btn-light">
                      <FaEdit className='text-warning' />
                    </button>
                    {/* if active then delte icon, else restore */}
                    {
                      state.isArticleActive===true?(
                        <button className="me-2 btn btn-light">
                          <MdDelete className='text-danger  fs-4'/>
                        </button>
                      ):(
                        <button className="me-2 btn btn-light">
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

        {/* edit  form*/}
        <h1>edit from</h1>

    </div>
  )
}

export default ArticleById