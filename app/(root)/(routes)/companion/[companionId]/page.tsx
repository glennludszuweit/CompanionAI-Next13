import { auth, redirectToSignIn } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
import CompanionForm from '@/components/CompanionForm';

interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
}

export default async function CompanionIdPage({
  params,
}: CompanionIdPageProps) {
  const { userId } = auth();
  if (!userId) return redirectToSignIn();

  const companion = await prismadb.companion?.findUnique({
    where: {
      creatorId: userId,
      id: params.companionId,
    },
  });

  const categories = await prismadb.category.findMany();

  return <CompanionForm initialData={companion} categories={categories} />;
}
