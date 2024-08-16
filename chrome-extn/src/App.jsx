import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
    const [redirectEnabled, setRedirectEnabled] = useState(true);

    useEffect(() => {
        // Load the current state of redirectEnabled from Chrome storage
        chrome.storage.sync.get(['redirectEnabled'], (result) => {
            setRedirectEnabled(result.redirectEnabled !== undefined ? result.redirectEnabled : true);
        });
    }, []);

    const handleClick = () => {
        const newState = !redirectEnabled;
        const action = newState ? 'enableRedirect' : 'disableRedirect';
        chrome.runtime.sendMessage({ action }, () => {
            // Callback to ensure the message is sent before updating the state
            setRedirectEnabled(newState);
        });
    };

    return (
        <div>
            <button id="toggleRedirect" onClick={handleClick}>
                {redirectEnabled ? 'Disable Redirect' : 'Enable Redirect'}
            </button>
            <p>testing now</p>
        </div>
    );
}

// Render the React component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
