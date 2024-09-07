import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { swap_id, new_user_id } = req.body;

  try {
    // Find the swap request
    const swap = await prisma.swaps.findUnique({
      where: { swap_id: parseInt(swap_id, 10) },
      include: { Shift: true }
    });

    if (!swap) {
      return res.status(404).json({ error: 'Swap request not found' });
    }

    // Remove the original volunteer from the shift
    await prisma.userShift.deleteMany({
      where: { shift_id: swap.shift_id }
    });

    // Add the new volunteer to the shift
    await prisma.userShift.create({
      data: {
        shift_id: swap.shift_id,
        user_id: parseInt(new_user_id, 10)
      }
    });

    // Remove the swap request from the Swaps table
    await prisma.swaps.delete({
      where: { swap_id: parseInt(swap_id, 10) }
    });

    return res.status(200).json({ message: 'Shift swap accepted successfully' });
  } catch (error: any) {
    console.error('Error accepting swap request:', error);
    return res.status(500).json({ error: 'Failed to accept swap request', details: error.message });
  }
}