# CivicConnect (SEN381)
 
CivicConnect is a modern, citizen-focused service request management platform designed to streamline municipal issue logging, track repair progress in real time, and establish end-to-end accountability between residents, municipal staff, and management.
 
---
 
## Authors & Team Roles
 
- **Ayanda Mabena** (Member 1): System Architecture, Technology Stack & Governance Lead
- **Refilwe Segele** (Member 2): Data Engineering & Backend API Lead
- **Nompilo Mbense** (Member 3): Requirements, Traceability & Frontend UI Lead
---
 
## Technology Stack
 
| Layer | Technologies |
|-------|--------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript (Factory Pattern for request payloads) |
| Backend | Node.js, Express.js (REST API) |
| Database | MongoDB with Mongoose |
| Architecture | Controller / Service / Repository layering, role-based access control |
| Dev Tools | nodemon, dotenv, GitHub Actions (CI/CD) |
 
---
 
## Repository Structure
 
```text
CivicConnect_SEN381/
├── .github/
│   └── workflows/                  # GitHub Actions CI/CD pipeline
├── civicconnect-backend/           # Express.js REST API & MongoDB data layer
│   ├── src/
│   │   ├── config/                 # Database connection
│   │   ├── controllers/            # Request handlers & response formatting
│   │   ├── middleware/             # Error handling, role-based access & auth checks
│   │   ├── models/                 # Mongoose schemas (User, Request, AuditLog)
│   │   ├── repositories/           # Repository pattern data layer
│   │   ├── routes/                 # Express API routes
│   │   ├── services/               # Core business logic & state machine rules
│   │   └── app.js                  # Server entry point
│   ├── .env.example                # Template environment configuration
│   └── package.json
│
├── civicconnect-frontend/          # Web client UI & design pattern modules
│   ├── public/
│   │   ├── css/
│   │   │   └── style.css           # Portal layout & real-time status badges
│   │   └── index.html              # Service request form & history view
│   └── src/
│       ├── app.js                  # Frontend DOM controller & API fetch handlers
│       └── request-factory.js      # Factory Pattern pre-flight payload validation
│
├── CivicConnect_SEN381 Milestone 1.docx
├── SEN381_Milestone_1.pdf
└── README.md
```
 
---
 
## Prerequisites
 
Make sure the following are installed before you begin:
 
- **Node.js** v18.x or higher ([download](https://nodejs.org/))
- **npm** v9.x or higher (included with Node.js)
- **MongoDB**: a running local instance (`mongodb://localhost:27017`) **or** a MongoDB Atlas connection string
---
 
## Setup Instructions
 
### 1. Clone the repository
 
```bash
git clone https://github.com/RefilweSegele/CivicConnect_SEN381.git
cd CivicConnect_SEN381
```
 
### 2. Backend setup (`civicconnect-backend`)
 
Navigate to the backend directory and install dependencies:
 
```bash
cd civicconnect-backend
npm install
```
 
Create your environment file from the template:
 
```bash
cp .env.example .env
```
 
Open `.env` and fill in your values:
 
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/civicconnect
JWT_SECRET=your_jwt_secret_key_here
```
 
Start the API server in development mode (auto-restarts on changes via nodemon):
 
```bash
npm run dev
```
 
The Express backend runs at <http://localhost:3000>. Confirm it is alive at <http://localhost:3000/health>.
 
### 3. Frontend setup (`civicconnect-frontend`)
 
Open a **new terminal** and serve the static files. Use a port different from the backend's:
 
```bash
cd civicconnect-frontend
npx serve public -l 5000
```
 
You can also use the VS Code Live Server extension. Then open <http://localhost:5000> in your browser.
 
---
 
## Testing & Quality Assurance
 
Run backend unit and integration tests:
 
```bash
cd civicconnect-backend
npm test
```
 
Run frontend Factory Pattern tests:
 
```bash
cd civicconnect-frontend
npm run test:unit
```
 
---
 
## CI/CD Pipeline
 
This repository uses **GitHub Actions** to automatically run unit and integration tests for both `civicconnect-backend` and `civicconnect-frontend` on every push and pull request to `main`.
 
