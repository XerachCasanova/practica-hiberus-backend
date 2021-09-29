const jwt = require('jsonwebtoken');
const configs = require('../config/config');

function filtroAutorizacion(){
  return (req, res, next) => { 
      let tokenRequest = req.headers['authorization']; //Bearer XXXXXXXX

      
      if(tokenRequest && tokenRequest.indexOf("Bearer")===0) {
          tokenRequest = tokenRequest.replace(/^Bearer\s+/, "");
          
          
          jwt.verify(tokenRequest, configs.claveSecreta, (err, payload) => {
              if(err) {
                  res.json({msg: "Token inválido", error: err});
              } else {  
                  
                  res.seguridad = payload;
                  next();
              }
          })
      } else {
          res.json({msg: "token erroneo"});
      }
  }
};

module.exports = filtroAutorizacion;