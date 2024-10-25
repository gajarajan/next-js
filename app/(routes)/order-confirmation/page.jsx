import { Button } from '@/components/ui/button'; // Importing Button component
import { CheckCircle2 } from 'lucide-react'; // Importing icon from lucide-react
import Link from 'next/link'; // Importing Link from Next.js
import React from 'react';

export default function OrderConfirmation() {
  return (
    <div className='flex justify-center my-20'>
      <div className='border shadow-md flex-col gap-3 rounded-md p-20 px-32 items-center flex justify-center'>
        <CheckCircle2 className='h-24 w-24 text-primary' aria-label="Order confirmed icon" />
        <h1 className='text-3xl font-medium text-primary'>Order Confirmed</h1>
        <p>Thank you so much for your order!</p> {/* Corrected spelling and changed to <p> for semantic purposes */}
        <Link href='/my-order'>
          <Button className='mt-8'>Track Your Order</Button> {/* Clarified button text */}
        </Link>
      </div>
    </div>
  );
}
