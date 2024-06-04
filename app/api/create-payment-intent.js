
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items) => {
  return 400; // This function is not necessary for subscriptions
};

export default async function handler(req, res) {
  const { items, customerEmail } = req.body;

  // Create a customer
  const customer = await stripe.customers.create({
    email: customerEmail,
  });

  // Assuming you have a predefined price ID for your subscription plan
  const priceId = 'price_1PNc6ADZteG0WmTiznMgUlTQ'; // Replace with your actual price ID

  // Create a subscription
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [
      { price: priceId },
    ],
    payment_behavior: 'default_incomplete', // To handle failed payments more gracefully
    expand: ['latest_invoice.payment_intent'],
  });

  res.send({
    clientSecret: subscription.latest_invoice.payment_intent.client_secret,
  });
}
