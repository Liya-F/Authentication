import React, { useState } from 'react';
import { Snackbar, Button, TextField, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import './styles/login.css'; // Import your CSS

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState('success'); // 'success' or 'error'

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setMessage("Both fields are required.");
            setSeverity('error');
            setOpen(true);
            return;
        }

        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            setMessage(data.message);
            setSeverity('success');
            setOpen(true);
            setUsername('');
            setPassword('');
        } else {
            setMessage(data.message || 'Login failed.');
            setSeverity('error');
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="login-form">
                <Typography variant="h4">Login</Typography>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={severity}>
                        {message}
                    </Alert>
                </Snackbar>
                <div>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </form>
        </div>
    );
};
