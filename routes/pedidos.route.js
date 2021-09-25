const express = require('express');

const pedidosRoute = express.Router();

const Pedido = require('../models/pedido');

const mongoose = require('mongoose')

const { checkSchema, validationResult } = require('express-validator');

const checkPedido = require('../validators/checkPedido');

pedidosRoute.route('/').get((req, res, next) => {


  Pedido.find((error, data) => {

    if (error) {

      return next(error);

    } else {

      res.json(data);

    }

  }).select('-__v');

});

pedidosRoute.route('/:id').get((req, res, next) => {

  Pedido.find((error, data) => {

    if (error) {

      return next(error);

    } else {

      res.json(data);

    }

  }).select('-__v');

});

pedidosRoute.route('/').post(checkSchema(checkPedido), (req, res, next) => {


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let pedido = req.body;



  pedido.cliente.idUsuario = mongoose.Types.ObjectId(pedido.cliente.idUsuario);

  Pedido.create(pedido, (error, data) => {

    if (error) {

      return next(error);

    } else {

      res.json(data);

    }

  });

});

pedidosRoute.route('/:id').put(checkSchema(checkPedido), (req, res, next) => {


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Pedido.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (error, data) => {

    if (error) {

      return next(error);

    } else {

      res.json(data);

    }

  });
});

pedidosRoute.route('/:id').delete((req, res, next) => {

  Pedido.findByIdAndRemove(req.params.id, (error, data) => {

    if (error) {

      return next(error);

    } else {

      res.json(data);

    }

  });
});

module.exports = pedidosRoute;