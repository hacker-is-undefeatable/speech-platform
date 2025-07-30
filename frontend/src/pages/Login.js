import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { supabase } from './supabaseClient';
// import SmokeyCursor from '../components/lightswind/smokey-cursor';
import './Login.css';

export default function Login({ setIsAuthenticated }) {
  const [isRegister, setIsRegister] = useState(false);
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [warnings, setWarnings] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for register mode in query parameters
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('mode') === 'register') {
      setIsRegister(true);
    }
  }, [location.search]);

  // Add Enter key handler for both Login and Register pages
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleSubmit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [email, password, confirmPassword, firstName, lastName, isRegister]); // Dependencies to ensure latest values

  const translations = {
    en: {
      register: 'Register',
      login: 'Login',
      lastName: 'Last Name',
      firstName: 'First Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      login: 'Login',
      register: 'Register',
      toggleRegister: 'No account? Register',
      toggleLogin: 'Already have an account? Login',
      failure: 'Registration/Login Failed',
      showPassword: 'Show',
      hidePassword: 'Hide',
      mismatchWarning: 'Passwords do not match.',
      emptyWarning: 'This field is required.',
      invalidEmail: 'Please enter a valid email address.',
      invalidPassword: 'Password must contain uppercase, lowercase, numbers, and symbols',
    },
  };

  const t = translations.en;

  const validateForm = () => {
    const newWarnings = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (isRegister) {
      if (!lastName) newWarnings.lastName = t.emptyWarning;
      if (!firstName) newWarnings.firstName = t.emptyWarning;
      if (!email) newWarnings.email = t.emptyWarning;
      else if (!emailRegex.test(email)) newWarnings.email = t.invalidEmail;
      if (!password) newWarnings.password = t.emptyWarning;
      else if (!passwordRegex.test(password)) newWarnings.password = t.invalidPassword;
      else if (password !== confirmPassword) newWarnings.confirmPassword = t.mismatchWarning;
      else if (!confirmPassword) newWarnings.confirmPassword = t.emptyWarning;
    } else {
      if (!email) newWarnings.email = t.emptyWarning;
      else if (!emailRegex.test(email)) newWarnings.email = t.invalidEmail;
      if (!password) newWarnings.password = t.emptyWarning;
    }
    setWarnings(newWarnings);
    return Object.keys(newWarnings).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isRegister) {
        // Register with Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        });

        if (error) {
          console.error('Registration error:', error.message);
          alert(`${t.failure}: ${error.message}`);
          return;
        }

        if (data.user) {
          // Insert data into user_profiles table
          const { error: profileError } = await supabase.from('user_profiles').insert({
            id: data.user.id,
            email: email,
            display_name: `${firstName} ${lastName}`.trim(),
            credits: 30,
          });

          if (profileError) {
            console.error('Profile insertion error:', profileError.message);
            alert(`${t.failure}: Failed to create profile.`);
            return;
          }

          if (data.session) {
            // If email confirmation is disabled, a session is created
            localStorage.setItem('token', data.session.access_token);
            setIsAuthenticated(true);
            navigate('/');
          } else {
            // If email confirmation is enabled, inform user
            alert('Registration successful! Please check your email to confirm your account.');
            navigate('/login');
          }
        }
      } else {
        // Login with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Login error:', error.message);
          alert(`${t.failure}: ${error.message}`);
          return;
        }

        if (data.session) {
          localStorage.setItem('token', data.session.access_token);
          setIsAuthenticated(true);
          navigate('/');
        } else {
          alert(t.failure);
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert(`${t.failure}: ${error.message}`);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      {/* <SmokeyCursor /> */}
      <div className="content-container-login">
        <div className="login-box">
          <div className="login-content">
            <a href="/" className="back-link" onClick={handleBack}>
              <img src="images/arrow.png" alt="Back" className="back-arrow" />
            </a>
            <h2>{isRegister ? t.register : t.login}</h2>
            {isRegister && (
              <>
                <input
                  className="input-field"
                  placeholder={t.lastName}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onPaste={handlePaste}
                />
                {warnings.lastName && <div className="warning">{warnings.lastName}</div>}
                <input
                  className="input-field"
                  placeholder={t.firstName}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onPaste={handlePaste}
                />
                {warnings.firstName && <div className="warning">{warnings.firstName}</div>}
              </>
            )}
            <input
              className="input-field"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onPaste={handlePaste}
            />
            {warnings.email && <div className="warning">{warnings.email}</div>}
            <div className="password-wrapper">
              <input
                className="input-field"
                type={showPassword ? 'text' : 'password'}
                placeholder={t.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onPaste={handlePaste}
              />
              <button
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? t.hidePassword : t.showPassword}
              </button>
            </div>
            {warnings.password && <div className="warning">{warnings.password}</div>}
            {isRegister && (
              <>
                <div className="password-wrapper">
                  <input
                    className="input-field"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t.confirmPassword}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onPaste={handlePaste}
                  />
                  <button
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? t.hidePassword : t.showPassword}
                  </button>
                </div>
                {warnings.confirmPassword && <div className="warning">{warnings.confirmPassword}</div>}
              </>
            )}
            <button className="submit-button" onClick={handleSubmit}>
              {isRegister ? t.register : t.login}
            </button>
            <button className="toggle-button" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? t.toggleLogin : t.toggleRegister}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}