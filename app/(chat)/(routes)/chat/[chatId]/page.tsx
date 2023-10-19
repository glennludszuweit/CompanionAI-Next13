import { auth, redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import ChatClient from '@/components/ChatClient';

interface ChatIdPage {
  params: {
    chatId: string;
  };
}

export default async function ChatIdPage({ params }: ChatIdPage) {
  const { userId } = auth();
  if (!userId) return redirectToSignIn();

  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.chatId,
    },
    include: {
      messages: {
        orderBy: {
          createAt: 'asc',
        },
        where: {
          userId: userId,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });
  if (!companion) return redirect('/');

  return <ChatClient companion={companion} />;
}
