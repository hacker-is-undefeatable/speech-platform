import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './Login.css';

export default function Login({ setIsAuthenticated }) {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [warnings, setWarnings] = useState({});
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    number: false,
    specialChar: false,
    upperLower: false,
  });
  const [notifications, setNotifications] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added isLoading state

  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const newPasswordInputRef = useRef(null);

  // Throttle utility for mouse move events
  const throttle = (fn, wait) => {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= wait) {
        lastCall = now;
        return fn(...args);
      }
    };
  };
  
  // Floating shapes animation
  useEffect(() => {
    const handleMouseMove = throttle((e) => {
      const shapes = document.querySelectorAll('.shape');
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;

      shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.5;
        const x = (mouseX - 0.5) * speed * 20;
        const y = (mouseY - 0.5) * speed * 20;
        shape.style.transform = `translate(${x}px, ${y}px)`;
      });
    }, 16);

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // // Card tilt effect
  // useEffect(() => {
  //   const card = cardRef.current;
  //   if (!card) return;

  //   const handleCardMouseMove = (e) => {
  //     const rect = card.getBoundingClientRect();
  //     const centerX = rect.left + rect.width / 2;
  //     const centerY = rect.top + rect.height / 2;
  //     const mouseX = e.clientX - centerX;
  //     const mouseY = e.clientY - centerY;

  //     const rotateX = (mouseY / rect.height) * -10;
  //     const rotateY = (mouseX / rect.width) * 10;

  //     card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  //   };

  //   const handleCardMouseLeave = () => {
  //     card.style.transform = '';
  //   };

  //   card.addEventListener('mousemove', handleCardMouseMove);
  //   card.addEventListener('mouseleave', handleCardMouseLeave);
  //   return () => {
  //     card.removeEventListener('mousemove', handleCardMouseMove);
  //     card.removeEventListener('mouseleave', handleCardMouseLeave);
  //   };
  // }, []);

  // Sparkle effect on input focus
  const createSparkles = (element) => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          background: #667eea;
          border-radius: 50%;
          pointer-events: none;
          top: ${Math.random() * 100}%;
          left: ${Math.random() * 100}%;
          animation: sparkleFloat 1s ease-out forwards;
          z-index: 10;
        `;
        element.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
      }, i * 100);
    }
  };

  useEffect(() => {
    const inputs = [emailInputRef, passwordInputRef, confirmPasswordInputRef, newPasswordInputRef];
    const handleFocus = (e) => {
      const inputWrapper = e.target.closest('.input-wrapper');
      inputWrapper.classList.add('focused');
      createSparkles(inputWrapper);
    };
    const handleBlur = (e) => {
      const inputWrapper = e.target.closest('.input-wrapper');
      inputWrapper.classList.remove('focused');
    };

    inputs.forEach((ref) => {
      if (ref.current) {
        ref.current.addEventListener('focus', handleFocus);
        ref.current.addEventListener('blur', handleBlur);
      }
    });

    return () => {
      inputs.forEach((ref) => {
        if (ref.current) {
          ref.current.removeEventListener('focus', handleFocus);
          ref.current.removeEventListener('blur', handleBlur);
        }
      });
    };
  }, []);

  // Supabase logic (unchanged)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setIsRegister(true);
    } else if (mode === 'reset') {
      setIsForgotPassword(true);
    }
  }, [location.search]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        if (isForgotPassword && location.search.includes('mode=reset')) {
          handleResetPassword();
        } else if (isForgotPassword) {
          handleForgotPassword();
        } else {
          handleSubmit();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [email, password, confirmPassword, firstName, lastName, isRegister, isForgotPassword, newPassword]);

  useEffect(() => {
    setPasswordCriteria({
      length: password.length >= 8 || newPassword.length >= 8,
      number: /\d/.test(password) || /\d/.test(newPassword),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password) || /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
      upperLower: (/[a-z]/.test(password) && /[A-Z]/.test(password)) || (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)),
    });
  }, [password, newPassword]);

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

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
      failure: 'Operation Failed',
      showPassword: 'Show',
      hidePassword: 'Hide',
      mismatchWarning: 'Passwords do not match.',
      emptyWarning: 'This field is required.',
      invalidEmail: 'Please enter a valid email address.',
      invalidPassword: 'Password must contain uppercase, lowercase, numbers, and symbols',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      backToLogin: 'Back to Login',
      resetPasswordSent: 'Password reset email sent! Please check your inbox.',
      resetPasswordFailed: 'Failed to send reset email. Please try again.',
      emailNotFound: 'No account found with this email address.',
      successMessage: 'Welcome to Your Creative Dimension!',
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
    } else if (isForgotPassword && location.search.includes('mode=reset')) {
      if (!newPassword) newWarnings.newPassword = t.emptyWarning;
      else if (!passwordRegex.test(newPassword)) newWarnings.newPassword = t.invalidPassword;
    } else if (isForgotPassword) {
      if (!email) newWarnings.email = t.emptyWarning;
      else if (!emailRegex.test(email)) newWarnings.email = t.invalidEmail;
    } else {
      if (!email) newWarnings.email = t.emptyWarning;
      else if (!emailRegex.test(email)) newWarnings.email = t.invalidEmail;
      if (!password) newWarnings.password = t.emptyWarning;
    }
    setWarnings(newWarnings);
    if (Object.keys(newWarnings).length > 0) {
      setNotifications([{ type: 'warning', message: 'Please fill in all required fields correctly.' }]);
      if (cardRef.current) {
        cardRef.current.classList.add('error-shake');
        setTimeout(() => cardRef.current?.classList.remove('error-shake'), 500);
      }
    }
    return Object.keys(newWarnings).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    let isMounted = true;
    setIsLoading(true);
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
            emailRedirectTo: `${window.location.origin}/login?mode=reset`,
          },
        });
        if (!isMounted) return;
        if (error) {
          setNotifications([{ type: 'danger', message: `${t.failure}: ${error.message}` }]);
          return;
        }
        if (data.user) {
          const { error: profileError } = await supabase.from('user_profiles').insert({
            id: data.user.id,
            email: email,
            display_name: `${firstName} ${lastName}`.trim(),
            credits: 30,
          });
          if (!isMounted) return;
          if (profileError) {
            setNotifications([{ type: 'danger', message: `${t.failure}: Failed to create profile.` }]);
            return;
          }
          if (data.session) {
            localStorage.setItem('token', data.session.access_token);
            setIsAuthenticated(true);
            setIsSuccess(true);
            setTimeout(() => {
              if (isMounted) navigate('/');
            }, 2000);
          } else {
            setNotifications([{ type: 'success', message: 'Registration successful! Please check your email to confirm your account.' }]);
            navigate('/login');
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!isMounted) return;
        if (error) {
          setNotifications([{ type: 'danger', message: `${t.failure}: ${error.message}` }]);
          return;
        }
        if (data.session) {
          localStorage.setItem('token', data.session.access_token);
          setIsAuthenticated(true);
          setIsSuccess(true);
          setTimeout(() => {
            if (isMounted) navigate('/');
          }, 2000);
        } else {
          setNotifications([{ type: 'danger', message: t.failure }]);
        }
      }
    } catch (error) {
      if (isMounted) {
        console.error('Unexpected error:', error);
        setNotifications([{ type: 'danger', message: `${t.failure}: ${error.message}` }]);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!validateForm()) return;

    let isMounted = true;
    setIsLoading(true);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('email', email)
        .single();
      if (!isMounted) return;
      if (profileError || !profileData) {
        setNotifications([{ type: 'danger', message: t.emailNotFound }]);
        return;
      }
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?mode=reset`,
      });
      if (!isMounted) return;
      if (error) {
        setNotifications([{ type: 'danger', message: `${t.resetPasswordFailed}: ${error.message}` }]);
        return;
      }
      setNotifications([{ type: 'success', message: t.resetPasswordSent }]);
    } catch (error) {
      if (isMounted) {
        setNotifications([{ type: 'danger', message: `${t.resetPasswordFailed}: ${error.message}` }]);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    let isMounted = true;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (!isMounted) return;
      if (error) {
        setNotifications([{ type: 'danger', message: `${t.failure}: ${error.message}` }]);
        return;
      }
      setNotifications([{ type: 'success', message: 'Password updated successfully! Please log in.' }]);
      setIsForgotPassword(false);
      navigate('/login');
    } catch (error) {
      if (isMounted) {
        setNotifications([{ type: 'danger', message: `${t.failure}: ${error.message}` }]);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  const handleSocialLogin = async (platform) => {
    console.log(`Initiating creative login with ${platform}...`);
    const button = document.querySelector(`.social-btn.${platform.toLowerCase()}-btn`);
    button.style.transform = 'scale(0.95)';
    button.style.opacity = '0.7';

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log(`Redirecting to ${platform} for creative authentication...`);
    } catch (error) {
      console.error(`Creative ${platform} authentication failed: ${error.message}`);
      setNotifications([{ type: 'danger', message: `${t.failure}: ${platform} login failed` }]);
    } finally {
      button.style.transform = 'scale(1)';
      button.style.opacity = '1';
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleDismissNotification = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  // Function to generate stars with random color
  const generateStars = () => {
    const starContainer = document.querySelector('.starry-bg');
    if (!starContainer) return;
    starContainer.innerHTML = '';
    const numStars = 80;
    const colors = [
      '#fff',           // white
      '#ffe066',        // yellow
      '#a0e7e5',        // light blue
      '#b4aee8',        // light purple
      '#fbc2eb',        // pink
      '#f7cac9',        // light pink
      '#b5ead7',        // mint
      '#f9f871',        // pale yellow
      '#c1c8e4',        // pale blue
      '#f7d6e0',        // very light pink
    ];
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      star.style.opacity = Math.random() * 0.6 + 0.3;
      // Assign a random color
      star.style.background = colors[Math.floor(Math.random() * colors.length)];
      starContainer.appendChild(star);
    }
  };

  // Add these useEffect hooks after your other useEffects

  // Clear warnings and notifications when switching between login, register, and forgot password
  useEffect(() => {
    setWarnings({});
    setNotifications([]);
    // Optionally clear password fields for better UX
    setPassword('');
    setConfirmPassword('');
    setNewPassword('');
  }, [isRegister, isForgotPassword]);

  // Add stars to the background on mount
  useEffect(() => {
    generateStars();
  }, []);

  return (
    <div className="login-root">
      {/* Starry background */}
      <div className="starry-bg" aria-hidden="true"></div>
      <div className="login-container">
        <div className="creative-bg">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
          </div>
        </div>
        <div className="content-container-login">
          <div className={`login-box ${isLoading ? 'loading-pulse' : ''}`} ref={cardRef}>
            <div className="card-decoration">
              <div className="deco-line line-1"></div>
              <div className="deco-line line-2"></div>
              <div className="deco-line line-3"></div>
            </div>
            <div className="login-content">
              <a href="/" className="back-link" onClick={handleBack}>
                <img src="images/arrow.png" alt="Back" className="back-arrow" />
              </a>
              <div className="login-header">
                {/* <div className="creative-logo">
                  <div className="logo-circle circle-1"></div>
                  <div className="logo-circle circle-2"></div>
                  <div className="logo-circle circle-3"></div>
                </div> */}
                <h2>
                  {isForgotPassword && location.search.includes('mode=reset')
                    ? 'Update Password'
                    : isForgotPassword
                    ? t.resetPassword
                    : isRegister
                    ? t.register
                    : t.login}
                </h2>
              </div>
              {isSuccess ? (
                <div className="success-message show">
                  <div className="success-animation">
                    <div className="success-circle">
                      <span className="success-checkmark">✔</span>
                    </div>
                  </div>
                  <h3>{t.successMessage}</h3>
                  <p>Redirecting to your creative workspace...</p>
                </div>
              ) : (
                <>
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className={`alert alert-${notification.type} d-flex align-items-center`}
                      role="alert"
                      aria-live="polite"
                    >
                      <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label={`${notification.type}:`}>
                        <use
                          xlinkHref={
                            notification.type === 'success'
                              ? '#check-circle-fill'
                              : notification.type === 'info'
                              ? '#info-fill'
                              : '#exclamation-triangle-fill'
                          }
                        />
                      </svg>
                      <div>{notification.message}</div>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => handleDismissNotification(index)}
                        aria-label="Close"
                      >
                        <img src="/images/close-btn.png" alt="Close" />
                      </button>
                    </div>
                  ))}
                  {isForgotPassword && location.search.includes('mode=reset') ? (
                    <>
                      <div className="form-group">
                        <div className="input-wrapper">
                          <input
                            className="input-field"
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            onPaste={handlePaste}
                            ref={newPasswordInputRef}
                          />
                          <div className="input-decoration"></div>
                          <div className="input-waves">
                            <div className="wave wave-1"></div>
                            <div className="wave wave-2"></div>
                            <div className="wave wave-3"></div>
                          </div>
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            <span className={`toggle-icon ${showNewPassword ? 'show-password' : ''}`} aria-hidden="true"></span>
                          </button>
                        </div>
                        {warnings.newPassword && (
                          <div className="error-message show" aria-live="polite">
                            {warnings.newPassword}
                          </div>
                        )}
                      </div>
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
                      <button className="submit-button" onClick={handleResetPassword}>
                        Update Password
                        <div className="btn-bg"></div>
                        <div className="btn-loader">
                          <div className="loader-dot dot-1"></div>
                          <div className="loader-dot dot-2"></div>
                          <div className="loader-dot dot-3"></div>
                        </div>
                      </button>
                      <button className="toggle-button" onClick={() => setIsForgotPassword(false)}>
                        {t.backToLogin}
                      </button>
                    </>
                  ) : isForgotPassword ? (
                    <>
                      <div className="form-group">
                        <div className="input-wrapper">
                          <input
                            className="input-field"
                            placeholder={t.email}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onPaste={handlePaste}
                            ref={emailInputRef}
                          />
                          <div className="input-decoration"></div>
                          <div className="input-waves">
                            <div className="wave wave-1"></div>
                            <div className="wave wave-2"></div>
                            <div className="wave wave-3"></div>
                          </div>
                        </div>
                        {warnings.email && (
                          <div className="error-message show" aria-live="polite">
                            {warnings.email}
                          </div>
                        )}
                      </div>
                      <button className="submit-button" onClick={handleForgotPassword}>
                        {t.resetPassword}
                        <div className="btn-bg"></div>
                        <div className="btn-loader">
                          <div className="loader-dot dot-1"></div>
                          <div className="loader-dot dot-2"></div>
                          <div className="loader-dot dot-3"></div>
                        </div>
                      </button>
                      <button className="toggle-button" onClick={() => setIsForgotPassword(false)}>
                        {t.backToLogin}
                      </button>
                    </>
                  ) : (
                    <>
                      {isRegister && (
                        <>
                          <div className="form-group">
                            <div className="input-wrapper">
                              <input
                                className="input-field"
                                placeholder={t.lastName}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                onPaste={handlePaste}
                              />
                              <div className="input-decoration"></div>
                              <div className="input-waves">
                                <div className="wave wave-1"></div>
                                <div className="wave wave-2"></div>
                                <div className="wave wave-3"></div>
                              </div>
                            </div>
                            {warnings.lastName && (
                              <div className="error-message show" aria-live="polite">
                                {warnings.lastName}
                              </div>
                            )}
                          </div>
                          <div className="form-group">
                            <div className="input-wrapper">
                              <input
                                className="input-field"
                                placeholder={t.firstName}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                onPaste={handlePaste}
                              />
                              <div className="input-decoration"></div>
                              <div className="input-waves">
                                <div className="wave wave-1"></div>
                                <div className="wave wave-2"></div>
                                <div className="wave wave-3"></div>
                              </div>
                            </div>
                            {warnings.firstName && (
                              <div className="error-message show" aria-live="polite">
                                {warnings.firstName}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                      <div className="form-group">
                        <div className="input-wrapper">
                          <input
                            className="input-field"
                            placeholder={t.email}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onPaste={handlePaste}
                            ref={emailInputRef}
                          />
                          <div className="input-decoration"></div>
                          <div className="input-waves">
                            <div className="wave wave-1"></div>
                            <div className="wave wave-2"></div>
                            <div className="wave wave-3"></div>
                          </div>
                        </div>
                        {warnings.email && (
                          <div className="error-message show" aria-live="polite">
                            {warnings.email}
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <div className="input-wrapper">
                          <input
                            className="input-field"
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t.password}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onPaste={handlePaste}
                            ref={passwordInputRef}
                          />
                          <div className="input-decoration"></div>
                          <div className="input-waves">
                            <div className="wave wave-1"></div>
                            <div className="wave wave-2"></div>
                            <div className="wave wave-3"></div>
                          </div>
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <span className={`toggle-icon ${showPassword ? 'show-password' : ''}`} aria-hidden="true"></span>
                          </button>
                        </div>
                        {warnings.password && (
                          <div className="error-message show" aria-live="polite">
                            {warnings.password}
                          </div>
                        )}
                      {!isRegister && (
                        <button
                          className="forgot-button"
                          onClick={() => setIsForgotPassword(true)}
                        >
                          {t.forgotPassword}
                        </button>
                      )}
                      </div>
                      {isRegister && (
                        <>
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
                          <div className="form-group">
                            <div className="input-wrapper">
                              <input
                                className="input-field"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder={t.confirmPassword}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onPaste={handlePaste}
                                ref={confirmPasswordInputRef}
                              />
                              <div className="input-decoration"></div>
                              <div className="input-waves">
                                <div className="wave wave-1"></div>
                                <div className="wave wave-2"></div>
                                <div className="wave wave-3"></div>
                              </div>
                              <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                <span className={`toggle-icon ${showConfirmPassword ? 'show-password' : ''}`} aria-hidden="true"></span>
                              </button>
                            </div>
                            {warnings.confirmPassword && (
                              <div className="error-message show" aria-live="polite">
                                {warnings.confirmPassword}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                      <button className="submit-button" onClick={handleSubmit}>
                        <span className="btn-text">{isRegister ? t.register : t.login}</span>
                        <div className="btn-bg"></div>
                        <div className="btn-loader">
                          <div className="loader-dot dot-1"></div>
                          <div className="loader-dot dot-2"></div>
                          <div className="loader-dot dot-3"></div>
                        </div>
                      </button>
                      <div className="divider">
                        <div className="divider-line"></div>
                        <span>or</span>
                        <div className="divider-line"></div>
                      </div>
                      <div className="creative-social">
                        <button className="social-btn behance-btn" onClick={() => handleSocialLogin('Behance')}>
                          <span className="social-icon behance-icon"></span>
                          Behance
                        </button>
                        <button className="social-btn dribbble-btn" onClick={() => handleSocialLogin('Dribbble')}>
                          <span className="social-icon dribbble-icon"></span>
                          Dribbble
                        </button>
                      </div>
                      <div className="signup-link">
                        <button
                          className="toggle-link"
                          onClick={() => setIsRegister(!isRegister)}
                        >
                          {isRegister ? t.toggleLogin : t.toggleRegister}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}