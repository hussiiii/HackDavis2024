import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const { method } = req;
  const { email } = req.query;

  if (method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  const { username, phone, availability } = req.body;

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user information
    await prisma.user.update({
      where: { email },
      data: { username, phone },
    });


    // Since the availability is another table, we need to delete the existing ones and create new ones
    // Delete existing availabilities
    await prisma.userAvailability.deleteMany({
      where: { user_id: user.user_id },
    });

    // Create new availabilities
    await prisma.user.update({
      where: { email },
      data: {
        availabilities: {
          create: availability.map((date: string) => ({ date: new Date(date) })),
        },
      },
    });

    // Fetch the updated user with availabilities
    const updatedUser = await prisma.user.findUnique({
      where: { email },
      include: { availabilities: true },
    });

    return res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
}