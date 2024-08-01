import {Link} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/UserContext";
import Logo from '../images/logo1.png';
import {FaBars} from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';

export default function Header() {
  const {setUserInfo,userInfo} = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:8000/users/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  

  const username = userInfo?.username;


  const [isNavShowing, setIsNavShowing] = useState(window.innerWidth >800 ? true : false)
   
  const closeNavHandler = () =>{
    if(window.innerWidth < 800){
      setIsNavShowing(false);
    }else{
      setIsNavShowing(true);
    }
  }

  return (
    <header>
      {/* <Link to="/" className="logo">MyBlog</Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <a onClick={logout}>Logout ({username})</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav> */}
      <nav>
        <div className="container nav__container">
            <Link to='/' className='nav__logo' onClick={closeNavHandler}>
            <img src={Logo} alt="Navbar Logo" />
            </Link>
            {isNavShowing && <ul className="nav__menu">
                
                {username && (
                  <>
                  <li><Link to='/create' onClick={closeNavHandler}>Create Post</Link></li>
                <li><Link to='/page-log-out'>Logout</Link></li>
                  <li><Link to='/' onClick={closeNavHandler}>{username}</Link></li>
                  </>
                )}
                {!username && (
                  <>
                     <li><Link to="/login">Login</Link></li>
                     <li><Link to="/register">Register</Link></li>
                  </>
        )}
            </ul>}
            <button className="nav__toggle-btn" onClick={()=> setIsNavShowing(!isNavShowing)}>
                  {isNavShowing ? <AiOutlineClose/> : <FaBars/>}
            </button>
        </div>
    </nav>
    </header>
  );
}
