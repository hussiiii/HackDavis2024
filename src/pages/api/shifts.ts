import { PrismaClient } from '@prisma/client';
import Client from 'android-sms-gateway';
import { formatInTimeZone } from 'date-fns-tz';

const prisma = new PrismaClient();
const PST_TIMEZONE = 'America/Los_Angeles';

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
  switch (req.method) {
    case 'POST':
      // Create a new shift
      // const { week, date } = req.body;
      // const shift = await prisma.shift.create({
      //   data: {
      //     week,
      //     date
      //   },
      // });
      // return res.status(200).json(shift);

    case 'GET':
      const shifts = await prisma.shift.findMany({
        include: {
          UserShifts: {
            include: {
              User: true 
            }
          }
        }
      });
      return res.status(200).json(shifts);

    case 'PUT':
      try {
        const { shift_id, user_id } = req.body;
        // Ensure both shift_id and user_id are provided
        if (!shift_id || !user_id) {
          return res.status(400).json({ message: "Missing shift_id or user_id" });
        }
    
        // Create a new UserShift entry
        const newAssignment = await prisma.userShift.create({
          data: {
            shift_id: parseInt(shift_id, 10),
            user_id: parseInt(user_id, 10)
          },
          include: {
            User: true 
          }
        });

        // Log user and shift details
        console.log('User assigned to shift:', newAssignment);

        // Send SMS notification
        const user = newAssignment.User;
        const shift = await prisma.shift.findUnique({
          where: { shift_id: parseInt(shift_id, 10) }
        });

        if (shift && user.phone) {
          const formattedShiftDate = formatInTimeZone(new Date(shift.date), PST_TIMEZONE, 'MM-dd-yyyy');
          const message = `AggieHouse: Hello ${user.username}, you have been scheduled for a shift on ${formattedShiftDate}.`;
          
          // Log the message details
          console.log('Sending SMS to:', user.phone, 'Message:', message);

          const smsResponse = await apiClient.send({
            phoneNumbers: [user.phone],
            message
          });

          // Log the response from the SMS API
          console.log('SMS API response:', smsResponse);
        } else {
          console.log('Shift or user phone number not found:', { shift, user });
        }
    
        // Optionally, you might want to return the updated list of all volunteers for the shift
        const updatedShift = await prisma.shift.findUnique({
          where: {
            shift_id: parseInt(shift_id, 10)
          },
          include: {
            UserShifts: {
              include: {
                User: true
              }
            }
          }
        });
    
        return res.status(200).json(updatedShift);
      } catch (error:any) {
        console.error('Failed to add new volunteer:', error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
      }

    case 'DELETE':
      try {
        const { shift_id, user_id } = req.body;
        if (!shift_id || !user_id) {
          return res.status(400).json({ message: "Missing shift_id or user_id" });
        }
    
        await prisma.userShift.delete({
          where: {
            user_id_shift_id: {
              shift_id: parseInt(shift_id, 10),
              user_id: parseInt(user_id, 10)
            }
          }
        });
    
        return res.status(200).json({ message: "Volunteer removed from shift" });
      } catch (error:any) {
        console.error('Failed to remove volunteer:', error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
      }

    default:
      res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}