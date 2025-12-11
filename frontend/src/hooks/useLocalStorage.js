
import { useState, useEffect } from 'react';

// Loads and saves state to browser
function useLocalStorage(key, initialValue) {
    // Get value from localStorage
    const [value, setValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;

        } catch (error) {
            console.error(error);
            return initialValue;
        }
    })

    // Update localStorage on change
    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue]
}

export default useLocalStorage