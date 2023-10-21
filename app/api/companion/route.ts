import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { name, description, instructions, seed, imageUrl, categoryId } =
      body.values;

    if (!user || !user.firstName || !user.id) {
      return new NextResponse('Unauthorized.', { status: 401 });
    }

    if (
      !name ||
      !description ||
      !instructions ||
      !seed ||
      !imageUrl ||
      !categoryId
    ) {
      return new NextResponse('Missing required field/s', { status: 400 });
    }

    const companion = await prismadb.companion.create({
      data: {
        creatorId: user.id,
        creatorName: user.firstName,
        imageUrl,
        name,
        description,
        instructions,
        seed,
        categoryId,
      },
    });

    return NextResponse.json(companion, { status: 201 });
  } catch (error) {
    console.error('[COMPANION_POST]:', error);
    return new NextResponse('Internal server error.', { status: 500 });
  }
};
