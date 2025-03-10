import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import {useClerk,useUser} from '@clerk/clerk-react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'; 

function Header() {

  const {signOut}=useClerk()
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const {isSignedIn,user,isLoaded}=useUser();
  const navigate=useNavigate();
  //function to signout
  async function handleSignOut(){
    await signOut();
    setCurrentUser(null)
    navigate('/')
  }

  return (
    <div>
      <nav className='header d-flex justify-content-between align-items-center'>
        <div className="d-flex justify-content-center">
          <Link to='/'>LOGO</Link>
        </div>
          <ul className='d-flex justify-content-around list-unstyled header-links'>
            {
              !isSignedIn?
              <>
              <li>
                <Link to="">Home</Link>
              </li>
              <li>
                <Link to="signin">Signin</Link>
              </li>
              <li>
                <Link to="signup">Signup</Link>
              </li>
              </>:
              <div className='user-button'>
                  <div style={{position:'relative'}}>
                      <img src={user.imageUrl} width='40px' className='rounded-circle' alt="" />
                      <p className='role' style={{position:'absolute',top:"0px",right:"-20px"}}></p>
                  </div>
                  {/* <p className='mb-0 user-name' style={{position:'absolute'}} >{user.firstName}</p> */}

                  <button className='btn btn-danger signout-btn' onClick={handleSignOut}>SignOut</button>
              </div>
            }

              
          </ul>
      </nav>
    </div>
  )
}

export default Header