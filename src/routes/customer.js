const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customerController');

router.get('/', customerController.list);
router.get('/historial', customerController.listHistorial);
router.get('/activos', customerController.listActivos);
router.get('/desconectados', customerController.listDesconectados);
router.post('/add', customerController.save);
router.get('/delete/:id', customerController.delete);
router.post('/update/:rfid', customerController.update);

module.exports = router;
