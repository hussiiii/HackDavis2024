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
    const user = await prisma.user.update({
      where: { email },
      data: { username, phone, availability },
    });

    return res.status(200).json(user);
  } catch (error: any) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
}