import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { date, requester, requesterPhone, reason, shift_id } = req.body;

  try {
    const swap = await prisma.swaps.create({
      data: {
        date: new Date(date),
        requester,
        requesterPhone,
        reason,
        shift_id: parseInt(shift_id, 10),
      },
    });

    return res.status(200).json(swap);
  } catch (error: any) {
    console.error('Error creating swap request:', error);
    return res.status(500).json({ error: 'Failed to create swap request', details: error.message });
  }
}