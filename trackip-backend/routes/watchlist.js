const router = require('express').Router();
const db     = require('../db/connection');

// All routes require a user_id query param (replace with real auth middleware in production)
const getUser = (req, res) => {
  const uid = Number(req.query.user_id || req.body?.user_id);
  if (!uid) { res.status(401).json({ error: 'user_id required' }); return null; }
  return uid;
};

// GET /api/watchlist?user_id=1
router.get('/', async (req, res) => {
  const uid = getUser(req, res); if (!uid) return;
  try {
    const [rows] = await db.query(
      `SELECT w.id, w.item_type, w.item_id, w.notes, w.added_at,
              CASE w.item_type
                WHEN 'patent'    THEN p.title
                WHEN 'trademark' THEN t.name
              END AS title,
              CASE w.item_type
                WHEN 'patent'    THEN p.owner
                WHEN 'trademark' THEN t.owner
              END AS owner,
              CASE w.item_type
                WHEN 'patent'    THEN p.status
                WHEN 'trademark' THEN t.status
              END AS status,
              CASE w.item_type
                WHEN 'patent'    THEN p.filing_date
                WHEN 'trademark' THEN t.filing_date
              END AS filing_date
       FROM watchlist w
       LEFT JOIN patents    p ON w.item_type = 'patent'    AND w.item_id = p.id
       LEFT JOIN trademarks t ON w.item_type = 'trademark' AND w.item_id = t.id
       WHERE w.user_id = ?
       ORDER BY w.added_at DESC`,
      [uid]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/watchlist  — add item
router.post('/', async (req, res) => {
  const uid = getUser(req, res); if (!uid) return;
  try {
    const { item_type, item_id, notes = '' } = req.body;
    if (!item_type || !item_id) return res.status(400).json({ error: 'item_type and item_id required' });
    if (!['patent','trademark'].includes(item_type)) return res.status(400).json({ error: 'item_type must be patent or trademark' });

    const [result] = await db.query(
      `INSERT IGNORE INTO watchlist (user_id, item_type, item_id, notes) VALUES (?, ?, ?, ?)`,
      [uid, item_type, item_id, notes]
    );
    res.status(201).json({ inserted: result.affectedRows > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/watchlist/:id?user_id=1
router.delete('/:id', async (req, res) => {
  const uid = getUser(req, res); if (!uid) return;
  try {
    const [result] = await db.query(
      'DELETE FROM watchlist WHERE id = ? AND user_id = ?',
      [req.params.id, uid]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Not found or not yours' });
    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/watchlist/trends?user_id=1
router.get('/trends', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT category, year, month, patent_count, tm_count
       FROM filing_trends
       ORDER BY category, year, month`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
