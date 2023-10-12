import { Category } from '@prisma/client';
import Categories from '@/components/Categories';
import SearchInput from '@/components/SearchInput';
import prismadb from '@/lib/prismadb';

export default async function Home() {
  const categories: Category[] = await prismadb.category.findMany();

  console.log(categories);

  return (
    <div className='h-full p-4 space-y-2'>
      <SearchInput />
      <Categories data={categories} />
    </div>
  );
}
