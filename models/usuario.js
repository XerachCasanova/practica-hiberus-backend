const mongoose = require('mongoose');

const Schema = mongoose.Schema


//Schema.plugin(unique);

let Direccion = new Schema({
  calle: { type: String },
  localidad: { type: String },
  provincia: { type: String },
  cp: { type: String },
});


let Usuario = new Schema(
  {
    nombre: String,
    apellido: String,
    dni:
    {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{8}[a-z]$/i
    },
    email:
    {
      type: String,
      required: true
    },
    username:
    {
      type: String,
      required: true
    },
    clave:
    {
      type: String,
      required: true
    },
    tipoUsuario:
    {
      type: String,
      enum: ["Administrador", "Cliente"],
      default: "Cliente",
      required: true
    },

    direcciones: [Direccion]
  },
  {
    collection: "usuarios"
  }
)

module.exports = mongoose.model("Usuario", Usuario);