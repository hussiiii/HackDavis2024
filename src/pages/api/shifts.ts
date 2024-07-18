import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const BASE_URL = 'https://api.textbee.dev/api/v1';
const API_KEY = "5218660c-17f3-4f11-a656-87ec63221d0b";
const DEVICE_ID = "669725cb3d552f16138d22e1";

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
              User: true // Include user details in the response
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
            User: true // Include user details in the response
          }
        });

        // Send SMS notification
        const user = newAssignment.User;
        const shift = await prisma.shift.findUnique({
          where: { shift_id: parseInt(shift_id, 10) }
        });

        if (shift && user.phone) {
          await axios.post(`${BASE_URL}/gateway/devices/${DEVICE_ID}/sendSMS`, {
            recipients: [user.phone],
            message: `AggieHouse: Hello ${user.username}, you have been scheduled for a shift on ${new Date(shift.date).toLocaleDateString()}.`
          }, {
            headers: {
              'x-api-key': API_KEY,
            },
          });
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