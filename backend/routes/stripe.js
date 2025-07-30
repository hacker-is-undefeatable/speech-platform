const express = require('express');
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Create a Stripe Checkout session
router.post('/create-checkout-session', async (req, res) => {
  const { credits, userId } = req.body;

  try {
    // Verify user authentication (optional, depending on your setup)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${credits} Credits`,
              description: `Purchase ${credits} credits for your account`,
            },
            unit_amount: 10 * credits, // 10 cents per credit
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        userId,
        credits: credits.toString(),
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Webhook to handle successful payment and update Supabase
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, credits } = session.metadata;

    try {
      // Update user's credits in Supabase
      const { error } = await supabase
        .from('user_profiles')
        .update({ credits: supabase.raw('credits + ?', [parseInt(credits)]) })
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Failed to update credits: ${error.message}`);
      }

      console.log(`Updated ${credits} credits for user ${userId}`);
    } catch (error) {
      console.error('Error updating credits in Supabase:', error);
      return res.status(500).json({ error: 'Failed to update credits' });
    }
  }

  res.json({ received: true });
});

module.exports = router;