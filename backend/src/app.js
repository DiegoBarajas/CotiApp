const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const fileUpload = require("express-fileupload");
const app = express();

//Middlewares
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  limits: {fileSize: 50 * 2024 * 1024}
}))

//Configuracion de cloudinary
cloudinary.config({
    cloud_name: "dnrfswnwp",
    api_key: "921266923712888",
    api_secret: "aIqied7-eqpoNOEt_8TNv8TVbj0"
  });
  

//Asignacion de servidor
app.set('port', process.env.PORT || 4000);

app.get('/', (req, res)=>{
  res.send('Backend de CotiApp');
})

//Rutas
app.use('/api/empresa', require('./routes/empresa.route'));
app.use('/api/usuario', require('./routes/usuario.route'));
app.use('/api/login', require('./routes/login.route'));
app.use('/api/cliente', require('./routes/cliente.route'));
app.use('/api/cotizacion', require('./routes/cotizacion.route'));
app.use('/api/ticket', require('./routes/ticket.route'));
app.use('/api/item', require('./routes/item.route'));
app.use('/api/enviar/cotizacion', require('./routes/enviarCotizaciones.route'));
app.use('/api/enviar/ticket', require('./routes/enviarTickets.route'));
app.use('/descargar', require('./routes/download.route'));

app.get('/setup.exe', (req, res)=>{
  res.sendFile('setup.exe', {root: 'src'})
})


module.exports = app;