import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css'; // Import the CSS file
import { FaUserCircle } from 'react-icons/fa'; // User icon

export const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            let token = localStorage.getItem('accessToken');
            if (!token) {
                // Handle unauthorized access, possibly redirect to login
                navigate('/login');
                return;
            }

            try {
                let response = await fetch('http://localhost:5000/api/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 403) { // Token expired
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        const refreshResponse = await fetch('http://localhost:5000/api/auth/refreshtoken', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ refreshToken }),
                        });

                        const refreshData = await refreshResponse.json();
                        if (refreshResponse.ok) {
                            localStorage.setItem('accessToken', refreshData.accessToken);
                            token = refreshData.accessToken;
                            response = await fetch('http://localhost:5000/api/profile', {
                                method: 'GET',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                },
                            });
                        } else {
                            console.error('Failed to refresh token');
                            history.push('/login');
                            return;
                        }
                    }
                }

                const data = await response.json();
                if (response.ok) {
                    setProfile(data.user);
                } else {
                    console.error('Failed to fetch profile:', data.message);
                }
            } catch (error) {
                console.error('An error occurred while fetching the profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [history]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="profile-container">
            <button onClick={handleLogout} className="logout-button">Logout</button>
            <div className="profile-card">
                <FaUserCircle className="user-icon" />
                <h2>{profile.name}</h2>
                <p>Username: {profile.username}</p>
                <p>Email: {profile.email}</p>
            </div>
        </div>
    );
};
