import React, {useState} from "react";
import styles from '../App.module.css';
import { useNavigate } from "react-router-dom";
function Sidebar({currentselection, setcurrentselection,setjwttoken}) {
    const navigate = useNavigate();
  const handlelogout = ()=>{
    setjwttoken('');
    localStorage.clear();

  }
    return (
      <div className={styles.sidebar}>
        <div className={styles.jomhuria_regular}>
          Quizzie
        </div>
        <div className={styles.sidebaroptions}>
          <div
            className={`${currentselection === 'dashboard' ? styles.sidebarcurrentselection : ''} ${styles.sidebartoggleoption}`}
            onClick={() => { setcurrentselection('dashboard'); navigate('/dashboard'); }}
          >
            Dashboard
          </div>
          <div
            className={`${currentselection === 'analytics' ? styles.sidebarcurrentselection : ''} ${styles.sidebartoggleoption}`}
            onClick={() => { setcurrentselection('analytics'); navigate('/analytics'); }}
          >
            Analytics
          </div>
          <div
            className={`${currentselection === 'createquiz' ? styles.sidebarcurrentselection : ''} ${styles.sidebartoggleoption}`}
            onClick={() => { setcurrentselection('createquiz'); navigate('/createquiz'); }}
          >
            Create Quiz
          </div>
        </div>
        <div className={styles.logoutarea}>
          <hr style={{ width: '170px', border: '1px solid black' }} />
          <div style={{ cursor: 'pointer' }} onClick={handlelogout}>Logout</div>
        </div>
      </div>
    );
  }
  
  export default Sidebar;