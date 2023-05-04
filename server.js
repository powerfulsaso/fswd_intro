const http = require('http');
const express = require('express');
const { MongoClient } = require('mongodb');
const hostname = 'localhost';
const portNumber = 8080;

const database = 'fswdintro';
const collection = 'users';

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// URL de conexión a la base de datos
const uri = 'mongodb://fswd_intro_db:27017/';

// Endpoint para obtener todos los usuarios
app.get('/usuarios/', (req, res) => {
     
    //crear un nuevo cliente de MongoDB
    const client = new MongoClient(uri);

    // Conectar al cliente de MongoDB
    client.connect()
        .then(() => {
            // Seleccionar la base de datos y la coleccion
            const col = client.db(database).collection(collection);

           
            // Realizar la consulta de los usuarios
            col.find({}).toArray()
                .then(usuarios => {
                    // Enviar los usuarios como respuesta
                    res.send(usuarios);

                    // Cerrar la conexión al finalizar
                    client.close();
                })
                .catch(err => {
                    console.error(err);
                    client.close();
                    return res.status(500).send('Error de servidor');
                });
           
        })
        .catch(err => {
            console.error(err);
            return res.status(500).send('Error conectando a la base de datos');
        });
});

// Endpoint para obtener los usuarios filtrados
app.get('/usuarios/filtrados/', (req, res) => {
   
    const firstName = req.query.firstName;
    const lastName = req.query.lastName;
    const gender = req.query.gender;

    const query = {}; // Inicializamos la consulta como un objeto vacío

    if (firstName || lastName || gender) { // Verificamos si al menos un parámetro está presente
      query.$and = []; // Agregamos la operación $or como un arreglo vacío dentro de la consulta
    
      if (firstName) { // Si el parámetro de nombre está presente
        query.$and.push({ first_name: firstName }); // Agregamos una expresión de consulta que coincida con el nombre
      }
    
      if (lastName) { // Si el parámetro de apellido está presente
        query.$and.push({ last_name: lastName }); // Agregamos una expresión de consulta que coincida con el apellido
      }
    
      if (gender) { // Si el parámetro de género está presente
        query.$and.push({ gender: gender }); // Agregamos una expresión de consulta que coincida con el género
      }
    }


    //crear un nuevo cliente de MongoDB
    const client = new MongoClient(uri);

    // Conectar al cliente de MongoDB
    client.connect()
        .then(() => {
            // Seleccionar la base de datos y la coleccion
            const col = client.db(database).collection(collection);

           
            // Realizar la consulta de los usuarios
            col.find(query).toArray()
                .then(usuarios => {
                    // Enviar los usuarios como respuesta
                    res.send(usuarios);

                    // Cerrar la conexión al finalizar
                    client.close();
                })
                .catch(err => {
                    console.error(err);
                    client.close();
                    return res.status(500).send('Error de servidor');
                });
           
        })
        .catch(err => {
            console.error(err);
            return res.status(500).send('Error conectando a la base de datos');
        });
});

// Iniciar el servidor en el puerto
app.listen(portNumber, () => {
    console.log(`Servidor iniciado en el puerto ${portNumber}`);
});
