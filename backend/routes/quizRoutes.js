const express = require('express');
const { createQuiz, updateQuiz, deleteQuiz, incrementImpression,getQuiz,incrementquestionattempt,incrementcorrectattempt,incrementoption } = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware'); 
const router = express.Router();


router.post('/create', authMiddleware, createQuiz); 
router.put('/update/:id', authMiddleware, updateQuiz);
router.delete('/delete/:id', authMiddleware, deleteQuiz); 
router.post('/impression/:id', incrementImpression); 
router.get('/takequiz/:id',getQuiz)
router.post('/:id/question/impression/:questionId', incrementquestionattempt); 
router.post('/:id/question/impression/correctanswer/:questionId', incrementcorrectattempt);
router.post('/optionincreament/:id/:questionId/:optionId', incrementoption);
  
module.exports = router;
