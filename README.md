# ankitassignment
# Project Setup Guide

This guide will walk you through downloading, installing, and setting up the project on your local machine. 

## Prerequisites
Before you begin, make sure you have the following installed:
- **Node.js**: [Install Node.js](https://nodejs.org/)
- **MongoDB**: Set up an [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas) for your database.
- **Git**: [Install Git](https://git-scm.com/)

## Clone the Repository
1. Open your terminal/command prompt.
2. Clone the repository using Git:

   ```bash
   git clone <repository-url>
Replace <repository-url> with the actual GitHub repository URL.
Navigate to the project directory:

cd ui 
npm install or npm i
do same for backend:
cd api
npm i

Configuration
Step 1: Create and Configure .env File
1.PORT: Define the port for your server to run on: PORT=3001
2. MONGODB_URI: Add your MongoDB URI: MONGODB_URI="mongodb+srv://<username>:<password>@cluster1.dkh9fkz.mongodb.net/<database-name>?retryWrites=true&w=majority&appName=Cluster1"
3. Twitter Bearer Token:TWITTER_BEARER_TOKEN="your-twitter-bearer-token"

run the backend : npm run dev app.js

Step 2: Update API Endpoints (For Frontend):
If your frontend is making requests to APIs, update the following API endpoints with your actual URLs:
in my folder, their is apiUrl.js file:
export const apiUrlUser = "https://ankitassignment.appspot.com/user/";
export const apiurlTwitter = "https://ankitassignment.appspot.com/api/twitter/";
export const apiurlReddit = "https://ankitassignment.appspot.com/api/reddit/";
export const apiUrlproduct = "https://ankitassignment.appspot.com/product/";
const baseApiUrl = "https://ankitassignment.appspot.com/api/";

// User API endpoints
export const apiUrlAuth = baseApiUrl + "auth/";

// Twitter/Tweet API endpoints
export const apiUrlTwitter = "https://ankitassignment.appspot.com/api/" + "twitter/";
export const apiurlStoreTrending = "https://ankitassignment.appspot.com/api/";

// Other API endpoints
export const apiUrlPost = baseApiUrl + "post/";
export const apiUrlComment = baseApiUrl + "comment/";

run the frontend : npm run dev
