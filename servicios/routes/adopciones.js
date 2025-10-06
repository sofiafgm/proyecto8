const express = require("express");
const router = express.Router();
const db = require("../models/initDB");
const auth = require("../middleware/auth");

// GET all
router.get("/", auth, (req, res) => {
    db.all(
        `SELECT a.id, a.id_mascota, m.nombre AS nombre_mascota,
                     a.id_adoptante, ad.nombre AS nombre_adoptante,
                     a.fecha_adopcion, a.observaciones
       FROM adopciones a
       JOIN mascotas m ON a.id_mascota = m.id
       JOIN adoptantes ad ON a.id_adoptante = ad.id`,
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
        `SELECT a.id, a.id_mascota, m.nombre AS nombre_mascota,
      a.id_adoptante, ad.nombre AS nombre_adoptante,
      a.fecha_adopcion, a.observaciones
      FROM adopciones a
      JOIN mascotas m ON a.id_mascota = m.id
      JOIN adoptantes ad ON a.id_adoptante = ad.id
      WHERE a.id = ?`,
        [id],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row)
                return res
                    .status(404)
                    .json({ error: "Adopción no encontrada" });
            res.json(row);
        }
    );
});

// POST
router.post("/", (req, res) => {
    const { id_mascota, id_adoptante, fecha_adopcion, observaciones } =
        req.body;

    if (!id_mascota || !id_adoptante || !fecha_adopcion) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    db.run(
        `INSERT INTO adopciones (id_mascota, id_adoptante, fecha_adopcion, observaciones)
     VALUES (?, ?, ?, ?)`,
        [id_mascota, id_adoptante, fecha_adopcion, observaciones],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            db.get(
                `SELECT a.id, a.id_mascota, m.nombre AS nombre_mascota,
      a.id_adoptante, ad.nombre AS nombre_adoptante,
      a.fecha_adopcion, a.observaciones
      FROM adopciones a
      JOIN mascotas m ON a.id_mascota = m.id
      JOIN adoptantes ad ON a.id_adoptante = ad.id
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
    const { id_mascota, id_adoptante, fecha_adopcion, observaciones } =
        req.body;
    const { id } = req.params;

    db.run(
        `UPDATE adopciones SET
         id_mascota = ?,
         id_adoptante = ?,
         fecha_adopcion = ?,
         observaciones = ?
       WHERE id = ?`,
        [id_mascota, id_adoptante, fecha_adopcion, observaciones, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: "Adopción actualizada" });
        }
    );
});

// DELETE
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM adopciones WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "Adopción eliminada" });
    });
});

module.exports = router;
