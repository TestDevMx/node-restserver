const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const usuario = require('../models/usuario');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function (req, res) {



    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo.'
            }

        });
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.')
    let extension = nombreCortado[nombreCortado.length - 1];
 
    // Extenciones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extensión no valida, solo se permite: ' + extensionesValidas.join(', ')
            }
        })
    }


    // Validat tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo no valido, solo se permite: ' + tiposValidos.join(', ')
            }
        })
    }



    // Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        }else{
            imagenProducto(id, res, nombreArchivo);
        }
        
    });


});



let imagenUsuario = (id, res, nombreArchivo) => {

    Usuario.findById(id, (err, usuarioDB) => {

        if(err){
            borrarArchivo(`usuarios/${nombreArchivo}`)
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB){
            borrarArchivo(`usuarios/${nombreArchivo}`)
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }


        borrarArchivo(`usuarios/${usuarioDB.img}`)
        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {


            res.json({
                ok:true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })

        });

    });


}


function imagenProducto(id, res, nombreArchivo){

    Producto.findById(id, (err, productoBD) => {

        if(err){
            borrarArchivo(`productos/${nombreArchivo}`)
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoBD){
            borrarArchivo(`productos/${nombreArchivo}`)
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }


        borrarArchivo(`productos/${productoBD.img}`)
        productoBD.img = nombreArchivo;

        productoBD.save((err, productoGuardado) => {


            res.json({
                ok:true,
                prdoducto: productoGuardado,
                img: nombreArchivo
            })

        });

    });

}

let borrarArchivo = (img) => {

    let pathImg = path.resolve(__dirname, '../../uploads/' + img);
    console.log(pathImg)
     
    if( fs.existsSync(pathImg)){
        fs.unlinkSync(pathImg);
    }

}



module.exports = app;