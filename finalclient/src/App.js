import React from 'react'; // Import React library for creating React components

// Import components from other files
import Login from './Login'; 
import MyComponent from './navbar';
import Register from './Register';
import Article from './ShowArticle';
import Profile from './Profile';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
export const ipAddress = 'https://finalserver-dunm.onrender.com'; // Define a constant for the IP address or server endpoint


// Define the main App component
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define routes for different paths */}
        <Route exact path="/" element={<MyComponent />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path='/Article' element={<Article/>}/>
      </Routes>
    </Router>
  );
};

export default App;
