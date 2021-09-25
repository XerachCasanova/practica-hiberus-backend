const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');



const dbconfig = require('./database/db');
//conexión a la bd:

mongoose.Promise = global.Promise;

mongoose.connect(dbconfig.db, {useNewUrlParser: true}).then(() => {
  console.log("BBDD conexión correcta")
}, error => {
  console.log(error);
});

const categoriasRoute = require('./routes/categorias.route');

const usuariosRoute = require('./routes/usuarios.route');

const productosRoute = require('./routes/productos.route');

const pedidosRoute = require('./routes/pedidos.route');



const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    console.log("Holaaa estamos en /");
    res.send("Hello world!!!!!!!!!!!");
});

app.use("/categorias", categoriasRoute);

app.use("/usuarios", usuariosRoute);

app.use("/productos", productosRoute);

app.use("/pedidos", pedidosRoute);


/*const port = 3000;
const server = app.listen(port, () => {
    console.log('Servidor escuchando en el puerto --> '+ port);
})*/

const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
    if(err) throw err;
    console.log("%c Server running", "color: green");
});