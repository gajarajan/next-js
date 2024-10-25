"use client"
import { registerUser } from '@/app/_ulit/GlobalApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoaderIcon } from 'lucide-react';
import Image from 'next/image'; // Correct Image import for Next.js
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function CreateAccount() {
  // State variables to store input values
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader,setloader]=useState();
  const router=useRouter();
  useEffect(()=>{
    if(sessionStorage.getItem('jwt')){
      router.push("/")
    }
  },[])
  const onCreateAccount = (e) => {
    setloader(true);
    e.preventDefault(); // Prevent default form submission behavior
    registerUser(username,email,password)
      .then(res => {
       
        sessionStorage.setItem('user',JSON.stringify(res.data.user));
        sessionStorage.setItem('jwt',res.data.jwt);
        router.push('/');
        toast("Account created successfully ")
        setloader(false);
      },(e)=>{
        toast.error(err?.response?.data?.error?.message);
        setloader(false);
      })
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
        <h2 className="font-bold text-2xl mb-2">Create an Account</h2>
        <p className="text-gray-500 mb-5">Enter your email and password to create your account</p>
        <form className="w-full flex flex-col gap-5 mt-7" onSubmit={onCreateAccount}>
          <Input 
            placeholder="Username" 
            aria-label="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update state on input change
          />
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
          <Button className="mt-4" type="submit" disabled={!(username||password||email)}>{loader?<LoaderIcon className='animate-spin'/>:'create a account'}</Button>
          <p className="mt-4">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-500 hover:underline">
              Click here to sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
