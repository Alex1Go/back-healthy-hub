# Backend of the "HealtHyhub-Project"

Base URL: https://vycheslav1.github.io/healthyhub-project/

## General information

The "HealtHyhub-Project" is an API for processing requests from the front end related to tracking user health data. Basic functions include registration, login, management of food intake data, water consumption, and various calculations related to the user's health.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT
- Swagger UI Express
- Other npm modules: (bcrypt, cors, cross-env, dotenv, joi, nodemailer, uuid)

## Setting Up the Development Server

Clone this repository.
Run npm install to install the necessary dependencies.
Create a .env file and configure your environment variables, including database connection details and secret keys.
Run npm start to start the development server.

## API Documentation

### Endpoints

1. User Authentication:

- POST /api/auth/signup: Register a new user.
- POST /api/auth/signin: User login with token generation.
- POST /api/auth/forgot-password: Update user password and send a new password to the user's email.
- POST /api/auth/signout: User logout.

2. User Information:

- GET /api/user/current: Get user information, including calculated BMR, daily water intake, and macronutrient ratios.
- PUT /api/user/update: Update user information with BMR, daily water intake, and macronutrient ratios recalculation.
- PUT /api/user/goal: Update user goal and macronutrient ratios.

3. User Data Management:

- POST /api/user/weight: Add user's weight information for the current date.
- POST /api/user/food-intake: Save information about the user's food intake for the current date.
- PUT /api/user/food-intake/:id: Update information about a specific food intake record.
- DELETE /api/user/food-intake/: Delete information about food intake for the current date.
- POST /api/user/water-intake: Save information about the user's water intake for the current date.
- DELETE /api/user/water-intake: Delete information about water intake for the current date.

4. User Statistics:

- GET /api/user/statistics: Get statistics on calorie consumption, water intake, and weight over a selected period.

5. Recommended Food:

- GET /api/recommended-food: Get a list of recommended food items.

Feel free to explore the API documentation for more details on request and response formats for each endpoint. https://healthy-hub-2d3x.onrender.com/api-docs
