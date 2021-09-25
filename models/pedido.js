const mongoose = require('mongoose');
const usuario = require('./usuario');

const Schema = mongoose.Schema


let Direccion = new Schema({
    calle: { type: String },
    localidad: { type: String },
    provincia: { type: String },
    cp: { type: String },
});


let PedidoDetalle = new Schema({
    cantidad: { type: Number },
    descuento: { type: Number },
    refProducto: { type: String },
    tituloProducto: { type: String },
    precioUnitario: { type: Number },
    precioTotal: { type: Number },

});

let Pedido = new Schema({

    numeroPedido: { type: String },
    fecha: { type: Date },
    precioTotal: { type: Number },
    pedidoDetalle: [{ type: PedidoDetalle }],
    cliente:
    {
        nombre: { type: String },
        apellido: { type: String },
        email: { type: String },
        dni: { type: String },
        idUsuario: { type: Schema.Types.ObjectId, ref: "Usuario" }
    },
    direccionEntrega: { type: Direccion },
},
    {
        collection: 'pedidos'
    }
)

module.exports = mongoose.model('Pedido', Pedido)