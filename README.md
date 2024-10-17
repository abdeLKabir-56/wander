# Wander - A Collaborative Social App for Travelers

Wander is a collaborative social application designed for travelers to share their experiences, stories, and adventures with a community of fellow travelers. The platform allows users to create blog posts, interact with other users through comments and likes, discover new destinations, and connect with like-minded individuals.

## Overview

Wander aims to provide a comprehensive platform for travelers to:

- Share their travel experiences through blog posts
- Interact with other users by commenting on posts and liking content
- Discover new destinations and get inspired for their next adventure
- Connect with a community of fellow travelers to exchange tips, recommendations, and stories

## Key Features

### User Authentication and Authorization

Wander implements user authentication and authorization using JSON Web Tokens (JWT), ensuring secure access to user accounts and protected resources.

### Blog Post Management

Users can create, edit, and delete blog posts, including uploading images and categorizing posts based on destination or theme.

### Interactive Features

Wander includes interactive features such as commenting on posts, liking content, and signaling inappropriate or offensive posts for moderation.

### Real-time Updates (Optional)

The platform supports real-time updates using Socket.IO, enabling live chat and notifications for users.

### Chatbot Integration

Wander integrates a chatbot powered by Google Generative AI, providing users with personalized recommendations, travel tips, and answers to common questions.

### API Documentation

The project includes comprehensive API documentation using the OpenAPI Specification, facilitating easy integration with external services and clients.

## Technologies Used

- Node.js ![Node.js](https://img.icons8.com/color/48/000000/nodejs.png)
- Express.js ![Express.js](https://img.icons8.com/color/48/000000/expressjs.png)
- MongoDB ![MongoDB](https://img.icons8.com/color/48/000000/mongodb.png)
- Mongoose ![Mongoose](https://img.icons8.com/color/48/000000/mongoose.png)
- JSON Web Tokens (JWT) ![JWT](https://img.icons8.com/color/48/000000/json.png)
- bcrypt ![bcrypt](https://img.icons8.com/ios-filled/50/000000/lock-2.png)
- dotenv ![dotenv](https://img.icons8.com/ios/50/000000/password.png)
- multer ![multer](https://img.icons8.com/ios/50/000000/upload.png)
- Chart.js ![Chart.js](https://img.icons8.com/ios/50/000000/combo-chart.png)
- Google Generative AI ![Google Generative AI](https://img.icons8.com/color/48/000000/google-logo.png)
- Socket.IO (optional) ![Socket.IO](https://img.icons8.com/color/48/000000/socket-io.png)
- OpenAPI Specification ![OpenAPI](https://img.icons8.com/color/48/000000/api.png)

## Getting Started

To get started with Wander, follow these steps:


1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/abdeLKabir-56/wander
   ```
2. Install dependency using npm or yarn:
   ```bash
   npm install
   OR
   yarn install
   ```
3. Set up environment variables using a .env file. Refer to the section below for the required variables.
4. Run the application using npm or yarn :
   ```bash
   npm run dev
   OR
   yarn start
   ```


# Environment Variables

To ensure the application runs smoothly, please configure the following environment variables in your `.env` file.

---

## Required Environment Variables

| **Variable**               | **Description**                                                                                                                                       |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| `COOKIE_KEY`               | A **secret key** used for signing cookies. It ensures the integrity and security of the cookie data exchanged between the client and the server.     |
| `CLIENT_SECRET_FACEBOOK`   | The **client secret** provided by Facebook for OAuth authentication. It is used to authenticate requests to Facebook's API when users log in.        |
| `CLIENT_ID_FACEBOOK`       | The **client ID** assigned by Facebook for your application. This ID is used to identify your app when making requests to the Facebook API.           |
| `CLIENT_SECRET_GOOGLE`     | The **client secret** provided by Google for OAuth authentication. It is required to authenticate and authorize users through Google Sign-In.         |
| `CLIENT_ID_GOOGLE`         | The **client ID** assigned by Google for your application. It is used to identify your app in requests made to Google APIs.                           |
| `MONGO_LOCAL_URL`          | The **connection string** for your local MongoDB database. This URL is used to connect the application to your MongoDB instance.                      |
| `JWT_SECRET_KEY`           | A **secret key** used for signing JSON Web Tokens (JWTs). This key is crucial for creating and verifying JWTs for user authentication.                |
| `CHAT_API_KEY`             | The **API key** used to authenticate requests to the chat service. It is necessary for enabling chat functionalities within the application.            |
| `PORT`                      | The **port number** on which the application will run. By default, it is often set to `3000` but can be configured to any other available port.     |

---

## Important Notes

- Ensure to replace any placeholders with the actual values when setting up your `.env` file.
- It is a good practice to keep your `.env` file out of version control (e.g., using `.gitignore`) to protect sensitive information.


         

## Contributing

Contributions to Wander are welcome! If you'd like to contribute, please follow these guidelines:
- Fork the repository.
- Create a new branch for your feature or bug fix.
- Make your changes and ensure tests pass.
- Submit a pull request with a detailed description of your changes.

