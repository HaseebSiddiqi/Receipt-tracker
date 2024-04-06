import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserPool from '../UserPool';
import { useAuth } from './AuthContext'; // Importing the AuthContext hook
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const Login = () => {
    const { login } = useAuth(); // Using the useAuth hook from the AuthContext
    const navigate = useNavigate();

    const [isSignUp, setIsSignUp] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleToggle = () => {
        setIsSignUp(!isSignUp);
        setErrorMessage('');
        setSuccessMessage('');
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            if (isSignUp) {
                if (!firstName || !lastName || !userName || !email || !password) {
                    setErrorMessage('Please fill in all required fields.');
                    return;
                }

                if (!validateEmail(email)) {
                    setErrorMessage('Please enter a valid email address.');
                    return;
                }

                if (!validatePassword(password)) {
                    setErrorMessage('Password must be at least 8 characters long and contain at least 1 number, 1 special character, 1 uppercase letter, and 1 lowercase letter.');
                    return;
                }

                const signUpResponse = await UserPool.signUp(userName, password, [
                    { Name: 'given_name', Value: firstName },
                    { Name: 'family_name', Value: lastName },
                    { Name: 'email', Value: email }],
                    null, (err,data) => {
                    if (err) {
                        console.error(err);
                    }
                    console.log(data);}
);

                console.log('Successfully signed up:', signUpResponse);
                setSuccessMessage('Successfully signed up, Please Verify your email before logging in');
                setFirstName('');
                setLastName('');
                setUserName('');
                setEmail('');
                setPassword('');
                navigate(`/verify/${userName}`);
            } else {
                // Login logic
                const user = new CognitoUser({
                    Username: userName,
                    Pool: UserPool
                });

                const authDetails = new AuthenticationDetails({
                    Username: userName,
                    Password: password,
                });

                user.authenticateUser(authDetails, {
                    onSuccess: (data) => {
                        console.log("onSuccess: ", data);
                        setSuccessMessage('Successfully logged in!');
                        // Set user data to the context upon successful login
                        login({ username: userName}); // You can pass any relevant user data here
                        navigate('/about'); // Navigate to home page or wherever after successful login
                    },
                    onFailure: (err) => {
                        console.error("onFailure: ", err);
                        setErrorMessage('Invalid username or password.');
                    },
                    newPasswordRequired: (userAttributes, requiredAttributes) => {
                        console.log("newPasswordRequired: ", userAttributes, requiredAttributes);
                        navigate('/');
                        // Handle the scenario where a new password is required
                        // You might navigate to a page where the user can set a new password
                    },
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error. Please try again.');
        }
    };

    return (
        <div className='login-container'>
            <h1>{isSignUp ? 'Create your account' : 'Sign in to your account'}</h1>
            <form onSubmit={onSubmit}>
                {isSignUp && (
                    <>
                        <div className="input-container">
                            <input value={firstName} placeholder="Enter your first name" onChange={(event) => setFirstName(event.target.value)} />
                        </div>
                        <div className="input-container">
                            <input value={lastName} placeholder="Enter your last name" onChange={(event) => setLastName(event.target.value)} />
                        </div>
                        <div className="input-container">
                            <input value={email} placeholder="Enter your email" onChange={(event) => setEmail(event.target.value)} />
                        </div>
                    </>
                )}
                <div className="input-container">
                    <input value={userName} placeholder="Enter your username" onChange={(event) => setUserName(event.target.value)} />
                </div>
                <div className="input-container">
                    <input value={password} type="password" placeholder="Enter your password" onChange={(event) => setPassword(event.target.value)} />
                </div>
                <button className="button" type="submit">{isSignUp ? 'Create Account' : 'Login'}</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
            {successMessage && <p>{successMessage}</p>}
            <p>
                {isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
                <button className="button" onClick={handleToggle}>{isSignUp ? 'Sign in' : 'Create Account'}</button>
            </p>
        </div>
    );
};

export default Login;
