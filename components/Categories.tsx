'use client';

import { cn } from '@/lib/utils';
import { Category } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import queryString from 'query-string';

interface CategoriesProps {
  data: Category[];
}

const Categories = ({ data }: CategoriesProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');

  const onClick = (id: string | undefined) => {
    const query = { categoryId: id };

    const url = queryString.stringifyUrl(
      {
        url: window.location.href,
        query: query,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <div className='flex w-full overflow-x-auto space-x-2 p-1'>
      <button
        className={cn(
          'flex items-center text-center text-xs md:text-sm px-2 py-2 md:px-4 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition',
          !categoryId && 'bg-primary/25'
        )}
        onClick={() => onClick(undefined)}
      >
        Newest
      </button>
      {data.map((category: Category) => (
        <button
          key={category.id}
          className={cn(
            'flex items-center text-center text-xs md:text-sm px-2 py-2 md:px-4 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition',
            category.id === categoryId && 'bg-primary/25'
          )}
          onClick={() => onClick(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default Categories;
