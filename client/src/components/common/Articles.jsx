import React from 'react'
import { useState ,useEffect} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '@clerk/clerk-react'
function Articles() {
  const [articles,setArticles]=useState([])
  const [error,setError]=useState('')
  const navigate=useNavigate()
  const {getToken}=useAuth()
  //get all articles
  async function getArticles(){
    //get jwt token
    const token=await getToken()
    //make authenticated req
    let res=await axios.get('http://localhost:3000/author-api/articles',{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    console.log(res.data.message)
    if(res.data.message==='articles'){
      setArticles(res.data.payload)
      console.log(res.data.payload)
    }else{
      setError(res.data.message)
    }
  }

  //go to specific article
  function gotoArticleById(articlesObj){
    navigate(`../${articlesObj.articleId}`,{state:articlesObj})
  } 

  useEffect(()=>{
    getArticles()
  },[])

  return (
    <div className='container'>
      <div>
      {error.length!==0&&<p className='display-4 text-center mt-5 text-danger'>{error}</p>}
        <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3'>
          {
            articles.map((articlesObj)=>(
              <div className="col" key={articlesObj.articleId}>
                <div className="card h-100">
                  <div className='card-body'>
                    <div className='author-details text-end'>
                      <img  src={articlesObj.authorData.profileImageUrl} alt=""
                      width='40px' className='rounded-circle' />
                      <p>
                        <small className='text-secondary'>
                            {articlesObj.authorData.nameOfAuthor}
                        </small>
                      </p>
                    </div>
                    <h5 className='card-title'>{articlesObj.title}</h5>
                    <p className='card-text'>
                      {articlesObj.content.substring(0,80)+"..."}
                    </p>
                    <button className='custom-btn vtn-4' onClick={()=>gotoArticleById(articlesObj)}>
                      Read more
                    </button>
                  </div>
                  <div className='card-footer'>
                    <small className="text-body-secondary">
                      last updated on {articlesObj.dateOfModification}
                    </small>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Articles