# CivicConnect - SEN381 Milestone 1 & 2 Platform Baseline

CivicConnect is a citizen-service management portal built to enable citizens to log infrastructural issues, track repair progress, and view historical requests.

## Authors & Roles
- **Ayanda Mabena** (Member 1): Architecture Lead & System Infrastructure
- **Refilwe Segele** (Member 2): Data Engineering & Backend API Lead
- **Nompilo Mbense** (Member 3): Frontend/UI, Design Patterns & Traceability Lead

---

## Repository Structure

CivicConnect_SEN381/
├── civicconnect-backend/       # Express.js REST API & MongoDB Data Layer
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   └── services/
│   ├── .env.example
│   └── package.json
│
├── civicconnect-frontend/      # Lightweight Client UI & Design Patterns
│   ├── public/
│   │   ├── css/style.css
│   │   └── index.html
│   └── src/
│       ├── app.js
│       └── request-factory.js  # Factory Pattern (Design Decision #2)
│
├── CivicConnect_SEN381 Milestone 1.docx
└── README.md
