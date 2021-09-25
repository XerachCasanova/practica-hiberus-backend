const Pedido = require('../models/pedido');

let checkPedido = {

  numeroPedido: {
    customSanitizer: {
      options: async (value, { req }) => {

        if (req.body._id) return value;


        let ultimoPedido = await Pedido.findOne({}).sort({ numeroPedido: -1 }).limit(1);

        if (ultimoPedido != null && Object.keys(ultimoPedido).length > 0) {

          let nPedido = (Number(ultimoPedido.numeroPedido.slice(2, 6)) + 1).toString();
          let nCeros = 6 - 'PO'.length - nPedido.length

          let ceros = '';
          for (i = 0; i < nCeros; i++) {
            ceros = ceros + '0';
          }
          return 'PO' + ceros + nPedido;

        } else {

          return 'PO0001';

        }


      },
    }

  },
  fecha: {
    isEmpty: {
      errorMessage: 'La fecha es obligatoria',
      negated: true,
    },
    custom: {
      options: (value) => {

        valorFecha = new Date(value);
        fechaHoy = Date.now();
        if (+valorFecha > +fechaHoy) {

          return Promise.reject("Fecha incorrecta, debes insertar una fecha menor a la actual.");
        }

        return Promise.resolve();
      }
    },
  },
  cliente: {
    custom: {
      options: (value) => {


        if (!value || Object.entries(value).length == 0) {
          return Promise.reject("Se debe asignar un cliente al pedido");
        }

        return Promise.resolve();
      }
    }
  },
  'cliente.nombre': {
    isEmpty: {
      errorMessage: 'El nombre del cliente es obligatorio.',
      negated: true,
    },
  },
  'cliente.apellido': {
    isEmpty: {
      errorMessage: 'El apellido del cliente es obligatorio.',
      negated: true,
    },
  },
  'cliente.email': {
    isEmpty: {
      errorMessage: 'El E-mail del cliente es obligatorio.',
      negated: true,
    },
    isEmail: {
      errorMessage: 'Formato de E-Mail incorrecto.',
    }
  },
  'cliente.dni': {
    isEmpty: {
      errorMessage: 'El DNI del cliente es obligatorio.',
      negated: true,
    },
    matches: {
      errorMessage: 'Formato de DNI incorrecto',
      options: [/^[0-9]{8}[a-z]$/i]
    }
  },
  'cliente.idUsuario': {
    isEmpty: {
      errorMessage: 'La ID del usuario es obligatoria.',
      negated: true,
    },
    isMongoId: {
      errorMessage: 'El usuario no contiene una ID válida',
    }
  },
  direccionEntrega: {
    custom: {
      options: (value) => {
        if (!value || Object.entries(value).length == 0) {
          return Promise.reject("Se debe asignar una dirección de entrega al pedido");
        }

        return Promise.resolve();
      }
    }
  },
  'direccionEntrega.calle': {
    isEmpty: {
      errorMessage: 'El campo calle es requerido.',
      negated: true,
    },
  },
  'direccionEntrega.localidad': {
    isEmpty: {
      errorMessage: 'El campo localidad es requerido.',
      negated: true,
    },
  },
  'direccionEntrega.provincia': {
    isEmpty: {
      errorMessage: 'El campo provincia es requerido.',
      negated: true,
    },
  },
  'direccionEntrega.cp': {
    isEmpty: {
      errorMessage: 'El campo código postal es requerido.',
      negated: true,
    },
  },
  pedidoDetalle: {
    custom: {
      options: (value) => {
        if (!value || value.length == 0) {
          return Promise.reject("El pedido no puede estar vacío y debe tener productos asignados.");
        }

        return Promise.resolve();
      }
    },
    customSanitizer: {
      options: (value) => {


        let pedidoDetalle = value.map(producto => {
          let precioTotal = producto.precioUnitario * producto.cantidad;
          return {
            ...producto,
            precioTotal: producto.precioUnitario * producto.cantidad - ((precioTotal * (producto.descuento | 0) / 100))
          }
        });


        return [...pedidoDetalle]
      }
    }

  },
  'pedidoDetalle.*.cantidad': {
    isEmpty: {
      errorMessage: 'El campo cantidad de cada producto es obligatorio.',
      negated: true,
    },
    isNumeric: {
      errorMessage: 'El campo cantidad debe ser un número.',
    },
    custom: {
      options: (value) => {
        if (value % 1 != 0) {
          return Promise.reject("La campo cantidad debe ser un número entero.");
        }
        if (value == 0) {
          return Promise.reject("La cantidad de un producto no puede ser 0.");
        }

        return Promise.resolve();
      }
    }
  },
  'pedidoDetalle.*.descuento': {
    customSanitizer: {
      options: (value) => {
        if (!value) return 0
        else return value
      },
    },
    custom: {
      options: (value) => {
        if (value && typeof value != 'number') {
          return Promise.reject("El descuento debe ser numérico.");
        }
        if (value < 0 || value > 100) {
          return Promise.reject("El descuento debe ser una cantidad entre 0 y 100.");
        }

        return Promise.resolve();
      }
    }
  },
  'pedidoDetalle.*.tituloProducto': {
    isEmpty: {
      errorMessage: 'El nombre del producto es obligatorio.',
      negated: true
    }
  },
  'pedidoDetalle.*.precioUnitario': {
    isEmpty: {
      errorMessage: 'El precio unitario de todos los productos es obligatorio.',
      negated: true
    },
    custom: {
      options: (value) => {
        if (value && typeof value != 'number') {
          return Promise.reject("El precio unitario de cada producto debe ser numérico.");
        }
        if (value <= 0) {
          return Promise.reject("El precio unitario de cada producto debe ser mayor de 0.");
        }

        return Promise.resolve();
      }
    }
  },
  precioTotal: {
    isEmpty: {
      errorMessage: 'El precio es obligatorio',
      negated: true,
    },
    isNumeric: {
      errorMessage: 'El precio es debe ser un número válido.',
    },
    custom: {
      options: (value) => {


        if (value <= 0) {
          return Promise.reject("El precio debe ser un valor en positivo.");
        }

        return Promise.resolve();
      }
    },
    customSanitizer: {
      options: (value, { req }) => {


        let suma = 0;

        req.body.pedidoDetalle.forEach(data => {

          suma += data.precioTotal;

        })
        return suma;

      },
    }
  }
}

module.exports = checkPedido;