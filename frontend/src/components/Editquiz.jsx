import React, { useState, useEffect } from 'react';
import styles from '../App.module.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function EditQuiz({jwttoken}) {
  const { quizid } = useParams();
  const [quizType, setQuizType] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        
        const response = await axios.get(`https://quizbuilder-env.eba-qrrtm5dv.ap-south-1.elasticbeanstalk.com/api/analytics/quiz/${quizid}`, {
          headers: {
            'Authorization': `Bearer ${jwttoken}`
          }
        });
        console.log(response.data);
        const { type, questions } = response.data.quiz;
        setQuizType(type);
        setQuestions(questions);
        setSelectedOptionIndex(questions[0]?.correctOption);
      } catch (error) {
        console.error('Error fetching quiz details:', error);
      }
    };

    fetchQuizDetails();
  }, [quizid]);

  const handleQuestionChange = (e) => {
    if (questions[currentQuestionIndex]) {
      const newQuestions = [...questions];
      newQuestions[currentQuestionIndex].question = e.target.value;
      setQuestions(newQuestions);
    }
  };

  const handleOptionChange = (index, field, value) => {
    if (questions[currentQuestionIndex]) {
      const newQuestions = [...questions];
      newQuestions[currentQuestionIndex].options[index][field] = value;
      setQuestions(newQuestions);
    }
  };

  const handleTimerChange = (time) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].timer = time;
    setQuestions(newQuestions);
  };

  const switchQuestion = (index) => {
    if (questions[index]) {
      setCurrentQuestionIndex(index);
      setSelectedOptionIndex(questions[index].correctOption);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const validateInputs = () => {
    for (const question of questions) {
     
      if (!question.question.trim()) {
        toast.error('Question text cannot be empty.');
        return false;
      }

      for (const option of question.options) {
        if (!option.text.trim() && !option.imageUrl.trim()) {
          toast.error('Each option must have either text, image URL, or both.');
          return false;
        }
      }
    }
    return true;
  };

  const handleUpdateQuiz = async () => {
   
  
    if (!jwttoken) {
      console.error('No token found');
      return;
    }
  

    if (!validateInputs()) {
      return;
    }
  
    try {
      await axios.put(
        `https://quizbuilder-env.eba-qrrtm5dv.ap-south-1.elasticbeanstalk.com/api/quiz/update/${quizid}`,
        {
          questions 
        },
        {
          headers: {
            'Authorization': `Bearer ${jwttoken}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      toast.success('Quiz updated successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error updating quiz:', error);
      toast.error('Failed to update quiz.');
    }
  };
  

  return (
    <div className={styles.confirmdelete}>
      <div className={styles.quizstep2box}>
        <div className={styles.step2header}>
          <div className={styles.questionnumbers}>
            {questions.map((_, index) => (
              <div
                key={index}
                className={`${styles.questionnumber} ${index === currentQuestionIndex ? styles.selectedquestion : ''}`}
                onClick={() => switchQuestion(index)}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <div>Max 5 Questions</div>
        </div>

        {questions[currentQuestionIndex] && (
          <>
            <input
              className={styles.inputquestiontext}
              value={questions[currentQuestionIndex].question || ''}
              onChange={handleQuestionChange}
            />

            <div className={styles.optionsandtimer}>
              <div className={styles.optionsList}>
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <div key={index} className={styles.optionline}>
                  
                    {(questions[currentQuestionIndex].optionType === 'text' || questions[currentQuestionIndex].optionType === 'Text&image') && (
                      <input
                        type="text"
                        value={option.text || ''}
                        className={styles.optioninput}
                        onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                        placeholder={`Option ${index + 1} Text`}
                      />
                    )}
                   
                    {(questions[currentQuestionIndex].optionType === 'Image URL' || questions[currentQuestionIndex].optionType === 'Text&image') && (
                      <input
                        type="text"
                        value={option.imageUrl || ''}
                        className={styles.optioninput}
                        onChange={(e) => handleOptionChange(index, 'imageUrl', e.target.value)}
                        placeholder={`Option ${index + 1} Image URL`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {quizType === 'Q&A' && (
                <div className={styles.timer}>
                  <div>Timer</div>
                  <button
                    className={questions[currentQuestionIndex].timer === 0 ? styles.selected : ''}
                    onClick={() => handleTimerChange(0)}
                  >
                    OFF
                  </button>
                  <button
                    className={questions[currentQuestionIndex].timer === 5 ? styles.selected : ''}
                    onClick={() => handleTimerChange(5)}
                  >
                    5 sec
                  </button>
                  <button
                    className={questions[currentQuestionIndex].timer === 10 ? styles.selected : ''}
                    onClick={() => handleTimerChange(10)}
                  >
                    10 sec
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        <div className={styles.createorcancel}>
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleUpdateQuiz}>Update Quiz</button>
        </div>
      </div>
    </div>
  );
}

export default EditQuiz;
