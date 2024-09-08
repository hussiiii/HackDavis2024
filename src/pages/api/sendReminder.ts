import axios from 'axios';

const BASE_URL = 'https://api.textbee.dev/api/v1';
const API_KEY = "5218660c-17f3-4f11-a656-87ec63221d0b";
const DEVICE_ID = "669725cb3d552f16138d22e1";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  // Function to send the test SMS
  const sendTestMessage = async () => {
    const phone = '+14158123737';
    const message = 'mmmmmmmmmm';
    try {
      await axios.post(`${BASE_URL}/gateway/devices/${DEVICE_ID}/sendSMS`, {
        recipients: [phone],  // Send as an array
        message,
      }, {
        headers: {
          'x-api-key': API_KEY,  // Include the API key in the headers
        },
      });
      console.log(`Test message sent to ${phone}`);
    } catch (error) {
      console.error(`Failed to send test message to ${phone}:`, error);
    }
  };

  try {
    // Send the test message
    await sendTestMessage();
    res.status(200).json({ message: 'Test message sent successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to send test message', error: error.message });
  }
}
