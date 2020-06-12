const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;


module.exports = mongoose.model('Categoria', new mongoose.Schema({

    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es obligatoria']
    },
    usuario:{
        type: Schema.Types.ObjectId, ref: 'Usuario'
    }

}));