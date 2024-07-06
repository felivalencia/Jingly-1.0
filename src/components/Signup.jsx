// src/components/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { convertFileToBase64 } from '../../utils/fileUtils.js';
import '../App.scss';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value, files } = event.target;
        if (name === 'username') setUsername(value);
        if (name === 'password') setPassword(value);
        if (name === 'email') setEmail(value);
        if (name === 'profilePicture') setProfilePicture(files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!profilePicture) {
            alert("Please select a profile picture.");
            return;
        }

        convertFileToBase64(profilePicture, async (base64Image) => {
            try {
                const response = await axios.post('http://localhost:3001/api/signup', {
                    username,
                    password,
                    email,
                    profilePicture: base64Image
                });


                if (response.status === 201) {
                     const { user } = response.data; 
                    // Store username and profilePicture in localStorage
                    localStorage.setItem('userData', JSON.stringify({ user }));
                    
                    console.log('User registered successfully:', response.data);
                    navigate('/success');
                } else {
                    console.error('Unexpected status code:', response.status);
                    alert('Unexpected response. Please try again.');
                }
            } catch (error) {
                console.error('Signup error:', error.response?.data || error.message);
                alert('Registration failed. Please try again later.');
            }
        });
    };

    return (
        <div className='wrapper'>
            <div className='form-container'>
                <div className='title'>Register</div>
                <form onSubmit={handleSubmit}>
                    <div className='field'>
                        <input
                            type="text"
                            name="username"
                            placeholder='Username:'
                            value={username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className='field'>
                        <input
                            type="password"
                            name="password"
                            placeholder='Password:'
                            value={password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className='field'>
                        <input
                            type="email"
                            name="email"
                            placeholder='Email (optional):'
                            value={email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='fieldd'>
                        <input
                            type="file"
                            name="profilePicture"

                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="field">
                        <button type="submit" className='register-btn'>Register</button>
                    </div>
                    <div className='link-to-p'>
                        <p>Already have an account? <Link to='/login'>Login Here</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
