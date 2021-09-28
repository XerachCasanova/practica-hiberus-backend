const jwt = require('jsonwebtoken');
const configs = require('../config/config');

function filtroAutorizacion(){
  return (req, res, next) => { 
      console.log("Estamos en la función filtroAutorizacion()");
      let tokenRequest = req.headers['authorization']; //Bearer XXXXXXXX
      
      if(tokenRequest && tokenRequest.indexOf("Bearer")===0) {
          tokenRequest = tokenRequest.replace(/^Bearer\s+/, "");
          
          jwt.verify(tokenRequest, configs.claveSecreta, (err, payload) => {
              if(err) {
                  res.json({msg: "Token inválido", error: err});
              } else {
                  //res.json({msg: "Token válido", datosSecretos: payload});
                  res.seguridad = payload;
                  next();
              }
          })
      } else {
          res.json({msg: "Falta el token"});
      }
  }
};

module.exports = filtroAutorizacion;