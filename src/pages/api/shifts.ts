import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  switch (req.method) {
    case 'POST':
      // Create a new shift
      const { week, date } = req.body;
      const shift = await prisma.shift.create({
        data: {
          week,
          date
        },
      });
      return res.status(200).json(shift);

    // case 'GET':
    //   // Get all users
    //   const users = await prisma.user.findMany();
    //   return res.status(200).json(users);

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
