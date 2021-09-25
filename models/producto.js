

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Categoria = require('./categoria');

let Producto = new Schema(
  {
    titulo: { type: String },
    referencia: {
      type: String,
      unique: true
    },
    descripcion: { type: String },
    precio: { type: Number },
    categoriaId: { type: Schema.Types.ObjectId, ref: "Categoria" }
  },
  {
    collection: "productos"
  }
)

module.exports = mongoose.model("Producto", Producto);