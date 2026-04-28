const router = require('express').Router();
const db     = require('../db/connection');

// GET /api/trademarks?q=ultra&status=Active&page=1&limit=12
router.get('/', async (req, res) => {
  try {
    const { q = '', status, page = 1, limit = 12 } = req.query;
    const offset = (Math.max(1, Number(page)) - 1) * Number(limit);
    const params = [];
    let where    = 'WHERE 1=1';

    if (q.trim()) {
      where += ' AND MATCH(name, goods_services) AGAINST (? IN BOOLEAN MODE)';
      params.push(`${q.trim()}*`);
    }
    if (status) { where += ' AND status = ?'; params.push(status); }

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM trademarks ${where}`, params
    );

    const [rows] = await db.query(
      `SELECT * FROM trademarks ${where}
       ORDER BY filing_date DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    res.json({ total, page: Number(page), limit: Number(limit), results: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/trademarks/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM trademarks WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/trademarks  (admin)
router.post('/', async (req, res) => {
  try {
    const { trademark_number, name, owner, filing_date, status, goods_services } = req.body;
    if (!trademark_number || !name || !owner || !filing_date) {
      return res.status(400).json({ error: 'trademark_number, name, owner and filing_date are required' });
    }
    const [result] = await db.query(
      `INSERT INTO trademarks (trademark_number, name, owner, filing_date, status, goods_services)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [trademark_number, name, owner, filing_date, status || 'Pending', goods_services || '']
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Trademark number already exists' });
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
