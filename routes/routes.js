const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const customerController = require('../controllers/customerController');


router.get('/fetch-data', dataController.fetchAndStoreData);
router.get('/update-customers', customerController.updateCustomerData);

module.exports = router;