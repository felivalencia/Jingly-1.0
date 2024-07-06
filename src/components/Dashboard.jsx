import React, { useState, useEffect, useRef } from 'react';
import { getToneJSScript } from '../../utils/openai'; // Adjust the path as per your project structure
import * as Tone from 'tone';
import axios from 'axios';

const Dashboard = () => {
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [router, setRouter] = useState(1);
    const [prompt, setPrompt] = useState('');
    const [toneScript, setToneScript] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState(null);
    const synth = useRef(null);
    const repeatFunction = useRef(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            setUsername(userData.user.username);
            setProfilePicture(userData.user.img);
        }
    }, []);

    useEffect(() => {
        synth.current = new Tone.Synth({
            oscillator: {
                type: 'sawtooth'
            },
            envelope: {
                attack: 0.1,
                decay: 0.2,
                sustain: 0.5,
                release: 0.8
            }
        }).toDestination();
    }, []);

    const handleClick = () => {
        setRouter(2);
    };

    const handleInputChange = (event) => {
        setPrompt(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await getToneJSScript(prompt);
            setToneScript(response);
            setError(null);
        } catch (error) {
            console.error('Error generating Tone.js script:', error);
            setError('Could not generate Tone.js script. Please try again.');
        }
    };


  const handlePlay = () => {
    if (!toneScript) {
      setError('Please generate a Tone.js script first.');
      return;
    }

    try {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      
      createScriptFunction(toneScript)();
      Tone.Transport.start();
      setIsPlaying(true);
      setError(null);
    } catch (error) {
      console.error('Error playing Tone.js script:', error);
      setError('Could not play Tone.js script. Please try again.');
    }
  };

  const handleStop = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    setIsPlaying(false);
  };

    const saveTrack = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/save-tune', { 
               userId: JSON.parse(localStorage.getItem('userData')).user.id,
               trackCode: toneScript,
               prompt
            });

            if (response.status === 200) {
                alert("tune saved!")

            } 
        } catch (error) {
            console.error('Saving error:', error.response?.data || error.message);
            alert('An error occurred during sync');
        }
    };

    const createScriptFunction = (script) => {
        console.log(script);
        const scriptFunction = new Function('Tone', script);
        return scriptFunction.bind(null, Tone);
    };

    return (
        <div className='dashboard'>
            {router === 1 && (
                <div className='animate__animated animate__fadeInUp flex-container'>
                    <h1 className="welcome-message">Welcome to <span className="highlight">Jingly</span>, {username}!</h1>
                    {profilePicture && (
                        <div className="profile-picture-container">
                            <img
                                src={profilePicture}
                                alt="Profile"
                                className="profile-picture"
                            />
                        </div>
                    )}
                    <button onClick={handleClick} className="start-button">Start</button>
                </div>
            )}
            {router === 2 && (
                <div className='animate__animated animate__fadeInUp'>
                    <h1>What do you want to hear?</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={prompt}
                            onChange={handleInputChange}
                            required
                        />
                        <button type="submit">Generate Script</button>
                    </form>
                    {error && <div className="error-message">{error}</div>}
                    {toneScript && (
                        <div>
                            <button onClick={handlePlay} disabled={isPlaying}>
                                {isPlaying ? 'Playing...' : 'Play'}
                            </button>
                            {isPlaying && (
                                <div>
                                <button onClick={handleStop}>Stop</button>
                                    <button onClick={saveTrack}>Add to favorites</button>
                                    </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            {router === 3 && (
                <div className='animate__animated animate__bounceInDown'>
                    <h1>Give me an emotion and tempo</h1>
                    <input />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
