import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../App.module.css';
import Confirmdelete from './Confirmdelete';
import { useNavigate } from 'react-router-dom';
import shareicon from '../assets/shareicon.png';
import deletesymbol from '../assets/deletesymbol.png';
import editicon from '../assets/editicon.png';
import { toast } from 'react-toastify';

function Analytics({ jwttoken }) {
  const [quizzes, setQuizzes] = useState([]);
  const [openconfirmdelete, setopenconfirmdelete] = useState(false);
  const [quiztodelete, setquiztodelete] = useState('');
  const Navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('http://quizbuilder-env.eba-qrrtm5dv.ap-south-1.elasticbeanstalk.com/api/analytics', {
        headers: {
          'Authorization': `Bearer ${jwttoken}`,
          'Content-Type': 'application/json',
        },
      });
      setQuizzes(response.data.quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handleDeleteSuccess = () => {
    fetchQuizzes(); 
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options).replace(',', ', ');
  };

  const handleShareClick = (quizId) => {
    const link = `https://quizbuilder.vercel.app/quiz/${quizId}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        toast.success('Link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
        toast.error('Failed to copy link.');
      });
  };

  return (
    <div className={styles.analytics}>
      <div className={styles.quizanalysistext}>
        Quiz Analysis
      </div>

      <div className={styles.tablewrapper}>
        <table className={styles.quizanalysistable}>
          <thead>
            <tr>
              <td className={styles.firstHeaderCell}>S.No</td>
              <td>Quiz Name</td>
              <td>Created on</td>
              <td>Impression</td>
              <td></td>
              <td className={styles.lastHeaderCell}></td>
            </tr>
          </thead>
          <tbody className={styles.quizanalysisbody}>
            {quizzes.map((quiz, index) => (
              <tr key={index} className={styles.quizRow}>
                <td>{index + 1}</td>
                <td>{quiz.title}</td>
                <td>{formatDate(quiz.createdAt)}</td>
                <td>{quiz.impressions}</td>
                <td className={styles.linksColumn}>
                  <img src={editicon} alt="Edit" onClick={()=>{Navigate(`/updatequiz/${quiz._id}`)}}/>
                  <img 
                    src={deletesymbol} 
                    alt="Delete" 
                    onClick={() => {
                      setopenconfirmdelete(true);
                      setquiztodelete(quiz._id);
                    }} 
                  />
                  <img 
                    src={shareicon} 
                    alt="Share" 
                    onClick={() => handleShareClick(quiz._id)}
                  />
                </td>
                <td>
                  <span 
                    className={styles.analysisLink} 
                    onClick={() => { Navigate(`/quizanalysis/${quiz._id}`) }}
                  >
                    Question Wise Analysis
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {openconfirmdelete && (
        <Confirmdelete
          jwttoken={jwttoken}
          quizid={quiztodelete}
          setconfirmdeleteopen={setopenconfirmdelete}
          onDeleteSuccess={handleDeleteSuccess} 
        />
      )}
    </div>
  );
}

export default Analytics;
