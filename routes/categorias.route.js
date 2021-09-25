const express = require('express');

const categoriaRoute = express.Router();

let Categoria = require('../models/categoria');

const { checkSchema, validationResult } = require('express-validator');

let checkCategoria =
{
  nombre:
  {
    isEmpty: {
      errorMessage: 'El nombre es requerido',
      negated: true,
    }
  }

}

categoriaRoute.route('/').get((req, res) => {

  Categoria.find((error, data) => {
    if (error) {

      return next(error);

    } else {

      res.json(data);

    }
  }).select('-__v');


});

categoriaRoute.route('/:id').get((req, res) => {

  Categoria.findById(req.params.id, (error, data) => {

    if (error) {

      return next(error);

    } else {

      res.json(data);

    }

  }).select('-__v');

});

categoriaRoute.route('/').post(checkSchema(checkCategoria), (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Categoria.create(req.body, (error, data) => {

    if (error) {

      res.status(400).json(err);


    } else {

      res.json(data);

    }
  });

});

categoriaRoute.route("/:id").put(checkSchema(checkCategoria), (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Categoria.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (error, data) => {
    if (error) {

      return next(error);

    } else {

      res.json(data);

    }
  });
});

categoriaRoute.route("/:id").delete((req, res) => {

  console.log(req.params.id)
  Categoria.findByIdAndDelete(req.params.id, (error, data) => {
    if (error) {

      return next(error);

    } else {

      res.json(data);

    }
  });
})

module.exports = categoriaRoute;