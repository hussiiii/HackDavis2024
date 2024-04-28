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
        const shifts = await prisma.shift.findMany();
        return res.status(200).json(shifts);

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
