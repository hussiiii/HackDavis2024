import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req:any, res:any) {
  if (req.method === 'POST') {
    const { userId, shiftId } = req.body;

    try {
      // Assign user to shift in your database
      const assignment = await prisma.userShift.create({
        data: {
          user_id: userId,
          shift_id: shiftId,
        },
      });

      // Fetch shift details to get the date
      const shift = await prisma.shift.findUnique({
        where: {
          shift_id: shiftId,
        },
      });

      // Schedule the SMS reminder
      await scheduleSMSReminder(shift?.date, userId, shiftId);

      res.status(200).json({ success: true, message: 'User assigned and reminder scheduled', assignment });
    } catch (error) {
      console.error('Error assigning shift or scheduling reminder:', error);
      res.status(500).json({ error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}

async function scheduleSMSReminder(shiftDate:any, userId:any, shiftId:any) {
    const reminderDate = new Date(shiftDate);
    reminderDate.setDate(reminderDate.getDate() - 7);  // One week before the shift date
    const month = reminderDate.getUTCMonth() + 1;  // JavaScript months are zero-indexed
    const day = reminderDate.getUTCDate();
    const hour = reminderDate.getUTCHours();  // Assuming reminder time is the same as shift hour
    const minute = reminderDate.getUTCMinutes();

    const cronExpression = `${minute} ${hour} ${day} ${month} *`; // This is the corrected cron expression

    const url = `https://www.easycron.com/rest/add?token=${process.env.EASYCRON_API_KEY}&cron_expression=${encodeURIComponent(cronExpression)}&url=https://localhost:3000/api/send-sms&http_method=POST&post_data={"shiftId":"${shiftId}","userId":"${userId}"}&timezone_from_browser=UTC`;

    const response = await fetch(url);
    const data = await response.json();

    console.log("Cron job setup response:", data);  // Log the response to see more details

    if (!response.ok) {
      throw new Error(`Failed to schedule reminder: ${data.error.message}`);
    }

    return data;
  }
