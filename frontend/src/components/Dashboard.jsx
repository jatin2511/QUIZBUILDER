import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../App.module.css';
import eyeicon from '../assets/eyeicon.png'

function Dashboard({ setcurrentselection,jwttoken }) {
  const [quizStats, setQuizStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalImpressions: 0
  });
  const [trendingData, setTrendingData] = useState([]);

  useEffect(() => {
    setcurrentselection('dashboard');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = jwttoken; 
      if (!token) {
        console.error('No token found');
        return;
      }
      console.log('Token retrieved');
      const { data } = await axios.get('http://quizbuilder-env.eba-qrrtm5dv.ap-south-1.elasticbeanstalk.com/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    console.log(data)
      setQuizStats({
        totalQuizzes: data.totalQuizzes,
        totalQuestions: data.totalQuestions,
        totalImpressions: data.totalImpressions
      });

      setTrendingData(data.trendingQuizzes);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  };
  
  
  return (
    <div style={{ width: '85vw' }}>
      <div className={styles.userquizzesstats}>
        <div className={styles.userquizstatcard} style={{ color: '#FF5D01' }}>
          <span style={{ fontSize: '8vh' }}>{formatNumber(quizStats.totalQuizzes)}&nbsp;&nbsp;</span> <span>quiz created</span>
        </div>

        <div className={styles.userquizstatcard} style={{ color: '#60B84B'}}>
          <span style={{ fontSize: '8vh' }}>{formatNumber(quizStats.totalQuestions)}</span> <span>questions created</span> 
        </div>

        <div className={styles.userquizstatcard} style={{ color: '#5076FF' }}>
          <span style={{ fontSize: '8vh' }}>{formatNumber(quizStats.totalImpressions)}</span> <span>total impressions</span> 
        </div>
      </div>

      <div style={{ marginTop: '10vh', marginLeft: '7vw',marginRight:'8vw' }}>
        <div style={{ fontSize: '45px' }}>Trending Quizzes</div>

        <div className={styles.trendingquizgrid}>
          {trendingData.map((quiz, index) => (
            <div key={index} className={styles.trendinggriditem} onClick={() => window.open(quiz.link, '_blank')}>
              <div>
              <div>{quiz.title.slice(0, 8)}</div>

              <div>{formatNumber(quiz.impressions)}&nbsp; <img src={eyeicon}/></div>
              </div>
              
              <div>Created On: {new Date(quiz.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
