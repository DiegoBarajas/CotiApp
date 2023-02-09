const { Router } = require('express');
const router = Router();

const { crear, obtenerTodo, obtenerUno, actualizar, eliminar } = require('../controller/item.controller');

router.route('/')
    .get(obtenerTodo)
    .post(crear)

router.route('/:id')
    .get(obtenerUno)
    .put(actualizar)
    .delete(eliminar)

module.exports = router;