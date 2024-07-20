const { MongoClient } = require('mongodb');

class MongoDB {
  constructor(connectionString, dbName) {
    // Initialize MongoDB connection parameters
    this.connectionString = connectionString; 
    this.dbName = dbName;
    // Create a new MongoDB client instance
    this.client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    // Initialize the database instance to null
    this.db = null;
  }

  // Method to connect to the MongoDB server
  async connect() {
    try {
       // Attempt to establish a connection to the MongoDB server
       await this.client.connect();
      // Set the database instance using the connected client
      this.db = this.client.db(this.dbName);
      console.log('Connected to MongoDB');
    } catch (error) {
      // Log and throw an error if connection fails
      console.error('Error connecting to MongoDB:', error.message);
      throw error;
    }
  }

  // Method to close the MongoDB connection
  async close() {
     // Close the MongoDB client connection
     await this.client.close();
    console.log('Closed MongoDB connection');
  }
}

// Export the MongoDB class to be used in other modules
module.exports = MongoDB;
