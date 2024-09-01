import React, { useState } from 'react';
import styles from '../App.module.css';
import deletesymbol from '../assets/deletesymbol.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {  toast } from 'react-toastify';



function Createquiz() {
  const [selectedQuizType, setSelectedQuizType] = useState(null);
  const [quizName, setQuizName] = useState('');
  const [quizstep, setQuizStep] = useState(1);
  const [selectedOptionindex, setSelectedOptionindex] = useState(-1);
  const [questions, setQuestions] = useState([{
    question: '',
    options: [
      { text: '', imageUrl: '' },
      { text: '', imageUrl: '' }
    ],
    correctOption: 5,
    timer: 0,
    optionType: 'text'
  }]);
  const [selectedOptiontype, setSelectedOptiontype] = useState('text');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shareableLink, setShareableLink] = useState(''); 
  const navigate = useNavigate();
  const isContinueDisabled = !selectedQuizType || quizName.trim() === '';
  

  const handleOptionTypeChange = (e) => {
    const newOptionType = e.target.value;
    setSelectedOptiontype(newOptionType);

    if (questions[currentQuestionIndex]) {
      const newQuestions = [...questions];
      newQuestions[currentQuestionIndex].optionType = newOptionType;

      if (newOptionType === 'text') {
        newQuestions[currentQuestionIndex].options = newQuestions[currentQuestionIndex].options.map(opt => ({
          text: opt.text,
          imageUrl: ''
        }));
      } else if (newOptionType === 'Image URL') {
        newQuestions[currentQuestionIndex].options = newQuestions[currentQuestionIndex].options.map(opt => ({
          text: '',
          imageUrl: opt.imageUrl
        }));
      } else if (newOptionType === 'Text&image') {
        newQuestions[currentQuestionIndex].options = newQuestions[currentQuestionIndex].options.map(opt => ({
          text: opt.text,
          imageUrl: opt.imageUrl
        }));
      }

      setQuestions(newQuestions);
    }
  };

  const handleQuizTypeSelect = (type) => {
    setSelectedQuizType((prev) => (prev === type ? null : type));
  };

  const handleQuizNameChange = (e) => {
    setQuizName(e.target.value);
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleSubmitQuizStep1 = () => {
    setQuizStep(2);
  };

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

  const handleCorrectOptionChange = (index) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].correctOption = index;
    setQuestions(newQuestions);
    setSelectedOptionindex(index);
  };

  const addOption = () => {
    if (questions[currentQuestionIndex].options.length < 4) {
      setQuestions(questions.map((question, i) =>
        i === currentQuestionIndex ? {
          ...question,
          options: [...question.options, { text: '', imageUrl: '' }]
        } : question
      ));
    }
  };

  const removeOption = (index) => {
    if (questions[currentQuestionIndex].options.length > 2) {
      const newQuestions = questions.map((question, i) => {
        if (i === currentQuestionIndex) {
          const newOptions = question.options.filter((_, optIndex) => optIndex !== index);
          return {
            ...question,
            options: newOptions,
            correctOption: question.correctOption === index ? 5 : question.correctOption > index ? question.correctOption - 1 : question.correctOption
          };
        }
        return question;
      });
      setQuestions(newQuestions);
    }
  };

  const addNewQuestion = () => {
    if (questions.length < 5) {
      setQuestions([
        ...questions,
        {
          question: '',
          options: [{ text: '', imageUrl: '' }, { text: '', imageUrl: '' }],
          correctOption: 5,
          timer: 0,
          optionType: 'text'
        }
      ]);
      setCurrentQuestionIndex(questions.length);
      setSelectedOptionindex(-1);
    }
  };

  const switchQuestion = (index) => {
    if (questions[index]) {
      setCurrentQuestionIndex(index);
      setSelectedOptiontype(questions[index].optionType);
      setSelectedOptionindex(questions[index].correctOption);
    }
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      const newIndex = Math.max(0, Math.min(currentQuestionIndex, newQuestions.length - 1));

      setQuestions(newQuestions);
      setCurrentQuestionIndex(newIndex);
      setSelectedOptiontype(newQuestions[newIndex]?.optionType || 'text');
      setSelectedOptionindex(newQuestions[newIndex]?.correctOption || 5);
    }
  };

  const handleTimerChange = (time) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].timer = time;
    setQuestions(newQuestions);
  };

  const handleCreateQuiz = async () => {
    if (!validateQuiz()) return;
    const token = localStorage.getItem('token'); 

    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/quiz/create',
        {
          title: quizName,
          type: selectedQuizType,
          questions
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
          }
        }
      );

      const quizId = response.data._id; 
      setShareableLink(`http://localhost:5000/quiz/${quizId}`); 
      setQuizStep(3);
    } catch (error) {
      console.error('Error creating quiz:', error);
      
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      toast.success('Link copied to clipboard!'); 
    }).catch(err => {
      console.error('Failed to copy link: ', err);
      toast.error('Failed to copy the link!'); 
    });
  };
  
  
  const validateQuiz = () => {
    
    if (quizName.trim() === '') {
      toast.error('Quiz name is required!');
      return false;
    }
  

    if (!selectedQuizType) {
      toast.error('Quiz type is required!');
      return false;
    }
  
    for (const question of questions) {
      if (question.question.trim() === '') {
        toast.error('All questions must have text!');
        return false;
      }
  
      for (const option of question.options) {
        if (question.optionType === 'text' && option.text.trim() === '') {
          toast.error('All options must be filled!');
          return false;
        }
        if (question.optionType === 'Image URL' && option.imageUrl.trim() === '') {
          toast.error('All options must be filled!');
          return false;
        }
        if (question.optionType === 'Text&image') {
          if (option.text.trim() === '' || option.imageUrl.trim() === '') {
            toast.error('All options must be filled!');
            return false;
          }
        }
      }
  
      if (selectedQuizType === 'Q&A' && question.correctOption === 5) {
        toast.error('A correct answer must be selected for each question in Q&A quizzes!');
        return false;
      }
    }
  
    return true;
  };
  
  
  return (
    <div className={styles.confirmdelete}>
      {quizstep === 1 && (
        <div className={styles.createquizbox}>
          <input
            className={styles.inputquizname}
            placeholder="Enter quiz name"
            value={quizName}
            onChange={handleQuizNameChange}
          />
          <div className={styles.inputquiztype}>
            <span>Quiz Type</span>
            <button
              className={`${styles.inputquiztypebuttons} ${selectedQuizType === 'Q&A' ? styles.selectedtype : ''}`}
              onClick={() => handleQuizTypeSelect('Q&A')}
            >
              Q & A
            </button>
            <button
              className={`${styles.inputquiztypebuttons} ${selectedQuizType === 'Poll' ? styles.selectedtype : ''}`}
              onClick={() => handleQuizTypeSelect('Poll')}
            >
              Poll Type
            </button>
          </div>
          <div className={styles.createquizbuttons}>
            <button onClick={handleCancel}>Cancel</button>
            <button
              disabled={isContinueDisabled}
              className={`${styles.button} ${isContinueDisabled ? styles.disabled : ''}`}
              onClick={handleSubmitQuizStep1}
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {quizstep === 2 && (
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
                  {index > 0 && (
                    <span
                      className={styles.questioncross}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeQuestion(index);
                      }}
                    >
                      ⨯
                    </span>
                  )}
                </div>
              ))}
              {questions.length < 5 && (
                <div style={{ fontSize: '4vh', cursor: 'pointer' }} onClick={addNewQuestion}>
                  🞢
                </div>
              )}
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
              <div className={styles.optionstype}>
                <div>Option Type</div>
                <label className={styles.circularOption}>
                  <input
                    type="radio"
                    name="quizOptionType"
                    value="text"
                    checked={selectedOptiontype === 'text'}
                    onChange={handleOptionTypeChange}
                  />
                  Text
                </label>
                <label className={styles.circularOption}>
                  <input
                    type="radio"
                    name="quizOptionType"
                    value="Image URL"
                    checked={selectedOptiontype === 'Image URL'}
                    onChange={handleOptionTypeChange}
                  />
                  Image URL
                </label>
                <label className={styles.circularOption}>
                  <input
                    type="radio"
                    name="quizOptionType"
                    value="Text&image"
                    checked={selectedOptiontype === 'Text&image'}
                    onChange={handleOptionTypeChange}
                  />
                  Text & Image URL
                </label>
              </div>

              <div className={styles.optionsandtimer}>
                <div className={styles.optionsList}>
                  {questions[currentQuestionIndex].options.map((option, index) => (
                    <div key={index} className={styles.optionline}>
                      {selectedQuizType === 'Q&A' && (
                        <input
                          type="radio"
                          name="quizOption"
                          style={{ transform: 'scale(1.5)' }}
                          className={`${selectedOptionindex === index ? styles.backgroundgreen : ''}`}
                          checked={selectedOptionindex === index}
                          onChange={() => handleCorrectOptionChange(index)}
                        />
                      )}
                      {selectedOptiontype === 'text' && (
                        <input
                          type="text"
                          value={option.text}
                          className={`${styles.optioninput} ${selectedOptionindex === index ? styles.backgroundgreen : ''}`}
                          onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                          placeholder={`Option ${index + 1} Text`}
                        />
                      )}
                      {selectedOptiontype === 'Image URL' && (
                        <input
                          type="text"
                          value={option.imageUrl}
                          className={`${styles.optioninput} ${selectedOptionindex === index ? styles.backgroundgreen : ''}`}
                          onChange={(e) => handleOptionChange(index, 'imageUrl', e.target.value)}
                          placeholder={`Option ${index + 1} Image URL`}
                        />
                      )}
                      {selectedOptiontype === 'Text&image' && (
                        <>
                          <input
                            type="text"
                            value={option.text}
                            style={{ width: '10vw' }}
                            className={`${styles.optioninput} ${selectedOptionindex === index ? styles.backgroundgreen : ''}`}
                            onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                            placeholder={`Option ${index + 1} Text`}
                          />
                          <input
                            type="text"
                            value={option.imageUrl}
                            className={`${styles.optioninput} ${selectedOptionindex === index ? styles.backgroundgreen : ''}`}
                            onChange={(e) => handleOptionChange(index, 'imageUrl', e.target.value)}
                            placeholder={`Option ${index + 1} Image URL`}
                          />
                        </>
                      )}
                      {index > 1 && (
                        <img src={deletesymbol} style={{ cursor: 'pointer', width: '2vw', height: '4vh' }} className={styles.deleteOption} onClick={() => removeOption(index)}></img>
                      )}
                    </div>
                  ))}
                  {questions[currentQuestionIndex].options.length < 4 && (
                    <div className={`${styles.addoptionwrapper} ${selectedQuizType === 'Q&A' && styles.marginleft5vw}`}>
                      <button className={styles.addOption} onClick={addOption}>
                        Add Option
                      </button>
                    </div>
                  )}
                </div>
                {selectedQuizType === 'Q&A' && (
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
            <button onClick={handleCreateQuiz}>Create Quiz</button>
          </div>
        </div>
      )}
      {quizstep === 3 && (
        <div className={styles.quizstep3}>
          <div className={styles.step3content}>
            <div>
              Congrats your Quiz is Published
            </div>
            <div className={styles.linkheretext}>
              Your link is here: <a href={shareableLink}>{shareableLink}</a>
            </div>
            <button onClick={handleShare}>Share</button>
          </div>
          <span className={styles.cancelstep3} onClick={() => navigate('/dashboard')}>🗙</span>
        </div>
      )}
    </div>
  );
}

export default Createquiz;

