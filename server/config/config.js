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


process.env.URLDB = urlDB;












