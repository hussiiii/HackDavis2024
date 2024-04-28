import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
        } catch (error) {
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
          } catch (error) {
            console.error('Failed to remove volunteer:', error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
          }

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
