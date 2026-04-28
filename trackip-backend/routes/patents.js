const router  = require('express').Router();
const db      = require('../db/connection');

// GET /api/patents?q=solar&status=Active&page=1&limit=12
router.get('/', async (req, res) => {
  try {
    const { q = '', status, category, page = 1, limit = 12 } = req.query;
    const offset = (Math.max(1, Number(page)) - 1) * Number(limit);
    const params = [];
    let where    = 'WHERE 1=1';

    if (q.trim()) {
      where += ' AND MATCH(title, abstract, keywords) AGAINST (? IN BOOLEAN MODE)';
      params.push(`${q.trim()}*`);
    }
    if (status)   { where += ' AND status = ?';   params.push(status); }
    if (category) { where += ' AND category = ?'; params.push(category); }

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM patents ${where}`, params
    );

    const [rows] = await db.query(
      `SELECT * FROM patents ${where}
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

// GET /api/patents/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM patents WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/patents  (admin — add a patent)
router.post('/', async (req, res) => {
  try {
    const { patent_number, title, owner, filing_date, status, category, abstract, keywords } = req.body;
    if (!patent_number || !title || !owner || !filing_date) {
      return res.status(400).json({ error: 'patent_number, title, owner and filing_date are required' });
    }
    const [result] = await db.query(
      `INSERT INTO patents (patent_number, title, owner, filing_date, status, category, abstract, keywords)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [patent_number, title, owner, filing_date, status || 'Pending', category || 'Utility', abstract || '', keywords || '']
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Patent number already exists' });
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
