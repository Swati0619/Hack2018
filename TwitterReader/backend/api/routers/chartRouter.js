const express = require('express');
const router = express.Router();
const chartController = require('../controller/chartController');
router.post('/bpiChart',chartController.getBPIChartData);
router.post('/sentiChart',chartController.getSentiChartData);
router.post('/buySellData',chartController.getDescisonChartData);
module.exports = router;