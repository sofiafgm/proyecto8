const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/refugio.sqlite');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS mascotas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    especie TEXT,
    raza TEXT,
    edad INTEGER,
    estado_salud TEXT,
    descripcion TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS adoptantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    direccion TEXT,
    contacto TEXT,
    historial_adopciones INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS adopciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_mascota INTEGER,
    id_adoptante INTEGER,
    fecha_adopcion TEXT,
    observaciones TEXT,
    FOREIGN KEY(id_mascota) REFERENCES mascotas(id),
    FOREIGN KEY(id_adoptante) REFERENCES adoptantes(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    email TEXT UNIQUE,
    password TEXT
  )`);
});

module.exports = db;
