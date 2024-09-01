import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import styles from '../App.module.css';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

function Login({ setjwttoken }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [validationError, setValidationError] = useState({});
    const Navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value || ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};

        if (!formData.email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email is invalid";
        }
        if (!formData.password) {
            errors.password = "Password is required";
        }

        if (Object.keys(errors).length > 0) {
            setValidationError(errors);
            return; 
        }

        try {
            const response = await axios.post('https://quizbuilder-env.eba-qrrtm5dv.ap-south-1.elasticbeanstalk.com/api/auth/login', formData);
            setjwttoken(response.data.token);
            localStorage.setItem('token', response.data.token); 
            setValidationError({});
            setFormData({
                email: '',
                password: ''
            });
            toast.success(`Signed in as ${formData.email}`); 
            Navigate('/dashboard');
        } catch (err) {
            if (err.response) {
                toast.error(err.response.data.msg || 'Server error'); 
            } else {
                toast.error('Network error'); 
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className={styles.formdata}>
                <div>
                    <label>Email</label>
                    <input 
                        className={`${styles.forminput} ${validationError.email ? styles.errorText : ''}`}
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder={validationError.email || "Enter your email"}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input 
                        className={`${styles.forminput} ${validationError.password ? styles.errorText : ''}`}
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        placeholder={validationError.password || "Enter your password"}
                    />
                </div>
                <div style={{ width: '100%' }} className={styles.flexjustifycenter}>
                    <button className={styles.submitformbutton} type="submit">Login</button> 
                </div>
            </form>
            <ToastContainer /> 
        </div>
    );
}

export default Login;
