const express = require('express');
const fs = require('fs');

let app = express();
const path = require('path');

const { verificaTokenImg } = require('../middlewares/autenticacion');


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImgSave = path.resolve(__dirname, `../../uploads/${tipo}/${img}` );
    if(fs.existsSync(pathImgSave)){
        res.sendFile(pathImgSave)
        
    }else {
        let noImagePath = path.resolve(__dirname, '../assets/no_img.jpg');
        res.sendFile(noImagePath);

    }

});



module.exports = app;
