import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { date, volunteer, rating, comments, tasksCompleted, items, reachOut } = req.body;

  try {
    const clockOut = await prisma.clockOut.create({
      data: {
        date,
        volunteer,
        rating,
        comments,
        tasksCompleted,
        items,
        reachOut,
      },
    });

    return res.status(200).json(clockOut);
  } catch (error: any) {
    console.error('Error creating clock-out record:', error);
    return res.status(500).json({ error: 'Failed to create clock-out record', details: error.message });
  }
}