const express = require("express");
const router = express.Router();
const db = require("../models/initDB");
const auth = require("../middleware/auth");

// GET all
router.get("/", auth, (req, res) => {
    db.all(
        `SELECT a.id, a.id_donador, ad.nombre AS nombre_donador,
                     a.fecha_donacion,
                     a.monto_donacion,
                     a.forma_donacion
       FROM donaciones a
       JOIN donadores ad ON a.id_donador = ad.id`,
        [],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

// GET by id
router.get("/:id", (req, res) => {    
    const { id } = req.params;

    db.get(
        `SELECT a.id, a.id_donador, ad.nombre AS nombre_donador,
      a.fecha_donacion,
      a.monto_donacion,
      a.forma_donacion
      FROM donaciones a
      JOIN donadores ad ON a.id_donador = ad.id
      WHERE a.id = ?`,
        [id],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row)
                return res
                    .status(404)
                    .json({ error: "Donación no encontrada" });
            res.json(row);
        }
    );
});

// POST
router.post("/", (req, res) => {
    const { id_donador, fecha_donacion } =
        req.body;

    if (!id_donador || !fecha_donacion) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    db.run(
        `INSERT INTO donaciones (id_donador, fecha_donacion)
     VALUES (?, ?, ?, ?)`,
        [id_donador, fecha_donacion],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            db.get(
                `SELECT a.id, m.nombre AS nombre_mascota,
      a.id_donador, ad.nombre AS nombre_donador,
      a.fecha_donacion,
      a.monto_donacion,
      a.forma_donacion
      FROM donaciones a
      JOIN donadors ad ON a.id_donador = ad.id
      WHERE a.id = ?`,
                [this.lastID],
                (err, row) => {
                    if (err)
                        return res.status(500).json({ error: err.message });
                    res.status(201).json(row);
                }
            );
        }
    );
});

// PUT
router.put("/:id", (req, res) => {
    const { id_donador, fecha_donacion } =
        req.body;
    const { id } = req.params;

    db.run(
        `UPDATE donaciones SET
         id_donador = ?,
         fecha_donacion = ?,
         a.monto_donacion = ?,
         a.forma_donacion = ?
       WHERE id = ?`,
        [id_donador, fecha_donacion, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: "Donación actualizada" });
        }
    );
});

// DELETE
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM donaciones WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "Donación eliminada" });
    });
});

module.exports = router;
