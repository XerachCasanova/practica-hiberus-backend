const express = require('express');
const mongoose = require('mongoose');

const loginRoute = express.Router();

const { checkSchema, validationResult } = require('express-validator');

const Usuario = require('../models/usuario');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const configs = require('../config/config');

const checkUsuario = require('../validators/checkUsuario');


loginRoute.route("/").post((req, res, next) => {
 
  let user = req.body;

  Usuario.findOne({username: user.username}, async (err, resp) => {
    
    if(err) {

      return next(err);

    }

    if (resp==null){

      res.json({msg: "Usuario o contraseña incorrectos."});

    }
    else {
      bcrypt.compare(req.body.clave, resp.clave, (err, clave) => {


        if (clave) {
          let payload = {
            username: {
              username: user.username,
              tipoUsuario: resp.tipoUsuario
            }
          }
    
          let token = jwt.sign(payload, configs.claveSecreta, {expiresIn: 1440});
    
          res.json({msg: "Autenticación correcta", token: token })
  
        } else{
  
          res.json({msg: "Usuario o contraseña incorrectos."});
      
        }
        
      })
    }
    
  });

});

loginRoute.route('/signup').post(checkSchema(checkUsuario), async (req, res, next) => {

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

module.exports = loginRoute;