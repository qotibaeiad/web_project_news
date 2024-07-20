import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ipAddress } from './App';
import { Link } from 'react-router-dom';


// Get the logged-in user's name from localStorage
const loggedInUser = localStorage.getItem('name');

// Export variables for global use in "Article"
export let Gimage = null;
export let Gtitle = null;
export let Gauthor = null;
export let Gcontent = null;
export let Gpublishtime = null;


// Define the ArticleList component
const ArticleList = ({ category }) => {

    // Define state variables for loading status and articles list
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);

    // Fetch articles when the component mounts or when the category changes
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true); // Set loading state to true while fetching data
        setArticles([]); // Clear the articles array to show loading state or empty state
        const defaultCategory = category;
        let response;
        // Fetch articles based on the default category
        if (defaultCategory ==='Random'){
          response = await axios.get(`${ipAddress}/api/random`);
        }
        else{
          response = await axios.get(`${ipAddress}/api/search?query=${defaultCategory}`);
        }
        // Update the articles state with the fetched data
        setArticles(response.data.articles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category]);

    // Define state variable for favorite articles
  const [favorites, setFavorites] = useState({});

    // Toggle article as favorite or remove from favorites
  const toggleFavorite = async (articleIndex) => {
    const article = articles[articleIndex];
    const isCurrentlyFavorite = favorites[articleIndex];
  
    // Conditionally send request based on the favorite status
    if (isCurrentlyFavorite) {
      try {
        const response = await axios.post(`${ipAddress}/api/remove-article`, {
          username: loggedInUser, // Provide the username if required by the server
          title: article.title,
        });
  
        if (response.status === 200) {
          // Update the UI to reflect the successful removal
          const newFavorites = { ...favorites };
          newFavorites[articleIndex] = false;
          setFavorites(newFavorites);
        } else {
          throw new Error('Failed to remove favorite');
        }
      } catch (error) {
        alert('Error removing favorite');
        console.error('Error removing favorite:', error);
      }
    } else {
      try {
        const response = await axios.post(`${ipAddress}/api/add-article`, {
          username: loggedInUser, // Provide the username if required by the server
          author: article.author,
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          isFavorite: true,
        });
  
        if (response.status === 200) {
          // Optionally, update the UI to reflect the successful save
          const newFavorites = { ...favorites };
          newFavorites[articleIndex] = true;
          setFavorites(newFavorites);
        } else {
          throw new Error('Failed to save favorite');
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message === 'Article with the same title already exists.') {
          // Update the UI to reflect that the article already exists
          const newFavorites = { ...favorites };
          newFavorites[articleIndex] = true;
          setFavorites(newFavorites);
          alert('Article already exists.');
        } else {
          // Handle other errors
          alert('Error saving favorite');
          console.error('Error saving favorite:', error);
        }
      }
    }
  };

    // Set global variables with article details when clicked
  const handleClickarticle = (image, title, author, content, publishtime) => {
    Gimage = image;
    Gtitle = title;
    Gauthor = author;
    Gcontent = content;
    Gpublishtime = publishtime;

  };
  

  return (
    <div className={`dark:bg-gray-700 ${loading ? 'dark:text-white' : 'dark:text-black'}`}>
      {/* Show loading message if loading */}
      {loading && <p>Loading...</p>}
      {/* Show message if no articles */}
      {!loading && articles.length === 0 && <p>No articles available</p>}
      {/* Map and render articles */}      
      {!loading &&
        articles.length > 0 &&
        articles.map((article, index) => (
          <div key={index} className="hover:scale-90  dark:bg-gray-700 flex flex-wrap transform shadow-lg transition-transform duration-300 ease-in-out text-black dark:text-white  mb-16 p-6">
            {/* Article image */}            
            <div className="mb-6 ml-auto w-full shrink-0 grow-0 basis-auto px-3 md:mb-0 md:w-3/12">
              <div className="relative mb-6 overflow-hidden rounded-lg bg-cover bg-no-repeat shadow-lg dark:shadow-black/20" data-te-ripple-init data-te-ripple-color="light">
              {/* Link to Article component with image */}              
              <Link to={`/Article`}>
                <img
                  src={article.urlToImage}
                  onClick={() =>
                    handleClickarticle(
                      article.urlToImage,
                      article.title,
                      article.author,
                      article.content,
                      article.publishedAt
                    )
                  }
                  className="lg:w-full"
                  alt="Article"
                />
              </Link>
              </div>
            </div>

              {/* Article details */}
            <div className="mb-6 mr-auto w-full shrink-0 grow-0 basis-auto px-3 md:mb-0 md:w-9/12 xl:w-7/12">
                {/* Article title */}              
              <h5 className="mb-3 dark:text-white text text-lg font-bold cursor-pointer">{article.title}</h5>
                {/* Article category */}              
              <div className="mb-3 flex items-center justify-center text-sm font-medium  dark:text-white md:justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
                  <path stroke="currentColor" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
                </svg>
                News
              </div>
                {/* Article publish time */}
              <p className="mb-6 dark:text-white">
                <small>Published <u>{article.publishedAt}</u></small>
              </p>
                {/* Article description */}
              <p className=" dark:text-white">
                {article.description}
              </p>
                {/* Toggle favorite button */}
              {loggedInUser ? (
              <a href="#!" className="star-link" onClick={() => toggleFavorite(index)}>
                <span style={{ display: 'inline-block' }}>
                      {/* Show filled or empty star icon based on favorite status */}                  
                  {favorites[index] ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4l2.63 5.276L20 9.75l-4 3.727.945 5.61L12 18.25l-4.945 2.837.945-5.61-4-3.727 5.37-.474L12 4z" />
                    </svg>
                  )}
                </span>
              </a>
              ) : null}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ArticleList;
