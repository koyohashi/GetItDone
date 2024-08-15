import React, { useState, useEffect } from 'react';

function App() {

    const [redirectEnabled, setRedirectEnabled] = useState(true);

    useEffect(() => {
        chrome.storage.sync.get(['redirectEnabled'], (result) => {
            setRedirectEnabled(result.redirectEnabled !== undefined ? result.redirectEnabled : true);
        });
    }, []);

    const handleClick = () => {
        const newState = !redirectEnabled;
        const action = newState ? 'enableRedirect' : 'disableRedirect';
        chrome.runtime.sendMessage({ action });
        setRedirectEnabled(newState);
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

export default App;
