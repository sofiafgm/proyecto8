const express = require('express');
const router = express.Router();
const db = require('../models/initDB');
const auth = require('../middleware/auth');

// POST
router.post('/', auth, (req, res) => {
  const { nombre, email, password } = req.body;

  db.run(
    `INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)`,
    [ nombre, email, password],
    function (err) {
      if (err) return res.status(500).send(err.message);
      db.get(
        `SELECT * FROM usuarios WHERE id = ?`,
        [this.lastID],
        (err, row) => {
          if (err) return res.status(500).send(err.message);
          res.status(201).json(row);
        }
      );
    }
  );
});

module.exports = router;
