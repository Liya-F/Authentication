import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

export const Home = () => {
    return (
        <div className="home-container">
            <h1>Welcome!</h1>
            <p>This is a simple application with authentication features. Below are the available routes:</p>
            <ul>
                <li>
                    <Link to="/register" className="route-link">/register</Link>
                </li>
                <li>
                    <Link to="/login" className="route-link">/login</Link>
                </li>
                <li>
                    <Link to="/profile" className="route-link">/profile</Link>
                    <span>(protected)</span>
                </li>
            </ul>
        </div>
    );
};
