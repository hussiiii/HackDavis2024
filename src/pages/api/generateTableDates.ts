// Listen up! This script is triggered in the /dates page, when the button is pressed 
// what it does is, it will update the dates in the Shift table. So when AggieHouse wants to 
  // go to the next quarter or whatever, and the dates change, this script changes them!

  // if it glitches, you need to like re-copy/paste the fetchShifts function for some reason 

import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

async function updateShifts(startDate: Date) {
  for (let i = 0; i < 4; i++) {
    const weekStartDate = new Date(startDate);
    weekStartDate.setDate(startDate.getDate() + i * 7);

    for (let j = 0; j < 7; j++) {
      const shiftDate = new Date(weekStartDate);
      shiftDate.setDate(weekStartDate.getDate() + j);

      // Find the shift for the specific week and day
      const shift = await prisma.shift.findFirst({
        where: { week: i + 1 },
        orderBy: { shift_id: 'asc' }, // Ensure consistent ordering
        skip: j,
      });

      if (shift) {
        await prisma.shift.update({
          where: { shift_id: shift.shift_id },
          data: { date: shiftDate },
        });
      }
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { startDate } = req.body;
    if (!startDate) {
      return res.status(400).json({ error: 'Start date is required' });
    }

    try {
      await updateShifts(new Date(startDate));
      res.status(200).json({ message: 'Shifts updated successfully' });
    } catch (error) {
      console.error('Error updating shifts:', error);
      res.status(500).json({ error: 'Error updating shifts' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}