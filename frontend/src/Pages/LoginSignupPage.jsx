import React, { useState } from 'react';
import styles from '../App.module.css';
import Signup from '../components/Signup';
import Login from '../components/Login';

function LoginSignUpPage({setjwttoken}) {
    const [signupopen,setsignupopen]=useState(true);
    
  return (
    <div className={styles.capturescreen}>
        <div className={styles.loginsignup}>

        <div className={styles.jomhuria_regular}>
            Quizzie
        </div>

        <div className={styles.flexjustifycenter} >
            <div className={`${styles.signuplogintoggle} ${signupopen ? styles.signuplogintoggleshadow:''}`} onClick={()=>{setsignupopen(true)}} >Sign Up</div>
            <div className={`${styles.signuplogintoggle} ${!signupopen ? styles.signuplogintoggleshadow:''}`} onClick={()=>{setsignupopen(false)}}>Log In</div>
        </div>
            
        <div style={{margin:'50px'}}>
            {signupopen ?
             <Signup setsignupopen={setsignupopen}/>
            :
            <Login setjwttoken={setjwttoken}/>}
        </div>
        </div>
        
    </div>
  );
}

export default LoginSignUpPage;