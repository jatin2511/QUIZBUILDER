const Quiz = require('../models/Quiz'); 
const mongoose=require('mongoose')


exports.createQuiz = async (req, res) => {
  const { title, type, questions } = req.body;

  try {
    
    if (!title || !type || !questions) {
      
      return res.status(400).json({ msg: 'All fields are required' });
    }


    questions.forEach(question => {
      if (!question.optionType) {
        return res.status(400).json({ msg: 'Each question must have an optionType' });
      }
    });

    

    const quiz = new Quiz({ title, type, questions, createdBy: req.user.id });
    await quiz.save();

    res.status(201).json(quiz);
  } catch (err) {
    console.error('Error in createQuiz:', err.message);
    res.status(500).send('Server error');
  }
};






exports.getQuiz = async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    res.json({quiz});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.updateQuiz = async (req, res) => {
  const { id } = req.params;
  const { questions } = req.body;

  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    
    quiz.questions = questions || quiz.questions;

    await quiz.save();
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};





exports.deleteQuiz = async (req, res) => {
  const { id } = req.params;

  try {
   
    
    
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

  
    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

 
    await Quiz.deleteOne({ _id: id });

    res.json({ msg: 'Quiz removed' });
  } catch (err) {
    console.error('Error deleting quiz:', err.message);
    res.status(500).send('Server error');
  }
};


exports.incrementImpression = async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    quiz.impressions += 1;
    await quiz.save();
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.getDashboardData = async (req, res) => {
  try {
    


    const userId = new mongoose.Types.ObjectId(req.user.id); 

    
    const totalQuizzes = await Quiz.countDocuments({ createdBy: userId });

    const totalQuestions = await Quiz.aggregate([
      { $match: { createdBy: userId } },
      { $unwind: '$questions' },
      { $group: { _id: null, totalQuestions: { $sum: 1 } } }
    ]);

    const totalImpressions = await Quiz.aggregate([
      { $match: { createdBy: userId } },
      { $group: { _id: null, totalImpressions: { $sum: '$impressions' } } }
    ]);


    const trendingQuizzes = await Quiz.find({ createdBy: userId })
      .sort({ impressions: -1 })
      .select('title impressions createdAt');

    res.json({
      totalQuizzes: totalQuizzes,
      totalQuestions: totalQuestions[0]?.totalQuestions || 0,
      totalImpressions: totalImpressions[0]?.totalImpressions || 0,
      trendingQuizzes
    });
  } catch (err) {
    console.error('Error in getDashboardData:', err.message);
    res.status(500).send('Server error');
  }
};
exports.getAnalytics = async (req, res) => {
  try {
    

    const userId = new mongoose.Types.ObjectId(req.user.id); 


   
    const quizzes = await Quiz.find({ createdBy: userId })
      .sort({ impressions: -1 })
      .select('title impressions createdAt');

    res.json({
     quizzes
    });
  } catch (err) {
    console.error('Error in AnalyticsData:', err.message);
    res.status(500).send('Server error');
  }
};

exports.incrementquestionattempt = async (req, res) => {
  const { id, questionId } = req.params;

  try {
 
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

 
    const question = quiz.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

 
    question.stats.totalAttempts += 1;


    await quiz.save();


    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
exports.incrementcorrectattempt=async(req,res)=>{
  const { id, questionId } = req.params;

  try {
   
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }


    const question = quiz.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    question.stats.correctAttempts += 1;

    
    await quiz.save();

      res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}
exports.incrementoption=async(req,res)=>{
  const { id, questionId,optionId } = req.params;

  try {
    
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

  
    const question = quiz.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }
    const option =question.options.id(optionId);
    
    option.totalAttempts+=1;

  
    await quiz.save();

    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}
