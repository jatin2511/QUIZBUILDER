import React, { useState } from 'react';
import styles from '../App.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';

function Signup({ setsignupopen }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [validationError, setValidationError] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value || ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};

        if (!formData.name) {
            setFormData({...formData, 'name': ''})
            errors.name = "Name is required";
        }
        if (!formData.email) {
            setFormData({...formData, 'email': ''})
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setFormData({...formData, 'email': ''})
            errors.email = "Email is invalid";
        }
        if (!formData.password) {
            setFormData({...formData, 'password': ''})
            errors.password = "Password is required";
        }
        if (!formData.confirmPassword) {
            setFormData({...formData, 'confirmPassword': ''})
            errors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            setFormData({...formData, 'confirmPassword': ''})
            errors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(errors).length > 0) {
            setValidationError(errors);
        } else {
            try {
                await axios.post('http://quizbuilder-env.eba-qrrtm5dv.ap-south-1.elasticbeanstalk.com/api/auth/register', formData);
                setValidationError({});
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
                setsignupopen(false);
                toast.success("User registered successfully!");
            } catch (error) {
                console.error('Error during registration:', error);
                toast.error("Registration failed. user already exists.");
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className={styles.formdata}>
                <div> 
                    <label>Name</label>
                    <input 
                        className={`${styles.forminput} ${validationError.name ? styles.errorText : ''}`}
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder={validationError.name || "Enter your name"}
                    />
                </div>
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
                <div>
                    <label>Confirm Password</label>
                    <input 
                        className={`${styles.forminput} ${validationError.confirmPassword ? styles.errorText : ''}`}
                        type="password" 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        placeholder={validationError.confirmPassword || "Confirm your password"}
                    />
                </div>
                <div style={{width:'100%'}} className={styles.flexjustifycenter}>
                    <button className={styles.submitformbutton} type="submit">Sign-Up</button> 
                </div>
            </form>
        </div>
    );
}

export default Signup;
