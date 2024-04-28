import twilio from 'twilio';

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { to, message } = req.body; // `to` is the recipient's phone number, `message` is the SMS content
    // Initialize the Twilio client
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    try {
      const response = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to
      });
      return res.status(200).json({ success: true, message: 'SMS sent!', data: response });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to send SMS'});
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}