import { useEffect, useState } from 'react';

// Custom hook for managing dark mode theme
export default function useDarkSide() {
  // State variable to track the theme ('dark' or 'light') from localStorage
  const [theme, setTheme] = useState(localStorage.theme);
  // Calculate the color theme based on the current theme
  const colorTheme = theme === 'dark' ? 'light' : 'dark';

    // Effect to update the theme and color theme classes in the DOM and save theme to localStorage
  useEffect(() => {
    // Access the root HTML element
    const root = window.document.documentElement;
    // Remove the previous color theme class and add the current theme class
    root.classList.remove(colorTheme);
    root.classList.add(theme);

    // Save the current theme to localStorage
    localStorage.setItem('theme', theme);
  }, [theme, colorTheme]); // Dependency array with theme and colorTheme

  return [colorTheme, setTheme];
}