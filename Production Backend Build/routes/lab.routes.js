const express = require("express");
const labController = require('../controllers/lab.controller');

const router = express.Router();
router.get("/", labController.getLabDashboard);
module.exports = router; 
