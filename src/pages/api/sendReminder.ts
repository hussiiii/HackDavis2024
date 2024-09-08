import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';

const prisma = new PrismaClient();
const BASE_URL = 'https://api.textbee.dev/api/v1';
const API_KEY = "5218660c-17f3-4f11-a656-87ec63221d0b";
const DEVICE_ID = "669725cb3d552f16138d22e1";

const PST_TIMEZONE = 'America/Los_Angeles';  // Timezone for formatting

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
    } catch (error: any) {
      console.error(`Failed to send reminder to ${phone}:`, error.message);
    }
  };

  const checkAndSendReminders = async () => {
    const now = new Date();  // Current time in UTC
    const tomorrowPST = new Date();  // We'll use this to track tomorrow's PST start
    tomorrowPST.setDate(now.getDate() + 1);
    tomorrowPST.setHours(0, 0, 0, 0);  // Set the time to midnight PST

    // Convert start and end of tomorrow in PST to UTC for querying the database
    const tomorrowStartUTC = new Date(tomorrowPST.getTime() - tomorrowPST.getTimezoneOffset() * 60000);
    const tomorrowEndUTC = new Date(tomorrowStartUTC.getTime() + 24 * 60 * 60 * 1000);

    const shifts = await prisma.shift.findMany({
      where: {
        date: {
          gte: tomorrowStartUTC,  // Start of tomorrow in UTC
          lt: tomorrowEndUTC,     // End of tomorrow in UTC
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
          // Format the shift date in PST using formatInTimeZone
          const formattedShiftDate = formatInTimeZone(new Date(shift.date), PST_TIMEZONE, 'yyyy-MM-dd HH:mm:ss zzz');
          
          const message = `Reminder: You have a shift scheduled for ${formattedShiftDate} at 7:30PM - 8:00PM.`;  // Adjust if shift times vary
          
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
