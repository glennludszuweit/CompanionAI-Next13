import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export const PATCH = async (
  req: Request,
  { params }: { params: { companionId: string } }
) => {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { name, description, instructions, seed, imageUrl, categoryId } =
      body.values;

    if (!params.companionId) {
      return new NextResponse('Companion ID is required.', { status: 400 });
    }

    if (!user || !user.id || !user.firstName) {
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

    const companion = await prismadb.companion.update({
      where: {
        id: params.companionId,
      },
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
    console.error('[COMPANION_PATCH]:', error);
    return new NextResponse('Internal server error.', { status: 500 });
  }
};
