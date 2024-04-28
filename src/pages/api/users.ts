// pages/api/users.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  switch (req.method) {
    case 'POST':
      // Create a new user
      const { username, email, phone } = req.body;
      const user = await prisma.user.create({
        data: {
          username,
          email,
          phone
        },
      });
      return res.status(200).json(user);

    case 'GET':
      // Get all users
      const users = await prisma.user.findMany();
      return res.status(200).json(users);

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
