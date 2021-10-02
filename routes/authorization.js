const jwt = require('jsonwebtoken');
const configs = require('../config/config');

function filtroAutorizacion() {

    
    return (req, res, next) => {

        let needsAuth = true;
        let url = req.url;
        let method = req. method;

        switch(url){
            case '/productos/':
                
                if(method == 'GET') needsAuth=false;
            break;

            case '/categorias/':
                if(method == 'GET') needsAuth=false;
            break;

            case '/usuarios/verifyToken/':
                if(method == 'GET') needsAuth=false;
            break;

        }

      
        if (needsAuth){

            let tokenRequest = req.headers['authorization'];


            if (tokenRequest && tokenRequest.indexOf("Bearer") === 0) {
                tokenRequest = tokenRequest.replace(/^Bearer\s+/, "");


                jwt.verify(tokenRequest, configs.claveSecreta, (err, payload) => {
                    if (err) {
                        res.status(401).json({ msg: "Token inválido", error: err });
                    } else {

                        res.seguridad = payload;
                        next();
                    }
                })
            } else {
                res.status(401).json({ msg: "Token inválido" });
            }
                
        } else  next();
        
       
    }


    
};

module.exports = filtroAutorizacion;