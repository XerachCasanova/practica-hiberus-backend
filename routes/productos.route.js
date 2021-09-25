const express = require('express');
const productosRoute = express.Router();

let Producto = require('../models/producto');
let Categoria = require('../models/categoria');

const { checkSchema, validationResult } = require('express-validator');

const checkProducto = require('../validators/checkProducto');

productosRoute.route('/').get((req, res, next) => {

  Producto.find().select('-__v').populate('categoriaId', 'nombre').exec((error, data) => {

    if (error) {

      return next(error);

    } else {

      res.json(data);

    }

  });

});

productosRoute.route('/:id').get((req, res, next) => {

  Producto.find().select('-__v').populate('categoriaId').exec(req.params.id, (error, data) => {

    if (error) {

      return next(error);

    } else {

      res.json(data);

    }
  });
});

productosRoute.route('/').post(checkSchema(checkProducto), (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Producto.create(req.body, (error, data) => {

    if (error) {

      return next(error);

    } else {

      res.json(data);

    }

  });

});

productosRoute.route('/:id').put(checkSchema(checkProducto), (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }


  Producto.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (error, data) => {

    if (error) {

      return next(error);

    } else {

      res.json(data);

    }

  });
});

productosRoute.route('/:id').delete((req, res, next) => {

  Producto.findByIdAndRemove(req.params.id, (error, data) => {

    if (error) {

      return next(error);

    } else {

      res.json(data);

    }

  });
});


module.exports = productosRoute;