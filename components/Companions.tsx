import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Companion } from '@prisma/client';
import { MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CompanionsProps {
  data: (Companion & {
    _count: {
      messages: number;
    };
  })[];
}

const Companions = ({ data }: CompanionsProps) => {
  if (data.length === 0) {
    return (
      <div className='flex flex-col justify-center items-center pt-10 space-y-3'>
        <div className='relative w-60 h-60'>
          <Image src='/empty.png' alt='Empty' className='grayscale' fill />
        </div>
        <p className='text-muted-foreground'>No companions found.</p>
      </div>
    );
  }
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10'>
      {data.map((item) => (
        <Card
          key={item.id}
          className='bg-primary/10 rounded-xl cursor-pointer border-0 hover:opacity-75 transition'
        >
          <Link href={`/chat/${item.id}`}>
            <CardHeader className='flex justify-center items-center text-center text-muted-foreground'>
              <div className='relative w-32 h-32'>
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  className='object-cover rounded-xl'
                  fill
                />
              </div>
              <p className='font-bold text-sm'>{item.name}</p>
              <p className='text-[10px]'>{item.description}</p>
            </CardHeader>
            <CardFooter className='flex items-center justify-between text-xs text-muted-foreground'>
              <p className='lowercase'>@{item.creatorName.replace(' ', '')}</p>
              <div className='flex items-center'>
                <MessageSquare className='w-4 h-4 mr-1' />
                {item._count.messages}
              </div>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default Companions;
