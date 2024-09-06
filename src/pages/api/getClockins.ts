import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const clockIns = await prisma.clockIn.findMany();
    return res.status(200).json(clockIns);
  } catch (error: any) {
    console.error('Error fetching clock-ins:', error);
    return res.status(500).json({ error: 'Failed to fetch clock-ins', details: error.message });
  }
}