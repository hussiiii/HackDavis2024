import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  const availableUsers = await prisma.user.findMany({
    where: {
      availabilities: {
        some: {
          date: new Date(date as string),
        },
      },
    },
  });

  res.status(200).json(availableUsers);
}