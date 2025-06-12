# Grocer Auth Wizard

A powerful automation tool for managing grocery platform accounts (Blinkit, Zepto, Instamart) with a modern web interface.

## Features

- 🔐 Secure authentication system
- 🤖 Automated browser interactions using Puppeteer
- 📱 Modern React + TypeScript frontend
- 🎨 Beautiful UI with Tailwind CSS
- 🔄 Real-time session management
- 📊 MongoDB integration for data persistence

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: MongoDB
- Automation: Puppeteer
- Authentication: JWT

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/grocer-auth-wizard.git
cd grocer-auth-wizard
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
Create a `.env` file in the backend directory with:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the development servers:
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Log in using your credentials
3. Use the interface to manage your grocery platform accounts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
