const express = require('express');
const app = express();
const port = 5001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend Server Running');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: 'YOUR_OPENAI_API_KEY',
});

const openai = new OpenAIApi(configuration);

app.post('/modify-resume', async (req, res) => {
  const { resumeText, jobDescription } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Adjust the following resume to make it fit the job description:\n\nResume: ${resumeText}\n\nJob Description: ${jobDescription}`,
      max_tokens: 500,
    });

    res.json({ modifiedResume: response.data.choices[0].text });
  } catch (error) {
    res.status(500).json({ error: 'Error processing your resume.' });
  }
});
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');

app.post('/create-subscription', async (req, res) => {
  const { email, paymentMethodId, plan } = req.body;

  try {
    const customer = await stripe.customers.create({
      email: email,
      payment_method: paymentMethodId,
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: plan }],
      expand: ['latest_invoice.payment_intent'],
    });

    res.json({ subscriptionId: subscription.id });
  } catch (error) {
    res.status(500).json({ error: 'Subscription creation failed.' });
  }
});