import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  switch (req.method) {
    case 'POST':
      // Create a new user
      const { username, email, phone, availability } = req.body;
      try {
        const user = await prisma.user.create({
          data: {
            username,
            email,
            phone,
            availability,
          },
        });
        return res.status(200).json(user);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to create user' });
      }

    case 'GET':
      // Get all users
      const users = await prisma.user.findMany();
      return res.status(200).json(users);

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
