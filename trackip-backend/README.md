# TrackIP Backend

## Folder Structure
```
trackip-backend/
├── server.js
├── package.json
├── .env
├── db/
│   ├── connection.js
│   ├── schema.sql
│   └── seed.sql
└── routes/
    ├── patents.js
    ├── trademarks.js
    └── watchlist.js
```

## Setup Instructions

### Step 1 — Set up the database
Open MySQL and run:
```
SOURCE path/to/db/schema.sql;
SOURCE path/to/db/seed.sql;
```

### Step 2 — Install dependencies
```
npm install
```

### Step 3 — Start the server
```
npm run dev
```

Server runs on http://localhost:3001

## API Endpoints
- GET  /api/patents
- GET  /api/patents/:id
- POST /api/patents
- GET  /api/trademarks
- GET  /api/trademarks/:id
- POST /api/trademarks
- GET  /api/watchlist?user_id=1
- POST /api/watchlist
- DELETE /api/watchlist/:id
- GET  /api/trends
- GET  /api/health
