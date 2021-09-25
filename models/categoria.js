const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Categoria = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    }
  },
  {
    collection: "categorias"
  },

)


module.exports = mongoose.model("Categoria", Categoria);