require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');

const patentsRouter    = require('./routes/patents');
const trademarksRouter = require('./routes/trademarks');
const watchlistRouter  = require('./routes/watchlist');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan('dev'));

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use('/api/patents',    patentsRouter);
app.use('/api/trademarks', trademarksRouter);
app.use('/api/watchlist',  watchlistRouter);

// Trends (no auth needed)
const db = require('./db/connection');
app.get('/api/trends', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT category, year, month, patent_count, tm_count
       FROM filing_trends
       ORDER BY category, year, month`
    );
    // Group by category
    const grouped = {};
    rows.forEach(r => {
      if (!grouped[r.category]) grouped[r.category] = [];
      grouped[r.category].push(r);
    });
    res.json(grouped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`TrackIP API running on http://localhost:${PORT}`));
