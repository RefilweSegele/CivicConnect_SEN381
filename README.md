# CivicConnect (SEN381)

CivicConnect is a modern, citizen-focused service request management platform designed to streamline municipal issue logging, track repair progress in real time, and establish end-to-end accountability between residents, municipal staff, and management.

---

## Authors & Team Roles
| Member            | Role                                                   |
|-------------------|--------------------------------------------------------|
| Ayanda Mabena     | System Architecture, Technology Stack & Governance Lead |
| Refilwe Segele    | Data Engineering & Backend API Lead                     |
| Nompilo Mbense    | Requirements, Traceability & Frontend UI Lead           |

---

## Repository Structure
```text
CivicConnect_SEN381/
├── civicconnect-backend/        # Express.js REST API & MongoDB Data Layer
│   ├── src/
│   │   ├── controllers/         # Request handlers & response formatting
│   │   ├── middleware/          # Role-based access control & auth checks
│   │   ├── models/              # Mongoose schemas (User, Request, AuditLog)
│   │   ├── repositories/        # Repository pattern data layer
│   │   ├── routes/              # Express API routes
│   │   └── services/            # Core business logic & state machine rules
│   ├── .env.example             # Template environment configuration
│   └── package.json
│
├── civicconnect-frontend/       # Web Client UI & Design Pattern Modules
│   ├── public/
│   │   ├── css/
│   │   │   └── style.css        # Portal layout & real-time status badges
│   │   └── index.html           # Service request form & history view
│   └── src/
│       ├── app.js               # Frontend DOM controller & API fetch handlers
│       └── request-factory.js   # Factory Pattern pre-flight payload validation
│
├── CivicConnect_SEN381 Milestone 1.docx
├── CivicConnect_SEN381_Milestone_2_v2.pdf
└── README.md

---

Core System Architecture
CivicConnect is implemented as a layered monolith using Node.js, Express, and MongoDB (via Mongoose), designed around four core Architecturally Significant Requirements (ASRs):

ASR-01 (Role-Based Access Control): Restricts system capabilities so residents, staff, and management access only data within their authorized scope.

ASR-02 (Consistent Status Visibility): Ensures all reads pass through a unified service/repository path to guarantee live, authoritative request tracking.

ASR-03 (Data Integrity Across Lifecycle): Centralizes state transition rules (Submitted → In Progress → Resolved → Closed) and logs all actions to an auditable AuditLog collection.

ASR-04 (Proportional Complexity): Utilizes a clean, single-codebase structure optimized for local development and straightforward deployment.

Requirements Traceability Matrix (RTM)
Req ID	Requirement Summary	Architectural Layer / Code File	Status
FR-001	Submit Service Request	index.html → RequestFactory → POST /api/requests	Implemented
FR-002	Categorize Request	Client RequestFactory validation & RequestSchema enum	Implemented
FR-003	Real-Time Status Tracking	app.js UI render → GET /api/requests	Implemented
FR-004	View "My Requests" History	index.html Request List → requestRepository.js	Implemented
FR-013	Role-Based Access Control	authMiddleware.js route guards	Implemented
NFR-001	Dashboard Load Time < 3s	Lightweight ES6 Vanilla Client & optimized REST payloads	Verified
NFR-002	Protect User Data	Password hashing & protected JWT API routes	Verified

---

Prerequisites
Node.js: v18.x or higher

npm: v9.x or higher (bundled with Node.js)

MongoDB: Local instance (mongodb://localhost:27017) or MongoDB Atlas connection string
---

Setup Instructions
1. Clone the repository
bash
git clone 
cd CivicConnect_SEN381

2. Backend Setup (civicconnect-backend)
cd civicconnect-backend
npm install
cp .env.example .env

Fill in .env:
PORT=3000
MONGO_URI=mongodb://localhost:27017/civicconnect
JWT_SECRET=your_jwt_secret_key_here

Seed database (optional):
npm run seed

Start backend server:
npm start

Backend runs at: http://localhost:3000


3. Frontend Setup (civicconnect-frontend)

cd civicconnect-frontend
npx serve public
Access portal via: http://localhost:3000 or http://localhost:5000

Testing & Quality Assurance
Run backend tests:


cd civicconnect-backend
npm test
Run frontend tests:


cd civicconnect-frontend
npm run test:unit
