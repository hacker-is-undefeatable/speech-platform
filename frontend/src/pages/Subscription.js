// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { loadStripe } from '@stripe/stripe-js';
// import { supabase } from './supabaseClient';
// import './Home.css';

// // Initialize Stripe with your publishable key
// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// function Subscription({ isAuthenticated, setIsAuthenticated }) {
//   const [credits, setCredits] = useState(10); // Default to 10 credits
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   // Handle credit input change
//   const handleCreditsChange = (e) => {
//     const value = parseInt(e.target.value, 10);
//     if (value >= 1) {
//       setCredits(value);
//     } else {
//       setCredits(1); // Minimum 1 credit
//     }
//   };

//   // Handle purchase button click
//   const handlePurchase = async () => {
//     if (!isAuthenticated) {
//       setError('Please log in to purchase credits.');
//       navigate('/login');
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     try {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) {
//         throw new Error('User not authenticated');
//       }

//       // Create a Stripe Checkout session
//       const response = await fetch('http://localhost:5000/create-checkout-session', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${session.access_token}`,
//         },
//         body: JSON.stringify({
//           credits,
//           userId: session.user.id,
//         }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to create checkout session');
//       }

//       const stripe = await stripePromise;
//       const { error: stripeError } = await stripe.redirectToCheckout({
//         sessionId: data.sessionId,
//       });

//       if (stripeError) {
//         throw new Error(stripeError.message);
//       }
//     } catch (err) {
//       console.error('Error initiating checkout:', err);
//       setError('Error initiating checkout: ' + err.message);
//       if (err.message.includes('authenticated')) {
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//         navigate('/login');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="home-container">
//       <h1>Purchase Credits</h1>
//       <p>Select the number of credits you want to purchase and proceed to payment.</p>
//       <div style={{ maxWidth: '400px', margin: '0 auto' }}>
//         <div style={{ marginBottom: '20px' }}>
//           <label htmlFor="credits" style={{ display: 'block', marginBottom: '5px' }}>
//             Number of Credits
//           </label>
//           <input
//             type="number"
//             id="credits"
//             value={credits}
//             onChange={handleCreditsChange}
//             min="1"
//             style={{ width: '100%', padding: '8px', fontSize: '16px' }}
//           />
//         </div>
//         <p>Price: ${(credits * 0.10).toFixed(2)} (10 cents per credit)</p>
//         <button
//           onClick={handlePurchase}
//           disabled={isLoading || !isAuthenticated}
//           style={{
//             padding: '10px 20px',
//             fontSize: '16px',
//             backgroundColor: isLoading ? '#ccc' : '#28a745',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: isLoading ? 'not-allowed' : 'pointer',
//           }}
//         >
//           {isLoading ? 'Processing...' : 'Buy Credits'}
//         </button>
//         {error && (
//           <p style={{ color: 'red', marginTop: '10px' }}>
//             {error}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Subscription;

import React from 'react';
import './Home.css';

function Subscription({ isAuthenticated, setIsAuthenticated }) {
  return (
    <div className="home-container">
    </div>
  );
}

export default Subscription;