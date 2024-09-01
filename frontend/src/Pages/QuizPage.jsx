import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../App.module.css';
import image2 from '../assets/image2.png';
import axios from 'axios';

function QuizPage() {
  const { quizid } = useParams();
  const [step, setStep] = useState(1);
  const [quiz, setQuiz] = useState({});
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const hasUpdatedImpression = useRef(false);
  const hasUpdatedAttempt = useRef(new Set());
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(0); 

  const fetchQuizAnalytics = async () => {
    try {
      const response = await axios.get(`https://quizbuilder-env.eba-qrrtm5dv.ap-south-1.elasticbeanstalk.com/api/quiz/takequiz/${quizid}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const quizData = response.data.quiz || { questions: [] };
      setQuiz(quizData);
      setQuestions(quizData.questions);

      if (!hasUpdatedImpression.current) {
        updateQuizImpression();
        hasUpdatedImpression.current = true;
      }

      if (quizData.type === 'Q&A' && quizData.questions.length > 0) {
        const firstQuestionId = quizData.questions[0]._id;
        if (!hasUpdatedAttempt.current.has(firstQuestionId)) {
          updateQuestionAttempt(firstQuestionId);
          hasUpdatedAttempt.current.add(firstQuestionId);
        }
      }
    } catch (error) {
      console.error('Error fetching quiz analytics:', error);
      setQuiz({ questions: [] });
      setQuestions([]);
    }
  };

  const updateQuizImpression = async () => {
    try {
      await axios.post(`https://quizbuilder-env.eba-qrrtm5dv.ap-south-1.elasticbeanstalk.com/api/quiz/impression/${quizid}`);
    } catch (error) {
      console.error('Error updating quiz impression:', error);
    }
  };

  const updateQuestionAttempt = async (questionId) => {
    try {
      if (questionId && !hasUpdatedAttempt.current.has(questionId)) {
        await axios.post(`https://quizbuilder-env.eba-qrrtm5dv.ap-south-1.elasticbeanstalk.com/api/quiz/${quizid}/question/impression/${questionId}`);
        hasUpdatedAttempt.current.add(questionId);
      }
    } catch (error) {
      console.error('Error updating question impression:', error);
    }
  };

  useEffect(() => {
    fetchQuizAnalytics();
  }, []);

  useEffect(() => {
    const currentQuestionId = questions[currentQuestionIndex]?._id;
    if (quiz.type === 'Q&A' && currentQuestionId && !hasUpdatedAttempt.current.has(currentQuestionId)) {
      updateQuestionAttempt(currentQuestionId);
      hasUpdatedAttempt.current.add(currentQuestionId);
    }
  
    const currentTimer = questions[currentQuestionIndex]?.timer || 0;
    setTimeLeft(currentTimer);
  
    
    if (currentTimer > 0) {
      const timerInterval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerInterval);
            handleNext(); 
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
  
      return () => clearInterval(timerInterval); 
    }
  }, [currentQuestionIndex,questions]);
  

  const updateCorrectAnswerCount = async (questionId) => {
    try {
      if (questionId) {
        await axios.post(`https://quizbuilder-env.eba-qrrtm5dv.ap-south-1.elasticbeanstalk.com/api/quiz/${quizid}/question/impression/correctanswer/${questionId}`);
      }
    } catch (error) {
      console.error('Error updating correct answer count:', error);
    }
  };

  const updateOptionImpression = async (questionid, optionId) => {
    try {
      if (questionid) {
        await axios.post(`https://quizbuilder-env.eba-qrrtm5dv.ap-south-1.elasticbeanstalk.com/api/quiz/optionincreament/${quizid}/${questionid}/${optionId}`);
      }
    } catch (error) {
      console.error('Error updating correct answer count:', error);
    }
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (quiz.type === 'Q&A') {
      if (selectedOption === currentQuestion.correctOption) {
        setScore(prev => prev + 1);
        updateCorrectAnswerCount(currentQuestion._id);
      }
    } else {
      if (selectedOption !== -1) {
        const optionid = currentQuestion.options[selectedOption]._id;
        updateOptionImpression(currentQuestion._id, optionid);
      }
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(-1);
    } else {
      setStep(2);
    }
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={styles.quizform}>
      {step === 1 && (
        <div className={styles.quizbox}>
          <div className={styles.quizboxheader}>
            <div>{`0${currentQuestionIndex + 1}/ 0${questions.length}`}</div>
            <div>{currentQuestion.timer > 0 ? formatTime(timeLeft) : ''}</div>
          </div>

          <div className={styles.questiontext}>
            <span>{truncateText(currentQuestion.question, 120)}</span>
          </div>

          <div className={styles.optionsarea}>
            {currentQuestion.options.map((option, idx) => (
              <div
                key={idx}
                className={`${styles.option} ${selectedOption === idx ? styles.selectedoption : ''}`}
                onClick={() => setSelectedOption(idx)}
              >
                {currentQuestion.optionType === 'text' && (
                  <div className={styles.textoption}>
                    {truncateText(option.text, 30)}
                  </div>
                )}
                {currentQuestion.optionType === 'Image URL' && (
                  <img className={styles.imageoption} src={option.imageUrl} alt={`Option ${idx + 1}`} />
                )}
                {currentQuestion.optionType === 'Text&image' && (
                  <div className={`${styles.textimageoption} ${quiz.type==='Poll'?styles.pollmobile:''}`}>
                    <div>{truncateText(option.text, 30)}</div>
                    <img src={option.imageUrl} alt={`Option ${idx + 1} image`} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div onClick={handleNext} className={styles.nextsubmitwrapper}>
            <button className={styles.nextsubmit}>
              {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className={`${styles.quizbox} ${styles.quizboxstep2}`}>
          {quiz.type === 'Q&A' ? (
            <div className={styles.quizboxstep2}>
              <div>Congrats Quiz is completed</div>
              <img src={image2} alt="Completion" />
              <div>
                Your score is <span style={{ color: '#60B84B' }}>0{score}/0{questions.length}</span>
              </div>
            </div>
          ) : (
            <div className={styles.quizboxstep2}>Thank you for participating in the Poll</div>
          )}
        </div>
      )}
    </div>
  );
}

export default QuizPage;
