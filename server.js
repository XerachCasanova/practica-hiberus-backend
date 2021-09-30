const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const dbconfig = require('./database/db');
//conexión a la bd:

mongoose.Promise = global.Promise;

mongoose.connect(dbconfig.db, {useNewUrlParser: true}).then(() => {
  console.log("BBDD conexión correcta")
}, error => {
  console.log(error);
});

const loginRoute = require('./routes/login.route');
const categoriasRoute = require('./routes/categorias.route');
const usuariosRoute = require('./routes/usuarios.route');
const productosRoute = require('./routes/productos.route');
const pedidosRoute = require('./routes/pedidos.route');

const authorization = require('./routes/authorization');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    console.log("Holaaa estamos en /");
    res.send("Hello world!!!!!!!!!!!");
});

app.use("/login", loginRoute);

app.use(authorization());

app.use("/pedidos", pedidosRoute);

app.use("/productos", productosRoute);



app.use("/usuarios", usuariosRoute);

app.use("/categorias", categoriasRoute);



const PORT = process.env.PORT || 4000;
app.listen(PORT, err => {
    if(err) throw err;
    console.log("%c Server running", "color: green");
});