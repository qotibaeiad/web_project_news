const axios = require('axios');

// Function to handle general data requests (based on category)
function handleDataRequest() {
  return async (req, res) => {
    try {
      const { category } = req.query;

      // Make a request to the News API with the specified category
      const response = await axios.get('https://newsapi.org/v2/top-headlines', {
        params: {
          apiKey: '29b0654858824f4aa5e98502072dc2ae',
          country: 'us',
          category: category,
        },
      });

      const articles = response.data.articles;
      // Send the articles back to the client
      res.json({ articles });
    } catch (error) {
      console.error('Error fetching data from News API:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

// Function to handle user login requests
function handleLoginRequest(mongoDB) {
    return async (req, res) => {
      try {
        const { username, password } = req.query;
        console.log(username,' password:',password);
        
        // Check the username and password in the MongoDB collection named 'users'
        const userCollection = mongoDB.db.collection('user');
        const user = await userCollection.findOne({ username, password });
  
        if (user) {
            console.log("login succses");  // Update the "login" field to 1 for the logged-in user
          res.json({ success: true, message: 'Login successful!' });
        } else {
            console.log("login faild");
          res.json({ success: false, message: 'Invalid credentials.' });
        }
      } catch (error) {
        console.error('Error handling login request:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
  }


// Function to handle user registration requests
function handleRegistrationRequest(mongoDB) {
  return async (req, res) => {
    try {
      const { username, password, email, phone, category,country,jobTitle,bio } = req.body;

      // Check if the required fields are present
      if (!username || !password || !email || !phone || !category || !country ||! jobTitle || !bio) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
      }

      // Check if the username is already taken
      const userCollection = mongoDB.db.collection('user');
      const existingUser = await userCollection.findOne({ username });

      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username already taken.' });
      }

      // Insert the new user into the MongoDB collection
      await userCollection.insertOne({ username, password, email, phone, category,country,jobTitle,bio });

      res.json({ success: true, message: 'User registered successfully.' });
    } catch (error) {
      console.error('Error handling registration request:', error.message);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
}

// Function to handle article removal requests
function handleArticleRemoveRequest(mongoDB) {
  return async (req, res) => {
    try {
      const { username, title } = req.body;

      // Check if the required fields are present
      if (!username || !title) {
        return res.status(400).json({ success: false, message: 'Username and title are required.' });
      }

      // Find and remove the article from the MongoDB collection
      const articleCollection = mongoDB.db.collection('article');
      const deleteResult = await articleCollection.deleteOne({ username, title });

      // Check if the article was found and deleted
      if (deleteResult.deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'Article not found.' });
      }

      res.json({ success: true, message: 'Article removed successfully.' });
    } catch (error) {
      console.error('Error handling article removal request:', error.message);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
}


// Function to handle article addition requests
function handleArticleAddRequest(mongoDB) {
  return async (req, res) => {
    try {
      const { username,author, title, description, url, urlToImage, publishedAt } = req.body;

      // Check if the required fields are present
      if (!username || !author || !title || !description || !url || !urlToImage || !publishedAt) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
      }

      // Check if the article with the same title already exists
      const articleCollection = mongoDB.db.collection('article');
      const existingArticle = await articleCollection.findOne({ username,title });

      if (existingArticle) {
        return res.status(400).json({ success: false, message: 'Article with the same title already exists.' });
      }

      // Insert the new article into the MongoDB collection
      await articleCollection.insertOne(req.body);

      res.json({ success: true, message: 'Article added successfully.' });
    } catch (error) {
      console.error('Error handling article addition request:', error.message);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
}



// Function to handle search requests based on a query
function handleSearchRequest() {
  console.log('fetch search data')
  return async (req, res) => {
    try {
      const { query } = req.query;

      // Make a request to the News API with the specified search query
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          apiKey: '29b0654858824f4aa5e98502072dc2ae',
          q: query,
        },
      });

      // Filter articles with null fields
      const filteredArticles = response.data.articles.filter(article => (
        article.urlToImage !== null &&
        article.title !== null &&
        article.author !== null &&
        article.content !== null &&
        article.publishedAt !== null &&
        article.description !== null &&
        article.url !== null
      ));

      // Send the filtered articles back to the client
      res.json({ articles: filteredArticles });
    } catch (error) {
      console.error('Error fetching data from News API:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}




// Function to get categories associated with a user
function getCategoryByUser(mongoDB){
  return async (req, res) => {
    try {
      const {username}=req.query
      if (!username) {
        return { error: 'Username is required.' };
      }
      const userCollection = mongoDB.db.collection('user');
      const categories = await userCollection.distinct('category', { username });
      res.json({ categories });
    } catch (error) {
      console.error('Error fetching categories from MongoDB:', error.message);
      throw error; 
    }
  }
}

// Function to retrieve user data based on the username
function getUserData(mongoDB) {
  return async (req, res) => {
    try {
      const { username } = req.query;
      // Check if the username is provided
      if (!username) {
        return res.status(400).json({ error: 'Username is required.' });
      }

      // Access the 'user' collection from MongoDB
      const userCollection = mongoDB.db.collection('user');

      // Retrieve user data based on the provided username
      const userData = await userCollection.findOne({ username });

      // Check if the user exists
      if (!userData) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Return the user data in the response
      res.json({ user: userData });
    } catch (error) {
      // Handle any errors that might occur during the process
      console.error('Error fetching user data from MongoDB:', error.message);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  };
}

// Function to update user data in MongoDB
function updateuserdata(mongoDB) {
  return async (req, res) => {
    try {
      const { username, field, value } = req.body;

      // Update the user data in MongoDB
      const result = await mongoDB.db.collection('user').updateOne(
        { username },
        { $set: { [`${field}`]: value } }
      );

      // Check if the update was successful
      if (result.modifiedCount === 1) {
        res.status(200).json({ success: true, message: 'User data updated successfully' });
      } else {
        res.status(404).json({ success: false, message: 'User not found or no data updated' });
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
}

// Function to update user password in MongoDB
function updateuserpassword(mongoDB) {
  return async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      console.log(email)
      console.log(newPassword)

      // Update the user data in MongoDB
      const result = await mongoDB.db.collection('user').updateOne(
        { email },
        { $set: {password: newPassword } }
      );

      // Check if the update was successful
      if (result.modifiedCount === 1) {
        res.status(200).json({ success: true, message: 'User data updated successfully' });
      } else {
        res.status(404).json({ success: false, message: 'User not found or no data updated' });
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
}

// Function to handle fetching random articles from the News API
function handleRandomArticles() {
  return async (req, res) => {
    try {
      const { query } = req.query;

      // Make a request to the News API to fetch random articles
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          apiKey: '29b0654858824f4aa5e98502072dc2ae',
          domains: 'wsj.com',
        },
      });
      
      // Filter articles with null fields
      const filteredArticles = response.data.articles.filter(article => (
        article.urlToImage !== null &&
        article.title !== null &&
        article.author !== null &&
        article.content !== null &&
        article.publishedAt !== null &&
        article.description !== null &&
        article.url !== null
      ));

      // Send the filtered articles back to the client
      res.json({ articles: filteredArticles });
    } catch (error) {
      console.error('Error fetching data from News API:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}



module.exports = {
  handleRandomArticles,
  handleDataRequest,
  handleLoginRequest,
  handleRegistrationRequest,
  handleSearchRequest,
  getCategoryByUser,
  handleArticleRemoveRequest,
  handleArticleAddRequest,
  getUserData,
  updateuserdata,
  updateuserpassword,
};

