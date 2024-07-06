import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.scss";

export function App() {
    const navigate = useNavigate();
    const [showWelcome, setShowWelcome] = useState(false);
    const [showDate, setShowDate] = useState(false);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const showWelcomeTimeout = setTimeout(() => {
            setShowWelcome(true);
        }, 1000); // Delay for 1 second before showing "Welcome to Jingly"

        const showDateTimeout = setTimeout(() => {
            setShowDate(true);
        }, 2000); // Delay for another second before showing the date

        const showButtonTimeout = setTimeout(() => {
            setShowButton(true);
        }, 3000); // Delay for another second before showing the button

        // Clean up timeouts to avoid memory leaks
        return () => {
            clearTimeout(showWelcomeTimeout);
            clearTimeout(showDateTimeout);
            clearTimeout(showButtonTimeout);
        };
    }, []);

    const handleButtonClick = () => {
        navigate("/login");
    };

    return (
        <div className="app">
            <div className={`fade-in ${showWelcome ? "visible" : ""}`}>
            <h1>Welcome to <span className="highlight">Jingly</span></h1>
            </div>
            <div className={`fade-in ${showDate ? "visible" : ""}`}>
                <h2>{new Date().toLocaleDateString()}</h2>
            </div>
            <div className={`fade-in ${showButton ? "visible" : ""}`}>
                <button onClick={handleButtonClick} className="get-started-btn">
                    Get Started
                </button>
            </div>
        </div>
    );
}

export default App;
