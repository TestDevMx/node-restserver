/**
 * Puerto
 */
process.env.PORT = process.env.PORT || 3000;


/**
 * Base de datos
 */

 let urlDB;

 if (process.env.NODE_ENV === 'dev'){
     urlDB = 'mongodb://localhost:27017/cafe';
 }else{
     urlDB = 'mongodb+srv://testdev:2tOEfhr8FUxJVuA3@cluster0-uldle.mongodb.net/cafe';
 }


 /**
  * Vencimiento del token 60 *60
  */
process.env.CADUCIDAD_TOKEN = Math.floor(Date.now() / 1000) + (60 * 60);


/**
 * SEED
 */
process.env.SEED = process.env.SEED || 'SEED-DEV';
process.env.URLDB = urlDB;












