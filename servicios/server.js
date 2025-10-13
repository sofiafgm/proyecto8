require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
require('./models/initDB');

const authRoutes = require('./middleware/auth');
const mascotasRoutes = require('./routes/mascotas');
const adoptantesRoutes = require('./routes/adoptantes');
const adopcionesRoutes = require('./routes/adopciones');
const donadoresRoutes = require('./routes/donadores');
const donacionesRoutes = require('./routes/donaciones');
const resgistroRoutes = require('./routes/registro');
const usuariosRoutes = require('./routes/usuarios');

app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/mascotas', mascotasRoutes);
app.use('/adoptantes', adoptantesRoutes);
app.use('/adopciones', adopcionesRoutes);
app.use('/donadores', donadoresRoutes);
app.use('/donaciones', donacionesRoutes);
app.use('/registro', resgistroRoutes);
app.use('/usuarios', usuariosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
