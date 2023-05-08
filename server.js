const http = require('http');
const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const hostname = 'localhost';
const dbHostName =
  // 'localhost'; //DEV
  'fswd_intro_db';
const dbPortNumber = 27017;
const portNumber =
  // 8081; //DEV
  8080;

const database = 'fswdintro';
const collection = 'users';

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Configurar el middleware de body-parser para manejar solicitudes POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// URL de conexión a la base de datos
const uri = `mongodb://${dbHostName}:${dbPortNumber}/`;

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


// Endpoint PUT para actualizar o crear un registro en MongoDB
app.put('/usuarios/:email', async (req, res) => {
  const email = req.params.email;
  const data = req.body;

  //crear un nuevo cliente de MongoDB
  const client = new MongoClient(uri);

  // Conectar al cliente de MongoDB
  client.connect()
    .then(async () => {
      // Seleccionar la base de datos y la coleccion
      const col = client.db(database).collection(collection);

      // Buscar el registro en la base de datos utilizando el correo electrónico como criterio de búsqueda
      const usuarioDb = await col.findOne({ email });

      if (usuarioDb) {
        // Si el registro existe, actualizar el documento con los datos enviados por el cliente
        await col.updateOne({ email }, { $set: data });
        res.status(200).send(`El registro con correo electrónico ${email} se ha actualizado correctamente.`);
      } else {
        // Si el registro no existe, crear un nuevo documento utilizando los datos enviados por el cliente
        await col.insertOne(data);
        res.status(201).send(`Se ha creado un nuevo registro con correo electrónico ${email}.`);
      }
      client.close;
    }
    ).catch(err => {
      console.error(err);
      client.close;
      return res.status(500).send('Error conectando a la base de datos');

    });

});

// Endpoint DELETE para borrar un(los) registro en MongoDB
app.delete('/usuarios/:email', async (req, res) => {
  const email = req.params.email;

  //crear un nuevo cliente de MongoDB
  const client = new MongoClient(uri);

  // Conectar al cliente de MongoDB
  client.connect()
    .then(async () => {
      // Seleccionar la base de datos y la coleccion
      const col = client.db(database).collection(collection);


      // Borrar el(los) registros
      col.deleteMany({ email: email }).then((result) => {
        if (result.deletedCount === 0) {
          res.status(204).send(`El registro con correo electrónico ${email} no se ha encontrado.`);
        } else {
          res.status(200).send(`Se han borrado (${result.deletedCount}) registro(s) con correo electrónico ${email}.`);
        }
        client.close;
      }).catch((err) => {
        console.error(err);
        client.close;
        return res.status(500).send('Error conectando a la base de datos');
      });
    }
    ).catch(err => {
      console.error(err);
      client.close;
      return res.status(500).send('Error conectando a la base de datos');

    });
});

// Iniciar el servidor en el puerto
app.listen(portNumber, () => {
  console.log(`Servidor iniciado en el puerto ${portNumber}`);
});
