"use client";
import { Inter,Lobster,Bebas_Neue } from "next/font/google";
import {motion} from "framer-motion";
import {toast} from "react-toastify";
import {signIn} from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
const inter = Inter({ subsets: ["latin"] });
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const lobster = Lobster({
  variable: "--font-lobster",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function Login(){

const [email, setEmail] = useState<string>("");
const [password, setPassword] = useState<string>("");

const navigation = useRouter();
const handleLogin=async(e:React.FormEvent)=>{
   e.preventDefault();
const res=await signIn("credentials", {
    redirect: false,
    email,
    password,
  });

  if (res?.error) {
    toast.error("Login failed. Please check your credentials.");
  } else {
    toast.success("Login successful!");
    // Redirect to home or dashboard
   navigation.push("/home");
  }
 

}
    return (
        <div>
            <h1 className={`${lobster.className} text-blue-500 text-center text-4xl`}>PostIt</h1>
            <h3 className={`text-center ${inter.className} text-xl`}>Login</h3>
            <form onSubmit={handleLogin}>
                <div className="flex flex-col items-center">
                    <input
                        type="text"
                        placeholder="Email"
                        className={`border-2 border-gray-300 rounded-lg p-2 m-2 ${inter.className}`} onChange={(e) => setEmail(e.target.value)} value={email}
                    /> 
                    <input
                        type="password"
                        placeholder="Password"
                        className={`border-2 border-gray-300 rounded-lg p-2 m-2 ${inter.className}`} onChange={(e) => setPassword(e.target.value)} value={password} 
                    />
                    <button
                        type="submit"
                        className={`bg-blue-500 text-white rounded-lg p-2 m-2 ${bebasNeue.className}`}
                    >
                        Login
                    </button>
                  
                      <div className="flex">
                         <p className="mx-2">Don't have an account?</p><span>  <Link href="/registration" className={`text-blue-500 ${inter.className}`}>Create One</Link></span>
                      </div>
                       </div>
            </form>
        </div>
    )
}