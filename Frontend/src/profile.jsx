import React, { useState, useEffect } from 'react';

export const Profile = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        // Code to fetch profile data
    }, []);

    return (
        <div>
            <h2>Profile</h2>
            {profile ? (
                <>
                    <p>Name: {profile.name}</p>
                    <p>Username: {profile.username}</p>
                    <p>Email: {profile.email}</p>
                </>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};
