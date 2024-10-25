"use client"
import { signInUser } from '@/app/_ulit/GlobalApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoaderIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function SignIn() {
  // State variables to store input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader,setloader]=useState()
  const router = useRouter();
useEffect(()=>{
  if(sessionStorage.getItem('jwt')){
    router.push("/")
  }
},[])
  const onSign = (e) => {
    setloader(true);
    e.preventDefault(); // Prevent default form submission behavior
    signInUser(email, password)
      .then(res => {
       
        sessionStorage.setItem('user', JSON.stringify(res.data.user));
        sessionStorage.setItem('jwt', res.data.jwt);
        router.push('/');
        toast.success('Login successfully');
        setloader(false)
      })
      .catch(err => {
       
        toast.error(err?.response?.data?.error?.message);
        setloader(false)
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="flex flex-col items-center justify-center p-10 bg-white border border-gray-200 rounded-lg shadow-md">
        <Image
          src="/logo.png" // Reference to image in the public folder
          alt="Grocery Logo"
          width={70}
          height={30}
          className="rounded-full shadow-sm mb-4"
        />
        <h2 className="font-bold text-2xl mb-2">Sign In to Your Account</h2>
        <p className="text-gray-500 mb-5">Enter your email and password to sign in</p>
        <form className="w-full flex flex-col gap-5 mt-7" onSubmit={onSign}>
          <Input 
            type="email" 
            placeholder="Email" 
            aria-label="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update state on input change
          />
          <Input 
            type="password" 
            placeholder="Password" 
            aria-label="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update state on input change
          />
          <Button className="mt-4" type="submit" disabled={!(email ||password)}>
            {loader?<LoaderIcon className='animate-spin'/>:'sign in'}
          </Button>
          <p className="mt-4">
            Don't have an account?{' '}
            <Link href="/create-account" className="text-blue-500 hover:underline">
              Click here to create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
