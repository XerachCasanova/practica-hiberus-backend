const Usuario = require('../models/usuario');

let checkUsuario =
{
  nombre:
  {
    isEmpty: {
      errorMessage: 'El nombre es requerido',
      negated: true,
    }
  },
  dni:
  {
    isEmpty: {
      errorMessage: 'El dni es requerido',
      negated: true,
    },
    matches: {
      errorMessage: 'Formato de DNI incorrecto',
      options: [/^[0-9]{8}[a-z]$/i]
    }

  },
  email:
  {
    isEmpty: {
      errorMessage: 'El E-mail es requerido',
      negated: true,
    },
    isEmail: {
      errorMessage: 'Formato de E-Mail incorrecto.',
    }

  },
  username:
  {
    custom: {

      options: (value, { req }) => {
        console.log(req.body)
        if (req.body._id) return Promise.resolve();
        if (value)
          return Usuario.find({ username: value }).then(user => {
            if (user.length > 0) {
              return Promise.reject('Nombre de usuario en uso.');
            }
          });
      }
    }
  },
  clave:
  {
    custom: {

      options: (value, { req }) => {

        if (!req.body._id || (req.body._id && req.body.clave.length > 0)) {
          if (!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
            return Promise.reject('La clave debe contener 8 caracteres e incluir al menos un dígito, una mayúscula y una minúscula.');
          }
        }

        return Promise.resolve()
      }
    }
  },
  tipoUsuario:
  {
    custom: {
      options: (value,) => {
        console.log(value);
        if (value != 'Cliente' && value != 'Administrador') {
          return Promise.reject('Tipo de usuario incorrecto.');
        }

        return Promise.resolve()

      }
    }
  }
}

module.exports = checkUsuario;