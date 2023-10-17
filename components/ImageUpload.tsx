'use client';

import { useEffect, useState } from 'react';
import { CldUploadButton } from 'next-cloudinary';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (src: string) => void;
  disabled: boolean;
}

const ImageUpload = ({ value, onChange, disabled }: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className='flex flex-col justify-center items-center space-y-4 w-full'>
      <CldUploadButton
        onUpload={(res: any) => onChange(res.info.secure_url)}
        options={{
          maxFiles: 1,
        }}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      >
        <div className='flex flex-col items-center justify-center space-y-2 p-4 border-4 border-dashed border-primary/10 rounded-lg transition hover:opacity-75'>
          <div className='relative w-40 h-40'>
            <Image
              src={value || '/upload-image.svg'}
              alt='Upload'
              className='rounded-lg object-cover'
              fill
            />
          </div>
        </div>
      </CldUploadButton>
    </div>
  );
};

export default ImageUpload;
