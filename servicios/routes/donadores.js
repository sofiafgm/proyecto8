const express = require('express');
const router = express.Router();
const db = require('../models/initDB');
const auth = require('../middleware/auth');

// GET all
router.get('/', auth, (req, res) => {
  db.all('SELECT * FROM donadores', [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// GET by id
router.get('/:id', (req, res) => {
    const { id } = req.params;
  
    db.get(`SELECT * FROM donadores WHERE id = ?`, [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Donador no encontrado' });
      res.json(row);
    });
  });

// POST
router.post('/', auth, (req, res) => {
  const { nombre, direccion, contacto, historial_donaciones } = req.body;
  db.run(
    `INSERT INTO donadores (nombre, direccion, contacto, historial_donaciones) VALUES (?, ?, ?, ?)`,
    [nombre, direccion, contacto, historial_donaciones],
    function (err) {
      if (err) return res.status(500).send(err.message);
      db.get(
        `SELECT * FROM donadores WHERE id = ?`,
        [this.lastID],
        (err, row) => {
          if (err) return res.status(500).send(err.message);
          res.status(201).json(row);
      });
    }
  );
});

// PUT
router.put('/:id', auth, (req, res) => {
  const { nombre, direccion, contacto, historial_donaciones } = req.body;
  db.run(
    `UPDATE donadores SET nombre=?, direccion=?, contacto=?, historial_donaciones=? WHERE id=?`,
    [nombre, direccion, contacto, historial_donaciones, req.params.id],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({ changes: this.changes });
    }
  );
});

// DELETE
router.delete('/:id', auth, (req, res) => {
  db.run(`DELETE FROM donadores WHERE id=?`, [req.params.id], function (err) {
    if (err) return res.status(500).send(err.message);
    res.json({ changes: this.changes });
  });
});

module.exports = router;
