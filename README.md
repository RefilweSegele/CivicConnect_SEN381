# CivicConnect (SEN381)

CivicConnect is a modern, citizen-focused service request management platform designed to streamline municipal issue logging, track repair progress in real time, and establish end-to-end accountability between residents, municipal staff, and management.

---

## Authors & Team Roles
- **Ayanda Mabena** (Member 1): System Architecture, Technology Stack & Governance Lead
- **Refilwe Segele** (Member 2): Data Engineering & Backend API Lead
- **Nompilo Mbense** (Member 3): Requirements, Traceability & Frontend UI Lead

---

## Repository Structure


CivicConnect_SEN381/
├── civicconnect-backend/           # Express.js REST API & MongoDB Data Layer
│   ├── src/
│   │   ├── controllers/            # Request handlers & response formatting
│   │   ├── middleware/             # Role-based access control & auth checks
│   │   ├── models/                 # Mongoose schemas (User, Request, AuditLog)
│   │   ├── repositories/           # Repository pattern data layer
│   │   ├── routes/                 # Express API routes
│   │   └── services/               # Core business logic & state machine rules
│   ├── .env.example                # Template environment configuration
│   └── package.json
│
├── civicconnect-frontend/          # Web Client UI & Design Pattern Modules
│   ├── public/
│   │   ├── css/
│   │   │   └── style.css           # Portal layout & real-time status badges
│   │   └── index.html              # Service request form & history view
│   └── src/
│       ├── app.js                  # Frontend DOM controller & API fetch handlers
│       └── request-factory.js      # Factory Pattern pre-flight payload validation
│
├── CivicConnect_SEN381 Milestone 1.docx
├── CivicConnect_SEN381_Milestone_2_v2.pdf
└── README.md

---
Prerequisites & Installation
Before setting up the project, make sure you have the following software installed on your system:

Node.js: v18.x or higher (Download Node.js)

npm: v9.x or higher (included automatically with Node.js)

MongoDB: A running local MongoDB instance (mongodb://localhost:27017) OR a MongoDB Atlas connection string

---

Step-by-Step Setup Instructions

1. Clone the Repository
   
git clone
cd CivicConnect_SEN381

2. Backend Setup (civicconnect-backend)
Navigate to the backend directory:
cd civicconnect-backend

Install Node.js dependencies:
npm install

Configure Environment Variables:
Create a .env file in the civicconnect-backend root folder by copying the example template:
cp .env.example .env

Open .env and fill in your connection string and JWT secret:

Code snippet
PORT=3000
MONGO_URI=mongodb://localhost:27017/civicconnect
JWT_SECRET=your_jwt_secret_key_here
Seed Database (Optional):
To populate test users and initial request entries:
npm run seed

Start the API Server:
npm start

The Express backend server will start running on http://localhost:3000.

3. Frontend Setup (civicconnect-frontend)
Open a new terminal tab/window and navigate to the frontend folder:
cd civicconnect-frontend

Serve static frontend files:
You can serve the static files using npx serve or the VS Code Live Server extension:
npx serve public

Access the Portal:
Open your browser and navigate to the local address provided by your static server (e.g., http://localhost:3000 or http://localhost:5000).

Testing & Quality Assurance
Run Backend Unit & Integration Tests:
cd civicconnect-backend
npm test

Run Frontend Factory Pattern Tests:
cd civicconnect-frontend
npm run test:unit
