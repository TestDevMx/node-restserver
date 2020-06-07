const jwt = require('jsonwebtoken');

/**
 * Verificar Token
 */

 let verificaToken = ( req, res, next ) => {

    let token = req.get('token'); 

    jwt.verify(token, process.env.SEED, (err, decode ) => {

        if(err){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'token no válido'
                }
            });
        }

        req.usuario = decode.usuario;

        next();

    });
 };

/**
 * Verifica Admin Role
 */
let verificaAdminRole = (req,res, next) => {

    let role = req.usuario.role;
    if(role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.json({
            ok:false,
            err: {
                message: 'El usuario no es administrador'
            } 
        });
    }

};

 module.exports = { 
     verificaToken,
     verificaAdminRole
 };