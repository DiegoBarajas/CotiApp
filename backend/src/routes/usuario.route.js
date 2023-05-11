const { Router } = require('express');
const router = Router();

const { crear, obtenerTodo, obtenerUno, actualizar, eliminar, reiniciarPassword } = require('../controller/usuario.controller');

router.route('/')
    .get(obtenerTodo)
    .post(crear)

router.route('/reiniciar/:id')
    .put(reiniciarPassword)

router.route('/:id')
    .get(obtenerUno)
    .put(actualizar)
    .delete(eliminar)

module.exports = router;