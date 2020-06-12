const express = require('express');
let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');


let app = express();
let Categoria = require('../models/categoria');
const usuario = require('../models/usuario');
const categoria = require('../models/categoria');


/**
 * Mostrar todas las categorias
 */
app.get('/categoria', verificaToken, (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Categoria.find({}, '')
    .sort('descripcion')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categoria: categoriaDB,
                    cuantos: conteo
                });
            });


        });


});



/**
 * Mostrar catgoria por ID
 */
app.get('/categoria/:id', verificaToken, (req, res) => {

    // Categoria.findById();

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });

    });



});

/**
 * Crear nueva categoria
 */
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});


/**
 * Actualizar categoria
 */
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let desc = {
        descripcion: req.body.descripcion,
        usuario: req.usuario._id
    }

    Categoria.findByIdAndUpdate(id, desc, { new: true, runValidators: true }, (err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });

});

/**
 * Borrar categoria
 */
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        })

    });


});



module.exports = app;