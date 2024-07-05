"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { IoIosEye, IoIosEyeOff } from "react-icons/io";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation.js';
import axios from "axios";

export default function SignUp() {
  
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSignUp = async () => {
    setError("");

    if(username == ""){
      setError("*Username is required");
      return;
    }
    else if(email == ""){
      setError("*Email is required");
      return;
    }
    else if (password == "") {
      setError("*Password is required");
      return;
    }
    else if (password !== confirmPassword){
      setError("*Passwords do not match");
      return;
    }

    const response = await axios.post(`/api/signup`,{
        username,
        email,
        password
    })

    if(response.data.status == 409 || response.data.status == 500 ){
        setError(response.data.msg);
        return;
    }
    else{
        router.push('/signin');
    }
    
}

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <Card className="w-[350px] border border-gray-400 shadow-md shadow-black">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription> Register yourself to get started !! </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username" className="select-none cursor-pointer" >Username</Label>
                <Input id="username" value={username} onChange={ (e) => setUsername(e.target.value) } placeholder="Username" className="border border-gray-400" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email" className="select-none cursor-pointer" >Email</Label>
                <Input id="email" value={email} onChange={ (e) => setEmail(e.target.value) } placeholder="Email" className="border border-gray-400" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password" className="select-none cursor-pointer" >Password</Label>
                <div className="flex justify-center items-center">
                  <Input type={showPassword? `text` : `password`} value={password} onChange={ (e) => setPassword(e.target.value) } id="password" placeholder="Password" className="border border-gray-400" />
                  <div className="border border-gray-400 p-2 rounded-lg cursor-pointer" onClick={ () => setShowPassword(!showPassword) }>
                    {showPassword ? <IoIosEye className="size-6" /> : <IoIosEyeOff className="size-6" />}
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmPassword" className="select-none cursor-pointer" >Confirm password</Label>
                <div className="flex justify-center items-center">
                  <Input type={showConfirmPassword? `text` : `password`} value={confirmPassword} onChange={ (e) => setConfirmPassword(e.target.value) } id="confirmPassword" placeholder="Confirm password" className="border border-gray-400" />
                  <div className="border border-gray-400 p-2 rounded-lg cursor-pointer" onClick={ () => setShowConfirmPassword(!showConfirmPassword) }>
                    {showConfirmPassword ? <IoIosEye className="size-6" /> : <IoIosEyeOff className="size-6" />}
                  </div>
                </div>
              </div>
              <div className="text-red-500 font-semibold">{error}</div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={onSignUp} >Sign Up</Button>
        </CardFooter>
      </Card>
      <div className="m-2">
        Already a user? <Link href={`/signin`} className="hover:underline hover:text-blue-900"> SignIn  </Link>
      </div>
    </div>
  );
}