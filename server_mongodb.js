const express = require('express');
const cors = require('cors');


dbName = 'tienda2';
dbConnection = 'mongodb://localhost:27017/' + dbName;
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');


let db;

MongoClient.connect(dbConnection, (error, client) => {

  if(error) throw error;

  console.log("BBDD conectada correctamente.");

  db = client.db(dbName);

});


const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, resp) => {

  console.log("Hola Mundo");

  resp.send("Hola");
  
});

//CRUD PARA CATEGORIAS

app.post('/', (req, resp) => {
  console.log('entro por post!!!!');

  console.log(req.body);

  //resp.setHeader("Content-Type", "application/json");
  //resp.send(JSON.stringify({status: 'ok'}));
  resp.json({status: 'ok'})

})


app.get('/categorias', (req, resp) => {
  
  db.collection("categorias")
    .find()
    .toArray()
    .then(result => {
      console.log(result)
      resp.json(result)
    })
    .catch(error => console.log(error));



});

app.post('/categorias', (req, resp) => {

  var categoria = req.body;



  //Hacer todas las comprobaciones necesarias antes de hacer el insert.
  if(typeof categoria != 'undefined'){
    db.collection("categorias")
      .insertOne(categoria)
      .then(data => resp.json(data))
      .catch(error => console.log(error));
  }
  

});

app.delete('/categorias/:id', (req, resp) => {

  let id = req.params.id

  if(typeof id != 'undefined'){
    db.collection("categorias")
      .deleteOne({_id: ObjectId(id)})
      .then(data => resp.json(data))
      .catch(error => console.log(error));
  }
  

});

app.put('/categorias/:id', (req, resp) => {

  var categoria = req.body;
  let id = req.params.id;

  delete categoria._id

  if (typeof id != 'undefined' && typeof categoria != 'undefined'){
    db.collection("categorias")
      .updateOne({_id: ObjectId(id)}, {$set: categoria} )
      .then(data => resp.json(data))
      .catch(error => console.log(error));
  }
  
});


//CRUD PARA PRODUCTOS


app.get('/productos', (req, resp) => {
  
  db.collection("productos")
    .find()
    .toArray()
    .then(result => {
      console.log(result)
      resp.json(result)
    })
    .catch(error => console.log(error));



});

app.post('/productos', (req, resp) => {

  var producto = req.body;

  if(typeof producto != 'undefined'){
    db.collection("productos")
      .insertOne(producto)
      .then(data => resp.json(data))
      .catch(error => console.log(error));
  }
  

});

app.delete('/productos/:id', (req, resp) => {

  let id = req.params.id

  if(typeof id != 'undefined'){
    db.collection("producto")
      .deleteOne({_id: ObjectId(id)})
      .then(data => resp.json(data))
      .catch(error => console.log(error));
  }
  

});

app.put('/productos/:id', (req, resp) => {

  var producto = req.body;
  let id = req.params.id;

  delete producto._id

  if (typeof id != 'undefined' && typeof producto != 'undefined'){
    db.collection("producto")
      .updateOne({_id: ObjectId(id)}, {$set: producto} )
      .then(data => resp.json(data))
      .catch(error => console.log(error));
  }
  
});


const port = 4000;
const server = app.listen(port, () => {
  console.log('Servidor escuchando en el puerto ' + port);
});
