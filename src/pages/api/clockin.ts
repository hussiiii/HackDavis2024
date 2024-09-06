import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { date, volunteer, covolunteer, onTime, comments } = req.body;

  try {
    const clockIn = await prisma.clockIn.create({
      data: {
        date,
        volunteer,
        covolunteer,
        onTime,
        comments,
      },
    });

    return res.status(200).json(clockIn);
  } catch (error: any) {
    console.error('Error creating clock-in record:', error);
    return res.status(500).json({ error: 'Failed to create clock-in record', details: error.message });
  }
}