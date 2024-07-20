import React, { useState, useEffect } from 'react';
import {Gimage} from './ArticleList';
import {Gtitle} from './ArticleList';
import {Gauthor} from './ArticleList';
import {Gcontent} from './ArticleList';
import {Gpublishtime} from './ArticleList';
import ProfileNavbar from './profileNavbar';
import useDarkSide from './useDarkSide';



// Article Component
const Article = () => {
  // Use useDarkSide hook to manage dark mode state
  const [colorTheme, setTheme] = useDarkSide();
  const [darkSide, setDarkSide] = useState(colorTheme === 'light' ? true : false);

  // Function to toggle dark mode
  const toggleDarkMode = checked => {
      setTheme(colorTheme);
      setDarkSide(checked);
  };

  return (
    <div style={{ backgroundColor: darkSide ? '#1F2937' : '#F3F4F6', minHeight: '200vh'}}>
      {/* Render ProfileNavbar with dark mode props */}
      <ProfileNavbar darkSide={darkSide} toggleDarkMode={toggleDarkMode} />
      {/* Divider line with dynamic background color based on dark mode */}
      <div style={{ backgroundColor: darkSide ? '#374151' : '#E5E7EB', height: '1px' }}></div>
    {/* Container */}
    <div className="max-w-[1296px] mx-auto flex flex-col gap-2 p-24">
      <div className="flex">
        <div className="flex-1">
          {/* Display article image */}
          <img src={Gimage} alt="Article Image" />
          {/* Article title */}
          <h1 className="dark:text-white text-3xl font-bold mb-4 py-3">{Gtitle}</h1>
          {/* Author and publish time */}
          <p className="text-sm dark:text-white text-gray-600 italic py-2">
            Analysis by {Gauthor} {Gpublishtime}
          </p>
          {/* Article content */}
          <div className='dark:text-white' id="content">
              {/* Split content by sentences and render each as a paragraph */}            
            {Gcontent.split('.').map((sentence, index) => (
              <p key={index} className="font-serif text-base pb-5">
                {sentence.trim()}.
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Article;
