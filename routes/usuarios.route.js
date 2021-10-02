const express = require('express');
const usuarioRoute = express.Router();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const configs = require('../config/config');
const { checkSchema, validationResult } = require('express-validator');
const checkUsuario = require('../validators/checkUsuario');


usuarioRoute.route('/verifyToken').get((req, res) => {
  let tokenRequest = req.headers['authorization']; //Bearer XXXXXXXX
  
  if(tokenRequest && tokenRequest.indexOf("Bearer")===0) {
      tokenRequest = tokenRequest.replace(/^Bearer\s+/, "");
      
      jwt.verify(tokenRequest, configs.claveSecreta, (err, payload) => {
          if(err) {
            res.status(401).json({ msg: "Token inválido", error: err });
          } else {
              res.json({msg: "Token válido", datosSecretos: payload});
          }
      })
  } else {
    res.status(401).json({ msg: "Token inválido" });
  }

})

usuarioRoute.route('/me').post((req, res, next) => {

  Usuario.findOne({username: req.body.username}, {clave: 0, __v:0}, (error, data) => {
    if (error) {

      return next(error);

    } else {

      res.json(data);

    }

  })

});


usuarioRoute.route('/').get((req, res, next) => {

  Usuario.find((error, data) => {
    if (error) {

      return next(error);

    } else {

      res.json(data);

    }
  }).select('-__v');
});



usuarioRoute.route('/:id').get((req, res, next) => {

  Usuario.findById(req.params.id, (error, data) => {

    if (error) {

      return next(error);

    } else {

      res.json(data);

    }

  }).select('-__v');

});


usuarioRoute.route('/').post(checkSchema(checkUsuario), async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let salt = await bcrypt.genSalt(12);
  let passHashed = bcrypt.hashSync(req.body.clave, salt);

  usuarioWithHash = { ...req.body, clave: passHashed };


  Usuario.create(usuarioWithHash, (error, data) => {

    if (error) {

      return next(error);

    } else {

      res.json(data);

    }
  });

});

usuarioRoute.route("/:id").put(checkSchema(checkUsuario), async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let passHashed;

  if (req.body.clave == '') {

    let usuarioPass = await Usuario.findById(req.params.id);
    passHashed = usuarioPass.clave;


  } else {

    let salt = await bcrypt.genSalt(12);
    passHashed = bcrypt.hashSync(req.body.clave, salt);

  }

  usuarioWithHash = { ...req.body, clave: passHashed };

  Usuario.findByIdAndUpdate(req.params.id, { $set: usuarioWithHash }, { new: true }, (error, data) => {
    if (error) {

      return next(error);

    } else {

      res.json(data);

    }
  });
});

usuarioRoute.route("/:id").delete((req, res, next) => {


  Usuario.findByIdAndDelete(req.params.id, (error, data) => {
    if (error) {

      return next(error);

    } else {

      res.json(data);

    }
  });
});




module.exports = usuarioRoute;