'use client'
import Search from "./Search";
import NavLink from "next/link";
import { Lobster } from "next/font/google";
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut, useSession } from 'next-auth/react'; // <-- import useSession
import { Suspense } from "react";
const lobster = Lobster({
  variable: "--font-lobster",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export function NavigationBar() {
  const { data: session } = useSession(); // <-- get session

  return (
    <nav>
      <ul className="list-none flex items-center">
        <li className={`mx-2 ${lobster.className} text-blue-500`}>PostIt</li>
        <NavLink href="/"><li className="mx-2">Home</li></NavLink>
        <li className="mx-2">Chat</li>
        <li className="mx-2">Shop</li>
        <NavLink href="/notifications" className="mx-2">Notifications</NavLink>
        <li className="mx-2">Settings</li>
      <Suspense fallback={<div>Loading search...</div>}>
          <Search placeholder="Find Users"/>
        </Suspense>
        {/* Display username if logged in */}
        {session?.user?.name && (
          <li className="mx-2 font-semibold text-gray-700">
            {session.user.name}
          </li>
        )}
        <button onClick={() => signOut({ callbackUrl: "/" })}>
          <LogoutIcon className="mx-2 text-red-500 hover:text-red-700 transition-colors" />
        </button>
      </ul>
    </nav>
  );
}