import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginSignupPage from './Pages/LoginSignupPage';
import Dashboard from './components/Dashboard';
import Createquiz from './components/Createquiz';
import Editquiz from './components/Editquiz';
import Analytics from './components/Analytics';
import Quizanalysis from './components/Quizanalysis';
import QuizPage from './Pages/QuizPage'
import styles from './App.module.css';

function App() {
  const [jwttoken, setjwttoken] = useState('');
  const [currentselection, setcurrentselection] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setjwttoken(token);
    }
  }, []);

  return (
    <Router>
      <div className={styles.font20px} style={{ overflow: 'hidden', position: 'relative' }}>
        <div className={styles.App}>
          <Sidebar currentselection={currentselection} setcurrentselection={setcurrentselection} setjwttoken={setjwttoken} />
          <Routes>
            <Route 
              path="/" 
              element={jwttoken ? <Navigate to="/dashboard" /> : <LoginSignupPage setjwttoken={setjwttoken} />} 
            />
            <Route path='/dashboard' element={!jwttoken ? <LoginSignupPage setjwttoken={setjwttoken}/> :<Dashboard setcurrentselection={setcurrentselection} jwttoken={jwttoken}/> } />
            <Route path='/analytics' element={!jwttoken ? <LoginSignupPage setjwttoken={setjwttoken}/> :<Analytics jwttoken={jwttoken} />} />
            <Route path='/createquiz' element={!jwttoken ? <LoginSignupPage setjwttoken={setjwttoken}/> :<Createquiz />} />
            <Route path='/updatequiz/:quizid' element={!jwttoken ? <LoginSignupPage setjwttoken={setjwttoken}/> :<Editquiz jwttoken={jwttoken}/>} />
            <Route path='/quizanalysis/:quizid' element={!jwttoken ? <LoginSignupPage setjwttoken={setjwttoken}/> :<Quizanalysis jwttoken={jwttoken} />} />
            <Route path='/quiz/:quizid' element={<QuizPage/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
