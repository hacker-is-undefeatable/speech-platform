import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';
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
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    number: false,
    specialChar: false,
    upperLower: false,
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('mode') === 'register') {
      setIsRegister(true);
    }
  }, [location.search]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleSubmit();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [email, password, confirmPassword, firstName, lastName, isRegister]);

  useEffect(() => {
    setPasswordCriteria({
      length: password.length >= 8,
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      upperLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
    });
  }, [password]);

  const translations = {
    en: {
      register: 'Register',
      login: 'Login',
      lastName: 'Last Name',
      firstName: 'First Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
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
            localStorage.setItem('token', data.session.access_token);
            setIsAuthenticated(true);
            navigate('/');
          } else {
            alert('Registration successful! Please check your email to confirm your account.');
            navigate('/login');
          }
        }
      } else {
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
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg
                  id="eyeIcon"
                  style={{ display: showPassword ? 'none' : 'inline' }}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                <svg
                  id="eyeSlashIcon"
                  style={{ display: showPassword ? 'inline' : 'none' }}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm7.59-2.41L19.5 5.59 18.41 4.5 4.5 18.41 5.59 19.5 7.3 17.81c-.67-.44-1.27-.95-1.79-1.51C5.5 14.84 7 12 12 12c1.76 0 3.41.69 4.67 1.88l1.73-1.73zM12 15c-1.66 0-3-1.34-3-3 0-.67.22-1.27.59-1.79l2.21 2.21z"/>
                </svg>
              </button>
            </div>

            {isRegister && (
              <div className="password-requirements">
                <p className={passwordCriteria.length ? 'valid' : 'invalid'}>
                  {passwordCriteria.length ? '✔' : '✖'} Minimum 8 letters
                </p>
                <p className={passwordCriteria.number ? 'valid' : 'invalid'}>
                  {passwordCriteria.number ? '✔' : '✖'} At least one number
                </p>
                <p className={passwordCriteria.specialChar ? 'valid' : 'invalid'}>
                  {passwordCriteria.specialChar ? '✔' : '✖'} At least one special character
                </p>
                <p className={passwordCriteria.upperLower ? 'valid' : 'invalid'}>
                  {passwordCriteria.upperLower ? '✔' : '✖'} At least one uppercase & lowercase letter
                </p>
              </div>
            )}

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
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <svg
                      id="eyeIcon"
                      style={{ display: showConfirmPassword ? 'none' : 'inline' }}
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    <svg
                      id="eyeSlashIcon"
                      style={{ display: showConfirmPassword ? 'inline' : 'none' }}
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm7.59-2.41L19.5 5.59 18.41 4.5 4.5 18.41 5.59 19.5 7.3 17.81c-.67-.44-1.27-.95-1.79-1.51C5.5 14.84 7 12 12 12c1.76 0 3.41.69 4.67 1.88l1.73-1.73zM12 15c-1.66 0-3-1.34-3-3 0-.67.22-1.27.59-1.79l2.21 2.21z"/>
                    </svg>
                  </button>
                </div>
                {warnings.confirmPassword && (
                  <div className="warning">{warnings.confirmPassword}</div>
                )}
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