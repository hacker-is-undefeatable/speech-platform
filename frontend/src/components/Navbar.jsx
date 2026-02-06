import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../pages/supabaseClient';
import './Navbar.css';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [credits, setCredits] = useState(0);
  const [walletBalance, setWalletBalance] = useState('0');
  const [walletAddress, setWalletAddress] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    platform: false,
    solutions: false,
    api: false,
    resources: false,
    pricing: false,
    sensorIntegartion: false, 
  });

  const [showNavbar, setShowNavbar] = useState(true);

  // ... (keeping fetchWalletBalance and useEffects)

  // ... 
  const fetchWalletBalance = async (address) => {
    if (window.ethereum && address) {
      try {
        const balanceHex = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        });
        const balanceWei = BigInt(balanceHex);
        const balanceEth = Number(balanceWei) / 1e18;
        setWalletBalance(balanceEth.toFixed(4));
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  // Listen for account/chain changes in Navbar to keep balance/address updated
  useEffect(() => {
    if (window.ethereum) {
        const handleAccountsChanged = (accounts) => {
            if (accounts.length > 0) {
                setWalletAddress(accounts[0].toLowerCase());
                localStorage.setItem('walletAddress', accounts[0].toLowerCase());
                fetchWalletBalance(accounts[0]);
            } else {
                setWalletAddress('');
                localStorage.removeItem('walletAddress');
            }
        };
        const handleChainChanged = () => {
             // Reload is recommended for chain change, or re-fetch balance
             window.location.reload(); 
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
        };
    }
  }, []);

  // Persistence: Check localStorage on mount
  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      if (window.ethereum) {
         window.ethereum.request({ method: 'eth_accounts' })
          .then(accounts => {
             if (accounts.length > 0 && accounts[0].toLowerCase() === storedAddress.toLowerCase()) {
                 setWalletAddress(storedAddress);
                 fetchWalletBalance(storedAddress);
             } else {
                 localStorage.removeItem('walletAddress');
                 setWalletAddress('');
             }
          });
      }
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        
        const message = "Welcome to SonoCanto! Please sign this message to verify your wallet ownership.";
        await window.ethereum.request({
          method: 'personal_sign',
          params: [message, account],
        });

        setWalletAddress(account);
        localStorage.setItem('walletAddress', account); 
        fetchWalletBalance(account);
      } catch (error) {
        console.error("Error connecting/signing with MetaMask", error);
        setWalletAddress(''); 
        localStorage.removeItem('walletAddress');
      }
    } else {
      alert("MetaMask not detected. Please install it.");
    }
  };

  const handleWalletClick = () => {
      if (walletAddress) {
          navigate('/app/wallet');
      } else {
          connectWallet();
      }
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchCredits = async () => {
      if (isAuthenticated) {
        try {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          if (sessionError || !sessionData.session) {
            if (isMounted) setCredits(0);
            return;
          }
          const userId = sessionData.session.user.id;
          const { data, error } = await supabase
            .from('user_profiles')
            .select('credits')
            .eq('id', userId)
            .single();

          if (isMounted) {
            if (error) {
              setCredits(0);
            } else {
              setCredits(data.credits || 0);
            }
          }
        } catch (error) {
          if (isMounted) setCredits(0);
        }
      } else if (isMounted) {
        setCredits(0);
      }
    };

    fetchCredits();
    return () => { isMounted = false; };
  }, [isAuthenticated]); 

  const handleLogin = () => navigate('/login');
  const handleSignUp = () => navigate('/login?mode=register');
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setCredits(0);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const handleCreditsClick = () => { if (isAuthenticated) navigate('/app/subscription'); };
  
  // Explicit open/close to prevent flickering and handle submenus better
  const openMenu = (menu) => setIsDropdownOpen(prev => ({ ...prev, [menu]: true }));
  const closeMenu = (menu) => setIsDropdownOpen(prev => ({ ...prev, [menu]: false }));

  return (
    <nav className={`navbar ${isAuthenticated ? 'navbar-app' : 'navbar-top'} ${showNavbar ? 'nav-visible' : 'nav-hidden'}`}>
      {isAuthenticated ? (
        /* Top app bar for logged-in users (formerly sidebar) */
        <div className="navbar-app-container">
          <div className="nav-section-left">
            <NavLink to="/" className="logo-link">
              <span className="nav-text-logo">Home</span>
            </NavLink>
          </div>

          <div className="nav-section-center">
            <NavLink to="/app/transcribe" className={({ isActive }) => (isActive ? 'nav-pill active' : 'nav-pill')}>
              <span className="nav-text">Transcribe</span>
            </NavLink>

            <NavLink to="/app/files" className={({ isActive }) => (isActive ? 'nav-pill active' : 'nav-pill')}>
              <span className="nav-text">History</span>
            </NavLink>

            <NavLink to="/app/help" className={({ isActive }) => (isActive ? 'nav-pill active' : 'nav-pill')}>
              <span className="nav-text">Support</span>
            </NavLink>

            <NavLink to="/app/settings" className={({ isActive }) => (isActive ? 'nav-pill active' : 'nav-pill')}>
              <span className="nav-text">Settings</span>
            </NavLink>
          </div>

          <div className="nav-section-right">
            {!walletAddress ? (
              <button className="nav-pill" onClick={connectWallet} style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}>
                Connect Wallet
              </button>
            ) : (
              <div className="credits-pill" onClick={() => navigate('/app/wallet')} role="button" tabIndex={0}>
                <img src="/images/coin.png" alt="Credits" className="coin-sm" />
                <span className="credits-text">{walletBalance} ETH</span>
              </div>
            )}
            <button className="logout-pill" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      ) : (
        /* Top navbar for public / unauthenticated users (kept mostly as your existing layout) */
        <div className="navbar-container">
          <div className="navbar-logo">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active logo-text' : 'logo-text')}>
              Home
            </NavLink>
          </div>
          <div className="navbar-content">
            <div className="navbar-links">
              <div
                className="dropdown"
                onMouseEnter={() => openMenu('solutions')}
                onMouseLeave={() => closeMenu('solutions')}
              >
                <button className="dropdown-trigger">Solutions <img src="/images/image.png" className="dropdown-icon" alt="" /></button>
                {isDropdownOpen.solutions && (
                  <div className="dropdown-content">
                    <div 
                        className="dropdown-item submenu-trigger"
                        onMouseEnter={() => openMenu('sensor')}
                        onMouseLeave={() => closeMenu('sensor')}
                    >
                        <NavLink to="/solutions/sensor" style={{textDecoration: 'none', color: 'inherit'}}>Sensor Integration</NavLink>
                        <span className="arrow-right">&gt;</span>
                        
                        {isDropdownOpen.sensor && (
                            <div className="dropdown-submenu">
                                <NavLink to="/solutions/sensor/core" className="dropdown-item">Core Promise</NavLink>
                                <NavLink to="/solutions/sensor/problem" className="dropdown-item">Problem Statement</NavLink>
                                <NavLink to="/solutions/sensor/hk-context" className="dropdown-item">HK Context</NavLink>
                                <NavLink to="/solutions/sensor/market" className="dropdown-item">Market Opportunity</NavLink>
                                <NavLink to="/solutions/sensor/drivers" className="dropdown-item">Key Drivers</NavLink>
                                <NavLink to="/solutions/sensor/challenges" className="dropdown-item">Challenges</NavLink>
                                <NavLink to="/solutions/sensor/features" className="dropdown-item">Key Features</NavLink>
                                <NavLink to="/solutions/sensor/competitors" className="dropdown-item">Competitor Analysis</NavLink>
                                <NavLink to="/solutions/sensor/differentiators" className="dropdown-item">Differentiators</NavLink>
                                <NavLink to="/solutions/sensor/manufacturers" className="dropdown-item">Manufacturers</NavLink>
                                <NavLink to="/solutions/sensor/partnerships" className="dropdown-item">Partnerships</NavLink>
                                <NavLink to="/solutions/sensor/roadmap" className="dropdown-item">Roadmap</NavLink>
                                <NavLink to="/solutions/sensor/monetization" className="dropdown-item">Monetization</NavLink>
                                <NavLink to="/solutions/sensor/next-steps" className="dropdown-item">Next Steps</NavLink>
                            </div>
                        )}
                    </div>
                    <NavLink to="/solutions/api" className="dropdown-item">API</NavLink>
                    <NavLink to="/solutions/combined-biometrics" className="dropdown-item">Biometrics & Sensor</NavLink>
                    <NavLink to="/solutions/glasses" className="dropdown-item">Smart Glasses</NavLink>
                    
                  </div>
                )}
              </div>

              <div
                className="dropdown"
                onMouseEnter={() => openMenu('api')}
                onMouseLeave={() => closeMenu('api')}
              >
                <button className="dropdown-trigger">API <img src="/images/image.png" className="dropdown-icon" alt="" /></button>
                {isDropdownOpen.api && (
                  <div className="dropdown-content">
                    <NavLink to="/docs" className={({ isActive }) => (isActive ? 'active' : '')}>API Docs (TBD)</NavLink>
                    <NavLink to="/getting-started" className={({ isActive }) => (isActive ? 'active' : '')}>Getting Started (TBD)</NavLink>
                  </div>
                )}
              </div>

              <div
                className="dropdown"
                onMouseEnter={() => openMenu('resources')}
                onMouseLeave={() => closeMenu('resources')}
              >
                <button className="dropdown-trigger">Resources <img src="/images/image.png" className="dropdown-icon" alt="" /></button>
                {isDropdownOpen.resources && (
                  <div className="dropdown-content">
                    <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>About Us</NavLink>
                    <NavLink to="/resources/guides" className={({ isActive }) => (isActive ? 'active' : '')}>Guides</NavLink>
                  </div>
                )}
              </div>
              <div
                className="dropdown"
                onMouseEnter={() => openMenu('pricing')}
                onMouseLeave={() => closeMenu('pricing')}
              >
                <button className="dropdown-trigger">Pricing <img src="/images/image.png" className="dropdown-icon" alt="" /></button>
                {isDropdownOpen.pricing && (
                  <div className="dropdown-content">
                    <NavLink to="/pricing" className={({ isActive }) => (isActive ? 'active' : '')}>Compare Plans</NavLink>
                    <NavLink to="/getting-started" className={({ isActive }) => (isActive ? 'active' : '')}>Enterprise</NavLink>
                    <NavLink to="/getting-started" className={({ isActive }) => (isActive ? 'active' : '')}>Scale</NavLink>
                  </div>
                )}
              </div>
            </div>

            <div className="navbar-actions">
              <div className="navbar-right-actions">
                <button className="signup-button" onClick={handleSignUp}>Sign Up</button>
                <button className="login-button" onClick={handleLogin}>Login</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
