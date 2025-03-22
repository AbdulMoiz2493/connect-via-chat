# "Connect" A Chat Application

## Overview
This chat application is a modern, full-stack web application built with a focus on performance, scalability, and ease of use. It provides real-time messaging capabilities with secure authentication methods, leveraging Google Firebase for Google authentication and JWT for custom authentication.

## Features
- **Google Authentication**: Users can sign in using their Google account via Firebase.
- **Custom Authentication**: Secure user authentication using JSON Web Tokens (JWT).
- **Real-time Messaging**: Leveraging Socket.io for real-time chat functionalities.
- **State Management**: Managed with Redux Toolkit for predictable state management.
- **Styling**: Designed with Tailwind CSS for a clean and responsive UI.
- **Frontend**: Built with React and Vite for a fast and modern development experience.
- **Backend**: Powered by Node.js and MongoDB for efficient data handling and storage.

## Tech Stack
### Frontend:
- React (Vite)
- Firebase
- Redux Toolkit
- Tailwind CSS

### Backend:
- Node.js
- MongoDB
- JWT
- Socket.io

## Installation

### Prerequisites
- Node.js
- MongoDB
- Firebase project setup

### Client Setup
1. Navigate to the `client` directory:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add the necessary environment variables:
   ```plaintext
   VITE_APP_API_URL = http://localhost:YOUR_SERVER_PORT_HERE
   VITE_FIREBASE_API_KEY = "FIREBASE API KEY"
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

### Server Setup
1. Navigate to the `server` directory:
   ```sh
   cd server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add the necessary environment variables:
   ```plaintext
   PORT = 
   SECRET_KEY = 
   MONGO_DB_URL = 
   ```
4. Start the server:
   ```sh
   npm start
   ```

## Usage
- Visit `http://localhost:5173` to access the chat application.
- Sign in using Google authentication or create a custom account.
- Start chatting in real-time with other users.



## License
This project is licensed under the MIT License.

## Contact
For any inquiries, please contact [abdulmoiz8895@gmail.com].
