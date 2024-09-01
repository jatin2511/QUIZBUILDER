const express = require('express');
const { getDashboardData } = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this exists
const router = express.Router();


router.get('/',authMiddleware, getDashboardData);

  
module.exports = router;
