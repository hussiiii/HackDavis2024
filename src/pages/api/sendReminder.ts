import { PrismaClient } from '@prisma/client';
import { formatInTimeZone } from 'date-fns-tz';
import Client from 'android-sms-gateway';

const prisma = new PrismaClient();

const PST_TIMEZONE = 'America/Los_Angeles';  // Timezone for formatting

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Example of an HTTP client based on fetch
const httpFetchClient = {
    get: async (url:any, headers:any) => {
        const response = await fetch(url, {
            method: "GET",
            headers
        });

        return response.json();
    },
    post: async (url:any, body:any, headers:any) => {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        });

        return response.json();
    },
    delete: async (url:any, headers:any) => {
        const response = await fetch(url, {
            method: "DELETE",
            headers
        });

        return response.json();
    }
};

// Initialize the client with your API credentials
const apiClient = new Client('ENMXTB', 'aynr5jzflgne8x', httpFetchClient);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const sendReminder = async (phone: string, message: string) => {
    try {
      const response = await apiClient.send({
        phoneNumbers: [phone],
        message
      });
      console.log(`Reminder sent to ${phone}:`, JSON.stringify(response, null, 2));
    } catch (error: any) {
      console.error(`Failed to send reminder to ${phone}:`, error.message);
    }
  };

  const checkAndSendReminders = async () => {
    const now = new Date();  // Current time in UTC
    const tomorrowPST = new Date(now.toLocaleString('en-US', { timeZone: PST_TIMEZONE }));
    tomorrowPST.setDate(tomorrowPST.getDate() + 1);
    tomorrowPST.setHours(0, 0, 0, 0);  // Set the time to midnight PST

    // Convert start and end of tomorrow in PST to UTC for querying the database
    const tomorrowStartUTC = new Date(tomorrowPST.toISOString());
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
          await delay(3000);  // Increase delay to 3 seconds between each SMS send operation
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