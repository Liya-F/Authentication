import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css'; // Import your CSS
import { Snackbar, Button, TextField, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

// Alert component to be used inside Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const navigate = useNavigate();

    const validateInputs = () => {
        const newErrors = {};

        // Name validation: only letters
        const nameRegex = /^[A-Za-z]+$/;
        if (!nameRegex.test(name)) {
            newErrors.name = "Name should contain only letters.";
        }

        // Email validation: simple email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email.";
        }

        // Username validation: letters, numbers, and underscores
        const usernameRegex = /^[A-Za-z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            newErrors.username = "Username can only contain letters, numbers, and underscores.";
        }

        // Password validation: at least 6 characters, contains letter, number, and special character
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            newErrors.password = "Password must be at least 6 characters long and contain a letter, a number, and a special character.";
        }

        // Confirm password match
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match!";
        }

        setErrors(newErrors);

        // If no errors, return true
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateInputs()) {
            return;
        }

        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            setSuccessMessage(data.message);
            setOpenSuccessSnackbar(true);
            setName('');
            setEmail('');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            navigate('/login')
        } else {
            setErrorMessage(data.message);
            setOpenErrorSnackbar(true);
        }
    };

    const handleCloseSuccessSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccessSnackbar(false);
    };

    const handleCloseErrorSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenErrorSnackbar(false);
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="register-form">
            <Typography variant="h4">Register</Typography>
                {errors.general && <p className="error-message">{errors.general}</p>}
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    {errors.name && <small className="error-text">{errors.name}</small>}
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {errors.email && <small className="error-text">{errors.email}</small>}
                </div>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    {errors.username && <small className="error-text">{errors.username}</small>}
                </div>
                <div className="password-wrapper">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errors.password && <small className="error-text">{errors.password}</small>}
                </div>
                <div className="password-wrapper">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {errors.confirmPassword && <small className="error-text">{errors.confirmPassword}</small>}
                </div>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Register
                </Button>
            </form>

            {/* Snackbar for success message */}
            <Snackbar
                open={openSuccessSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSuccessSnackbar}
            >
                <Alert onClose={handleCloseSuccessSnackbar} severity="success">
                    {successMessage}
                </Alert>
            </Snackbar>

            {/* Snackbar for error message */}
            <Snackbar
                open={openErrorSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseErrorSnackbar}
            >
                <Alert onClose={handleCloseErrorSnackbar} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};
