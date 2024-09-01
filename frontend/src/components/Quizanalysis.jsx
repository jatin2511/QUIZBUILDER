import React, { useEffect, useState } from 'react';
import styles from '../App.module.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Quizanalysis({ jwttoken }) {
    const { quizid } = useParams();
    const [quiz, setQuiz] = useState({ questions: [] }); 

    const fetchquizanalytics = async () => {
        try {
            const response = await axios.get(`https://quizbuilder-env.eba-qrrtm5dv.ap-south-1.elasticbeanstalk.com/api/analytics/quiz/${quizid}`, {
                headers: {
                    'Authorization': `Bearer ${jwttoken}`,
                    'Content-Type': 'application/json',
                },
            });
            setQuiz(response.data.quiz || { questions: [] }); 
            
        } catch (error) {
            console.error('Error fetching quiz analytics:', error);
            setQuiz({ questions: [] }); 
        }
    };

    useEffect(() => {
        fetchquizanalytics();
    }, []);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options).replace(',', ', ');
    };

    return (
        <div className={styles.quizanalysis}>
            <div className={styles.quizanalysisheader}>
                <div>
                    {quiz.title} Question Analysis
                </div>
                <div>
                    <div>Created on : {formatDate(quiz.createdAt)}</div>
                    <div>Impressions : {quiz.impressions}</div>
                </div>
            </div>

            <div className={styles.questionsanalysis}>
                {quiz.questions.map((question, index) => (
                    <div key={index} className='questionanalysis'>
                        <div className={styles.questionstatement}>Q.{index + 1} {question.question}</div>
                        {quiz.type === 'Q&A' ? (
                            <div className={styles.questionanalyticsqna}>
                                <div>
                                    <div>{question.stats?.totalAttempts || 0}{console.log(question.stats?.totalAttempts)}</div>
                                    <div>people Attempted the question</div>
                                </div>
                                <div>
                                    <div>{question.stats?.correctAttempts || 0}</div>
                                    <div>people Answered Correctly</div>
                                </div>
                                <div>
                                    <div>{question.stats?.totalAttempts-question.stats?.correctAttempts || 0}</div>
                                    <div>people Answered Incorrectly</div>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.questionanalyticsqna}>
                              {question.options.map((option,idx)=>{
                                return <div>
                                <div>{option.totalAttempts|| 0}</div>
                                <div>Option {idx+1}</div>
                            </div>
                              })}
                            </div>
                        )}
                        <hr style={{ marginBottom: '5vh' }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Quizanalysis;
