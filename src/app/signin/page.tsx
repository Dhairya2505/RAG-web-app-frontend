"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { IoIosEye, IoIosEyeOff } from "react-icons/io";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation.js";
import axios from "axios";
import { LoaderCircle } from "lucide-react";

export default function SignIn() {
    
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const onSignIn = async () => {
    setLoading(true);
    try {

      const response = await axios.post(
        `/api/signin`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response)
      if (response.data.status == 401 || response.data.status == 500) {
        setError(response.data.msg);
        setLoading(false);
      } 
       else {
        setLoading(false);
        router.push("/mainapp");
      }
      
    } catch (error) {
      setLoading(false);
      setError("*Something went wrong");

    }

  };

  

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <Card className="w-[350px] border border-gray-400 shadow-md shadow-black">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label
                  htmlFor="username"
                  className="select-none cursor-pointer"
                >
                  Username/Email
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username/Email"
                  className="border border-gray-400"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label
                  htmlFor="password"
                  className="select-none cursor-pointer"
                >
                  Password
                </Label>
                <div className="flex justify-center items-center">
                  <Input
                    type={showPassword ? `text` : `password`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    placeholder="Password"
                    className="border border-gray-400"
                  />
                  <div
                    className="border border-gray-400 p-2 rounded-lg cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <IoIosEye className="size-6" />
                    ) : (
                      <IoIosEyeOff className="size-6" />
                    )}
                  </div>
                </div>
              </div>
              <div className="text-red-500 font-semibold">{error}</div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={onSignIn} >{ loading ? <LoaderCircle className="animate-spin" /> :  `Sign In` }</Button>
        </CardFooter>
      </Card>
      <div className="m-2">
        New user?{" "}
        <Link href={`/signup`} className="hover:underline hover:text-blue-900">
          {" "}
          SignUp{" "}
        </Link>
      </div>
    </div>
  );
}