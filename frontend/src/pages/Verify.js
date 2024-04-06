// verify.js

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserPool from '../UserPool';
import { CognitoUser } from 'amazon-cognito-identity-js';


const Verify = () => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const { username } = useParams(); // Assuming the username is passed in the URL

    const handleVerification = async (event) => {
        event.preventDefault();
    
        try {
            if (!username) {
                throw new Error('Username is missing from URL parameters.');
            }
    
            if (!confirmationCode) {
                throw new Error('Please enter the confirmation code.');
            }
    
            const userData = {
                Username: username,
                Pool: UserPool
            };
    
            const cognitoUser = new CognitoUser(userData);
            await cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
                if (err) {
                    setErrorMessage('Error confirming account. Please try again.');
                    console.error(err);
                } else {
                    setSuccessMessage('Account confirmed successfully!');
                    navigate('/login');
                }
            });
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(error.message || 'Error confirming account. Please try again.');
        }
    };

    return (
        <div className='login-container'>
            <h1>Verify your account</h1>
            <form onSubmit={handleVerification}>
                <div className="input-container">
                    <input value={confirmationCode} placeholder="Enter confirmation code" onChange={(event) => setConfirmationCode(event.target.value)} />
                </div>
                <button className="button" type="submit">Verify Account</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
            {successMessage && <p>{successMessage}</p>}
        </div>
    );
};

export default Verify;
