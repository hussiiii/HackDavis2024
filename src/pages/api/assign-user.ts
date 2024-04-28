import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { userId, shiftId } = req.body;
    try {
      // Check if assignment already exists
      const existingAssignment = await prisma.userShift.findUnique({
        where: {
          user_id_shift_id: {
            user_id: userId,
            shift_id: shiftId,
          },
        },
      });

      if (existingAssignment) {
        return res.status(409).json({ message: 'User already assigned to this shift' });
      }

      // Create new assignment
      const newAssignment = await prisma.userShift.create({
        data: {
          user_id: userId,
          shift_id: shiftId,
        },
      });

      res.status(200).json({ message: 'User assigned successfully', newAssignment });
    } catch (error) {
      res.status(500).json({ message: "Failed to assign user" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
