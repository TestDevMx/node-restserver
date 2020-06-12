const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const _ = require('underscore');

let app = express();
const Producto = require('../models/producto');
const usuario = require('../models/usuario');
// const categoria = require('../models/categoria');


/**
 * Obtener todos los productos
 */
 app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    Producto.find({ disponible: true }, '')
            .skip(desde)
            .limit(limite)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, productoDB) =>{
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                Producto.countDocuments({ disponible: true }, (err, conteo) => {
                    res.json({
                        ok: true,
                        producto: productoDB,
                        cuantos: conteo
                    });
                });


            });



 });



/**
 * Obtener producto por ID
 */
app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});


/**
 * Buscar productos
 */
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }
    
            res.json({
                ok: true,
                producto: productoDB
            });


        });




});



/**
 * Crear un producto
 */
app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id,
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            producto: productoDB 
        });

    });
});


/**
 * Actualizar  un producto
 */
app.put('/productos/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;
    req.body.usuario = req.usuario._id;
    // let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria', 'usuario'])

    Producto.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id del producto no existe'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});


/**
 * Borrar  un producto (disponible a falso)
 */
app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Producto.findByIdAndUpdate(id, {disponible: false}, { new: true }, (err, productoBorrado)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!productoBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok:true,
            producto: productoBorrado
        })


    });

});


module.exports = app;