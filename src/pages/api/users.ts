import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  switch (req.method) {
    case 'POST':
      try {
        // Create a new user
        const { username, email, phone, availability } = req.body;

        // Create user and availability dates
        const user = await prisma.user.create({
          data: {
            username,
            email,
            phone,
            availabilities: {
              create: availability.map((date: string) => ({ date: new Date(date) })),
            },
          },
        });

        return res.status(201).json(user);
      } catch (error: any) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Failed to create user', details: error.message });
      }

    case 'GET':
      try {
        // Get all users
        const users = await prisma.user.findMany({
          include: {
            availabilities: true,
          },
        });
        return res.status(200).json(users);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: 'Failed to fetch users', details: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}