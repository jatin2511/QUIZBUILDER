const express = require('express');
const { getAnalytics,getQuiz} = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/',authMiddleware, getAnalytics);
router.get('/quiz/:id',authMiddleware,getQuiz)
  
module.exports = router;
