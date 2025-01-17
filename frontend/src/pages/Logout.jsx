import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext";
import styled from 'styled-components';
import axios from 'axios'; // Import Axios

const Logout = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useContext(UserContext); // Make sure to use UserContext to access setUserInfo

  const handleCancel = () => {
    navigate(-1);
  };

  const handleLogout = async () => {
    try {
      await axios.post('https://mern-blog-2-9i1u.onrender.com/users/logout', {}, {
        withCredentials: true, // Include credentials in the request
      });
      setUserInfo(null);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error); // Handle error
    }
  };

  return (
    <LogoutContainer>
      {/* <h1>{username }</h1> */}
      <LogoutMessage>Are you sure you want to log out?</LogoutMessage>
      <LogoutButtonLogout onClick={handleLogout}>Log Out</LogoutButtonLogout>
      <LogoutButtonCancel onClick={handleCancel}>Cancel</LogoutButtonCancel>
    </LogoutContainer>
  );
};

export default Logout;

const LogoutContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-top: 130px;
  height: 70vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  background-color: #85769f66;
  color: black;
`;

const LogoutMessage = styled.p`
  margin-bottom: 20px;
  font-size: 16px;
  text-align: center;
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  border-radius: 5px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;

  &:hover {
    color: #fff;
    background-color: #333;
  }
`;

const LogoutButtonLogout = styled(LogoutButton)`
  background-color: #ea0606;
`;

const LogoutButtonCancel = styled(LogoutButton)`
  background-color: rgb(99, 60, 99);
`;
