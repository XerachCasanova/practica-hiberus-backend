const Producto = require('../models/producto');


let checkProducto = {

  referencia:
  {
    custom: {
      options: (value, { req }) => {

        if (req.body._id) return Promise.resolve();
        if (value)
          return Producto.find({ referencia: value }).then(prod => {
            if (prod.length > 0) {

              return Promise.reject('La referencia ya existe.');
            }
          });
      }
    },
    matches: {
      errorMessage: 'El formato de la referencia es incorrecto.',
      options: [/^P[0-9]{4}$/i]
    }
  },
  titulo:
  {
    isEmpty: {
      errorMessage: 'El nombre del producto es requerido',
      negated: true,
    },
  },
  precio:
  {
    isEmpty: {
      errorMessage: 'El precio es obligatorio',
      negated: true,
    },
    custom: {
      options: (value) => {
        if (value <= 0) {
          return Promise.reject("El precio debe ser un valor en positivo.");
        }

        return Promise.resolve();
      }
    }

  },
  categoriaId: {
    isEmpty: {
      errorMessage: 'La categoría es obligatoria',
      negated: true,
    },
    isMongoId: {
      errorMessage: 'La categoría no contiene una id válida',
    }
  }
}

module.exports = checkProducto;