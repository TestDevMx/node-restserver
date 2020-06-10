require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path    = require('path');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// Habilitar la carpeta public
app.use(express.static( path.resolve( __dirname, '../public' )));

// Confuguración global de rutas
app.use( require('./rutas/index') );

 
mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,})
            .then((resp) => console.log('Base ONLINE en puerto: ', resp.connection.port));
            

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});