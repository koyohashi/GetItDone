import React, { useState, useEffect, useRef } from 'react';

function App() {
    const [redirectEnabled, setRedirectEnabled] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [isRedirectEnabled, setIsRedirectEnabled] = useState(true);
    const newTaskRef = useRef(null); // Create a ref to the new task input

    useEffect(() => {
        // Load the current state of redirectEnabled, tasks, and isRedirectEnabled from Chrome storage
        chrome.storage.sync.get(['redirectEnabled', 'tasks', 'isRedirectEnabled'], (result) => {
            setRedirectEnabled(result.redirectEnabled !== undefined ? result.redirectEnabled : true);
            setTasks(result.tasks || []);
            setIsRedirectEnabled(result.isRedirectEnabled !== undefined ? result.isRedirectEnabled : true);
        });
    }, []);

    useEffect(() => {
        // Save tasks to Chrome storage and update redirect when tasks or isRedirectEnabled change
        const remainingTasks = tasks.filter(task => !task.completed);
        chrome.storage.sync.set({ tasks: remainingTasks });

        const hasIncompleteTasks = remainingTasks.length > 0;
        const shouldRedirect = isRedirectEnabled && hasIncompleteTasks;

        if (redirectEnabled !== shouldRedirect) {
            setRedirectEnabled(shouldRedirect);
            chrome.storage.sync.set({ redirectEnabled: shouldRedirect });
            chrome.runtime.sendMessage({ action: shouldRedirect ? 'enableRedirect' : 'disableRedirect' });
        }
    }, [tasks, isRedirectEnabled]);

    const handleCheck = (index) => {
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
    };

    const addTask = () => {
        const newTask = { text: '', completed: false };
        setTasks(prevTasks => {
            const updatedTasks = [...prevTasks, newTask];
            // Focus the input field of the newly added task
            setTimeout(() => {
                if (newTaskRef.current) {
                    newTaskRef.current.focus();
                }
            }, 0); // Use a timeout to ensure the state has been updated
            return updatedTasks;
        });
    };

    const handleTaskChange = (index, newText) => {
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, text: newText } : task
        );
        setTasks(updatedTasks);
    };

    const handleToggleRedirect = () => {
        const newState = !isRedirectEnabled;
        setIsRedirectEnabled(newState);
        chrome.storage.sync.set({ isRedirectEnabled: newState });
    };

    return (
        <div>
            <ul>
                {tasks.map((task, index) => (
                    <li key={index}>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleCheck(index)}
                        />
                        <input
                            type="text"
                            value={task.text}
                            onChange={(e) => handleTaskChange(index, e.target.value)}
                            placeholder="Enter task"
                            ref={index === tasks.length - 1 ? newTaskRef : null} // Assign ref to the last task
                        />
                    </li>
                ))}
            </ul>
            <button onClick={addTask}>Add Task</button>
            <button onClick={handleToggleRedirect}>
                {isRedirectEnabled ? 'ON' : 'OFF'}
            </button>
        </div>
    );
}

export default App;
