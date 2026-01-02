// Import React and the useState hook for managing component state
import React, { useState } from 'react';
// Import useNavigate hook from React Router for programmatic navigation
import { useNavigate } from 'react-router-dom';
// Import the CSS file that styles this login page
import '../styles/login.css';

// Main LoginPage component function
function LoginPage() {
    // Initialize navigate function to redirect users after successful login
    const navigate = useNavigate();
    
    // State to toggle between login (true) and signup (false) forms
    const [isLogin, setIsLogin] = useState(false);
    
    // State object to store all form input values
    const [formData, setFormData] = useState({
        email: '',           // User's email address (signup only)
        username: '',        // User's chosen username
        password: '',        // User's password
        passwordConfirm: ''  // Password confirmation field (signup only)
    });
    
    // State object to store validation error messages for each field
    const [errors, setErrors] = useState({});
    
    // State string to display success messages (e.g., "Account created successfully!")
    const [successMessage, setSuccessMessage] = useState('');
    
    // State object to track password strength with display text and CSS class
    const [passwordStrength, setPasswordStrength] = useState({ text: '', className: '' });

    // Get API base URL from environment variable, or use localhost:3000 as fallback
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    // Function to evaluate password strength and return feedback
    const checkPasswordStrength = (password) => {
        // If password is empty, return no feedback
        if (password.length === 0) {
            return { text: '', className: '' };
        }

        // Initialize score counter (max score is 6)
        let score = 0;
        // Add 1 point if password is at least 8 characters
        if (password.length >= 8) score++;
        // Add 1 more point if password is at least 12 characters
        if (password.length >= 12) score++;
        // Add 1 point if password contains lowercase letters
        if (/[a-z]/.test(password)) score++;
        // Add 1 point if password contains uppercase letters
        if (/[A-Z]/.test(password)) score++;
        // Add 1 point if password contains numbers
        if (/[0-9]/.test(password)) score++;
        // Add 1 point if password contains special characters
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        // Score 0-2: Weak password (red text)
        if (score <= 2) {
            return { text: 'Weak password', className: 'weak' };
        // Score 3-4: Medium password (orange text)
        } else if (score <= 4) {
            return { text: 'Medium password', className: 'medium' };
        // Score 5-6: Strong password (green text)
        } else {
            return { text: 'Strong password', className: 'strong' };
        }
    };

    // Function to validate email format using regex pattern
    const isValidEmail = (email) => {
        // Regex: anything + @ + anything + . + anything (no spaces or multiple @)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Return true if email matches the pattern, false otherwise
        return emailRegex.test(email);
    };

    // Function that runs every time user types in any input field
    const handleChange = (e) => {
        // Destructure the input's name and current value from the event
        const { name, value } = e.target;
        // Update formData by keeping all previous values and updating only the changed field
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear any error message for this field as user corrects it
        setErrors(prev => ({ ...prev, [name]: '' }));

        // If user is typing in password field during signup, update strength indicator in real-time
        if (name === 'password' && !isLogin) {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    // Async function to handle signup form submission
    const handleSignup = async (e) => {
        // Prevent default form submission behavior (page reload)
        e.preventDefault();
        // Clear any previous error messages
        setErrors({});
        // Clear any previous success messages
        setSuccessMessage('');

        // Create empty object to collect validation errors
        const newErrors = {};

        // Validate email format using our isValidEmail function
        if (!isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        // Validate username is at least 3 characters long
        if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }
        // Validate password is at least 8 characters long
        if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        // Validate that password and confirm password fields match
        if (formData.password !== formData.passwordConfirm) {
            newErrors.passwordConfirm = 'Passwords do not match';
        }

        // If any validation errors exist, display them and stop submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Try to send signup request to backend API
        try {
            // Send POST request to signup endpoint with user data
            const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                method: 'POST',  // HTTP POST method for creating new resources
                headers: { 'Content-Type': 'application/json' },  // Tell server we're sending JSON
                body: JSON.stringify({  // Convert JavaScript object to JSON string
                    email: formData.email,
                    username: formData.username,
                    password: formData.password
                })
            });

            // Parse the JSON response from the server
            const data = await response.json();

            // If response status is 200-299 (success)
            if (response.ok) {
                // Display success message to user
                setSuccessMessage('Account created successfully! Please log in.');
                // After 1.5 seconds, switch to login form and clear sensitive fields
                setTimeout(() => {
                    setIsLogin(true);  // Switch to login form
                    // Clear email, password, and confirm password but keep username
                    setFormData(prev => ({ ...prev, email: '', password: '', passwordConfirm: '' }));
                }, 1500);
            } else {
                // If server returns error, display the error message
                setErrors({ email: data.message || 'Registration failed' });
            }
        } catch (error) {
            // If network request fails (server down, no internet, etc.)
            console.error('Registration error:', error);
            setErrors({ email: 'Unable to connect to server. Please try again later.' });
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        const newErrors = {};

        if (formData.username.length === 0) {
            newErrors.username = 'Please enter your username';
        }
        if (formData.password.length === 0) {
            newErrors.password = 'Please enter your password';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setSuccessMessage('Login successful! Redirecting...');

                setTimeout(() => {
                    navigate('/planner');
                }, 1500);
            } else {
                setErrors({ username: data.message || 'Login failed' });
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({ username: 'Unable to connect to server. Please try again later.' });
        }
    };

    return (
        <> 
            <div className="login-page">
                <div className="container">
                <div className="header">
                    <h1>🎓 UCLA Bear Planner</h1>
                    <p>Plan your academic journey</p>
                </div>

                <div className="form-container">
                    {!isLogin ? (
                        <form onSubmit={handleSignup} className="form active">
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={errors.email ? 'error' : ''}
                                    required
                                />
                                {errors.email && <span className="error-message show">{errors.email}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={errors.username ? 'error' : ''}
                                    required
                                />
                                {errors.username && <span className="error-message show">{errors.username}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={errors.password ? 'error' : ''}
                                    required
                                />
                                {passwordStrength.text && (
                                    <span className={`password-strength ${passwordStrength.className}`}>
                                        {passwordStrength.text}
                                    </span>
                                )}
                                {errors.password && <span className="error-message show">{errors.password}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="passwordConfirm">Confirm Password</label>
                                <input
                                    type="password"
                                    id="passwordConfirm"
                                    name="passwordConfirm"
                                    placeholder="Re-enter your password"
                                    value={formData.passwordConfirm}
                                    onChange={handleChange}
                                    className={errors.passwordConfirm ? 'error' : ''}
                                    required
                                />
                                {errors.passwordConfirm && <span className="error-message show">{errors.passwordConfirm}</span>}
                            </div>

                            {successMessage && <span className="success-message show">{successMessage}</span>}

                            <button type="submit" className="btn">Create Account</button>

                            <div className="switch-form">
                                Already have an account?{' '}
                                <a onClick={() => setIsLogin(true)}>Log In</a>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="form active">
                            <div className="form-group">
                                <label htmlFor="loginUsername">Username</label>
                                <input
                                    type="text"
                                    id="loginUsername"
                                    name="username"
                                    placeholder="Enter your username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={errors.username ? 'error' : ''}
                                    required
                                />
                                {errors.username && <span className="error-message show">{errors.username}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="loginPassword">Password</label>
                                <input
                                    type="password"
                                    id="loginPassword"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={errors.password ? 'error' : ''}
                                    required
                                />
                                {errors.password && <span className="error-message show">{errors.password}</span>}
                            </div>

                            {successMessage && <span className="success-message show">{successMessage}</span>}

                            <button type="submit" className="btn">Log In</button>

                            <div className="switch-form">
                                Don't have an account?{' '}
                                <a onClick={() => setIsLogin(false)}>Sign Up</a>
                            </div>
                        </form>
                    )}
                </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;

