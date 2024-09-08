// This endpoint will be hit every day at 12:00AM (using cron-job.org)

import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const BASE_URL = 'https://api.textbee.dev/api/v1';
const API_KEY = "5218660c-17f3-4f11-a656-87ec63221d0b";
const DEVICE_ID = "669725cb3d552f16138d22e1";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const sendReminder = async (phone: string, message: string) => {
    try {
      await axios.post(`${BASE_URL}/gateway/devices/${DEVICE_ID}/sendSMS`, {
        recipients: [phone],
        message,
      }, {
        headers: {
          'x-api-key': API_KEY,
        },
      });
      console.log(`Reminder sent to ${phone}`);
    } catch (error:any) {
      console.error(`Failed to send reminder to ${phone}:`, error.message);
    }
  };

  const checkAndSendReminders = async () => {
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);  // Set to tomorrow
    tomorrow.setUTCHours(0, 0, 0, 0);  // Start of the day (UTC)
    
    const nextDay = new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);  // End of the day (UTC)

    const shifts = await prisma.shift.findMany({
      where: {
        date: {
          gte: tomorrow,
          lt: nextDay,
        },
      },
      include: {
        UserShifts: {
          include: {
            User: true,
          },
        },
      },
    });

    for (const shift of shifts) {
      for (const userShift of shift.UserShifts) {
        const user = userShift.User;
        if (user.phone) {
          // Construct message with shift details
          const message = `Reminder: You have a shift scheduled for ${new Date(shift.date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })} at 7:30PM - 8:00PM.`;  // Adjust if shift times vary
          
          await sendReminder(user.phone, message);
        } else {
          console.log(`User ${user.username} does not have a phone number.`);
        }
      }
    }
  };

  try {
    await checkAndSendReminders();
    res.status(200).json({ message: 'Reminders sent successfully' });
  } catch (error: any) {
    console.error('Failed to send reminders:', error.message);
    res.status(500).json({ message: 'Failed to send reminders', error: error.message });
  }
}
