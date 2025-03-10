import React, { useContext, useEffect,useState } from 'react';
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'; // ✅ Ensure correct path
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { isSignedIn, user, isLoaded } = useUser();
  const [error,setError]=useState("");
  const navigate = useNavigate();

  async function onSelectRole(e) {
    //clear error property
    setError('')
    const selectedRole = e.target.value;
    currentUser.role = selectedRole;
    let res = null;
    try {
      if (selectedRole === 'author') {
        res = await axios.post('http://localhost:3000/author-api/author', currentUser)
        let { message, payload } = res.data;
        console.log(message, payload)
        if (message === 'author') {
          setCurrentUser({ ...currentUser, ...payload })
          //save user to localstorage
          localStorage.setItem("currentuser",JSON.stringify(payload))
          // setError(null)
        } else {
          setError(message);
        }
      }
      if (selectedRole === 'user') {
        console.log(currentUser)
        res = await axios.post('http://localhost:3000/user-api/user', currentUser)
        let { message, payload } = res.data;
        console.log(message)
        if (message === 'user') {
          setCurrentUser({ ...currentUser, ...payload })
           //save user to localstorage
           localStorage.setItem("currentuser",JSON.stringify(payload))
        } else {
          setError(message);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (!setCurrentUser || !isLoaded || !user) return;

    setCurrentUser({
      ...currentUser,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.primaryEmailAddress?.emailAddress, // ✅ Fixed email extraction
      profileImageUrl: user?.imageUrl
    });
  }, [isLoaded]);

  useEffect(() => {
    if(currentUser?.role==="user" && error.length===0)
      navigate(`/user-profile/${currentUser.email}`)
    if(currentUser?.role==="author" && error.length===0)
      navigate(`/author-profile/${currentUser.email}`)

  }, [currentUser]);

  return (
    <div>
      {isSignedIn === false && (
        <div>
          <p className='lead'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          <p className='lead'>Eius nam at animi veniam neque, nulla minima velit qui praesentium vero?</p>
        </div>
      )}

      {isSignedIn === true && (
        <div>
          <div className='d-flex justify-content-evenly bg-info p-3 container align-items-center'>
            <img src={user.imageUrl} className='rounded-circle' width="100" alt="User Profile" />
            <p className='display-6'>{user.firstName}</p>
          </div>
          <p className='text-center'>Select a role</p>


          {
            error.length !== 0 && (
            <p className='text-danger fs-5' style={{ fontFamily: "sans-serif" }}>
              {error}
            </p>
          )}



          <div className='d-flex role-radio py-3 justify-content-center p-3 container align-items-center '>
            <div className='form-check '> 
              <input type="radio" name="role" id="author" value="author" className="form-check-input"  onChange={onSelectRole}/>
              <label htmlFor="author" className="form-check-label">Author</label>
            </div>

            <div className='form-check '>
              <input type="radio" name="role" id="user" value="user" className="form-check-input" onChange={onSelectRole}/>
              <label htmlFor="user" className="form-check-label">User</label>
            </div>

            <div className='form-check'>
              <input type="radio" name="role" id="admin" value="admin" className="form-check-input"  onChange={onSelectRole}/>
              <label htmlFor="admin" className="form-check-label">Admin</label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
