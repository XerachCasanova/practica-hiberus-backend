const express = require('express');
const mongoose = require('mongoose');

const loginRoute = express.Router();

const Usuario = require('../models/usuario');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const configs = require('../config/config');

loginRoute.route("/").post((req, res, next) => {
 
  let user = req.body;
  
  Usuario.findOne({username: user.username}, async (err, resp) => {
    
    if(err) {

      return next(err);

    }


    if (user.username != resp.username){
      res.json({msg: "Usuario o contraseña incorrectos."});
    }

    bcrypt.compare(req.body.clave, resp.clave, (err, clave) => {
      
      if (clave) {
        let payload = {
          username: {
            username: user.username,
            tipoUsuario: "Admin"
          }
        }
  
        let token = jwt.sign(payload, configs.claveSecreta, {expiresIn: 1440});
  
        res.json({msg: "Autenticación correcta", token: token })

      } else{

        res.json({msg: "Usuario o contraseña incorrectos."});
    
      }
      
    })
    
  });

});

module.exports = loginRoute;