const mongoose = require('mongoose');
var colors = require('colors/safe');


mongoose.set('strictQuery', false);

require('dotenv').config();
const URI = process.env.MONGODB_URI
            ? process.env.MONGODB_URI
            : 'mongodb://127.0.0.1/test';

mongoose.connect(URI);

const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log(colors.cyan("La base de datos de lanzó en el puerto " +URI+'\n'));
});