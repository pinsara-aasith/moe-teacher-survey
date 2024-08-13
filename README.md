# Teacher Survey Application (Ministry of Education)

This is a Next.js application designed for conducting teacher surveys for the Ministry of Education.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication using JWT
- Secure login and registration
- Role-based access control
- Survey creation and management
- Data visualization for survey results
- Responsive design

## Getting Started

These instructions will help you set up and run the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js (version 12 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/teacher-survey-app.git
    cd teacher-survey-app
    ```

2. Install the dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Configuration

1. Create a `.env.local` file in the root directory and add the following environment variables:
    ```env
    DATABASE_URL=mongodb://localhost:27017/yourdbname
    JWT_SECRET=your_jwt_secret
    NEXTAUTH_URL=http://localhost:3000
    ```

2. Replace `yourdbname` with the name of your MongoDB database and `your_jwt_secret` with a secure secret key for JWT.

### Running the Application

1. Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API Endpoints

- `POST /api/auth/login` - Login user and return JWT token
- `POST /api/auth/register` - Register a new user
- `GET /api/surveys` - Get all surveys (requires authentication)
- `POST /api/surveys` - Create a new survey (requires admin role)
- `GET /api/surveys/:id` - Get a single survey (requires authentication)
- `PUT /api/surveys/:id` - Update a survey (requires admin role)
- `DELETE /api/surveys/:id` - Delete a survey (requires admin role)

## Technologies Used

- Next.js
- React
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Tailwind CSS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
