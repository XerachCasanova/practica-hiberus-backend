const express = require('express');
const usuarioRoute = express.Router();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

const { checkSchema, validationResult } = require('express-validator');

const checkUsuario = require('../validators/checkUsuario');


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

    console.log('VALOR PASS HASHEDDDDDDDDDD', passHashed)

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