import React, { useState, useEffect } from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { Link } from 'react-router-dom';
import ProfileNavbar from './profileNavbar';
import ProfileCard from './ProfileCard';
import useDarkSide from './useDarkSide';
import { ipAddress } from './App';
import axios from 'axios'; // Import axios



function Profile() {
    // State variables
    const [colorTheme, setTheme] = useDarkSide();
    const [darkSide, setDarkSide] = useState(colorTheme === 'light' ? true : false);
    const [articles, setArticles] = useState([]);

    // Fetch articles on component mount
    useEffect(() => {
        const name=localStorage.getItem('name')
        fetchArticles(name);
    }, []);

    // Function to fetch articles based on username
    const fetchArticles = async (username) => {
        try {
            const response = await fetch(`${ipAddress}/api/articles/${username}`);
            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    setArticles(data.articles);
                } else {
                    console.warn('Response is not JSON:', await response.text());
                    // Handle the case where the response is not JSON, e.g., by displaying an error message
                }
            } else {
                throw new Error('Failed to fetch articles');
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    // Function to toggle dark mode
    const toggleDarkMode = checked => {
        setTheme(colorTheme);
        setDarkSide(checked);
    };

     // Function to remove a favorite article
     const RemoveFav = async (article, articleIndex) => { // Pass article and articleIndex as parameters
        try {
            const response = await axios.post(`${ipAddress}/api/remove-article`, {
                username: localStorage.getItem('name'), // Use localStorage directly here
                title: article.title,
            });

            if (response.status === 200) {
                const updatedArticles = [...articles];
                updatedArticles.splice(articleIndex, 1); // Remove the article from the list
                setArticles(updatedArticles); // Update the state
            } else {
                throw new Error('Failed to remove favorite');
            }
        } catch (error) {
            alert('Error removing favorite');
            console.error('Error removing favorite:', error);
        }
    };

    return (
        <div style={{ backgroundColor: darkSide ? '#1F2937' : '#F3F4F6', minHeight: '200vh'}}>
            
            {/* Profile Navbar */}
            <ProfileNavbar darkSide={darkSide} toggleDarkMode={toggleDarkMode} />

             {/* Divider */}
             <div style={{ backgroundColor: darkSide ? '#374151' : '#E5E7EB', height: '1px' }}></div>
            
            {/* Profile Card */}
            <ProfileCard darkSide={darkSide} />

            {/* Articles Grid */}
            <div className="px-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {articles.map((article, index) => (
                        <div key={article.id}>
                            <article className="rounded-lg shadow-lg">
                                {/* Article Image */}
                                <a href="#">
                                    <img alt="Placeholder" className="block h-48 w-full object-cover" src={article.urlToImage} />
                                </a>
                                <header className="flex items-center justify-between leading-tight p-2 md:p-4">
                                    {/* Article Title */}
                                    <h1 className="text-lg">
                                        <a className="no-underline hover:underline text-black dark:text-white" href="#">
                                            {article.title}
                                        </a>
                                    </h1>
                                    {/* Article Date */}
                                    <p className="text-grey-darker text-sm">
                                        {article.date}
                                    </p>
                                </header>
                                <footer className="flex items-center justify-between leading-none p-2 md:p-4">
                                    <a className="flex items-center no-underline hover:underline text-black" href="#">
                                        <h3 className="dark:text-white">Author</h3>
                                        <p className="ml-2 text-sm dark:text-white">
                                            {article.author}
                                        </p>
                                    </a>
                                    <a className="no-underline text-grey-darker hover:text-red-dark" href="#">
                                        <span className="hidden">Like</span>
                                        <i className="fa fa-heart"></i>
                                    </a>
                                    {/* Remove Button (remove article from "saved news") */}
                                    <button
                                        className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                                        onClick={() => RemoveFav(article, index)}
                                    >
                                        Remove
                                    </button>
                                </footer>
                            </article>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Profile;