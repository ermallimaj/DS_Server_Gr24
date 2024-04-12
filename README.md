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

## Mongoose ORM Implementation

The Mongoose ORM is used to interact with the MongoDB database in this project. Here's how it's implemented:

1. **Schema Definition**: Mongoose provides a schema-based solution for defining the structure of data stored in MongoDB. In this project, the user schema is defined with fields such as name, email, username, and password, along with their types and validations.

2. **Middleware**: Mongoose middleware functionality is utilized to hash the user's password before saving it to the database. A pre-save hook is used to execute a function before saving a document, ensuring that the password is securely stored.

3. **Instance Methods**: Mongoose allows defining instance methods on schema, which can be used to perform operations specific to a document. In this project, a method to compare passwords is defined to validate user login credentials securely.

4. **Model Creation**: Mongoose provides a model interface for interacting with MongoDB collections. The User model is created using `mongoose.model`, specifying the schema and collection name. This model acts as an intermediary between the application and the MongoDB database, providing methods for CRUD operations.

## License

This project is licensed under the ISC License. See the LICENSE file for details.

## Contributors

- Ermal Limaj
- Lirak Xhelili
- Lorik Morina
- Milot Qorrolli
- Olti Ademi