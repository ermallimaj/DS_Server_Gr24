# DS Server (Group 24)

This is the backend server for the DS (Data Structures) project developed by Group 24. It provides RESTful APIs for user authentication and management.

## Features

- User signup: Allows users to create an account by providing their name, email, username, and password.
- User login: Allows users to authenticate themselves by providing their username and password.
- Password hashing: Securely stores user passwords using bcrypt hashing algorithm.
- CORS support: Enables Cross-Origin Resource Sharing (CORS) to allow access from different origins.
- MongoDB integration: Stores user data in a MongoDB database using Mongoose ODM.
- Express.js framework: Built on top of Express.js, a minimalist web application framework for Node.js.
- Automatic server restarts: Utilizes nodemon for automatic server restarts upon file changes during development.

## Getting Started

To get started with the server, follow these steps:

- Clone this repository to your local machine.
- Install dependencies using npm:
  ```
  npm install
  ```
- Set up a MongoDB database and update the connection URI in `server.js` file.
- Start the server:
  ```
  npm start
  ```
- The server will be running on http://localhost:3000 by default.

## API Documentation

- **POST /api/v1/users/signup**: Create a new user account.
  - Request body: { name, email, username, password }
  - Response: { status, message, user }

- **POST /api/v1/users/login**: Authenticate a user.
  - Request body: { username, password }
  - Response: { success, message, user }

## Contributors

- Ermal Limaj
- Lirak Xhelili
- Lorik Morina
- Milot Qorrolli
- Olti Ademi
