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

      case 'DELETE':
        try {
          const { user_id } = req.query;

          // Delete user by user_id
          const deletedUser = await prisma.user.delete({
            where: {
              user_id: Number(user_id),
            },
          });

          return res.status(200).json({ message: 'User deleted successfully', deletedUser });
        } catch (error: any) {
          console.error('Error deleting user:', error);
          return res.status(500).json({ error: 'Failed to delete user', details: error.message });
        }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}