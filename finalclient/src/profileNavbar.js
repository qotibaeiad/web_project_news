import React from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { Link } from 'react-router-dom'; 
import ArticleList from './ArticleList';
import MyComponent from './navbar';

// Get the logged-in user from local storage
const loggedInUser = localStorage.getItem('name');

// ProfileNavbar Component
function ProfileNavbar({ darkSide, toggleDarkMode }) {
    // Function to handle logout
    const handleLogout = () => {
        localStorage.clear(); // Clear all items from local storage
      };
    return (
        <nav className="fixed top-0 w-full bg-gray-900 z-50"> {/* Navbar with fixed position at the top */}
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 bg-gray-900"> {/* Navbar content */}
                <ul className="flex items-center justify-center flex-grow"> {/* Navigation links */}
                    <li className="mr-6">
                        <Link to="/" className="text-white px-4 py-2 rounded-md hover:bg-gray-800">Home</Link>  {/* Link to home page */}
                    </li>
                    <li>
                    {/* Conditional rendering based on logged-in user */}
                    {loggedInUser ? (
                        <Link to="/login"> {/* Link to login page */}
                        <button className="text-white" onClick={handleLogout}>Logout</button> {/* Logout button */}
                        </Link>
                        ) : (
                        <Link to="/Login" className="text-white">Login</Link> 
                    )}
                </li>
                </ul>
                <div>
                    <DarkModeSwitch 
                        checked={darkSide} // Dark mode status
                        onChange={toggleDarkMode} // Toggle dark mode function
                        className="w-10 text-white" // Apply dark mode text color
                    />
                </div>
            </div>
        </nav>
    );
}

export default ProfileNavbar;
