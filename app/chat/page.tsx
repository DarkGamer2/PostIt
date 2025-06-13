import { NavigationBar } from "../components/NavigationBar";
import { Bebas_Neue } from "next/font/google";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function Page() {
  const users = ["Bob", "Jim"];
  return (
    <div>
      <NavigationBar />
      <h1 className={`${bebasNeue.className} text-2xl text-center mt-4`}>Chats</h1>
      <div className="flex">
        {/* Users Section */}
        <div className="w-1/2 px-4">
          <h1 className="font-semibold text-lg mb-2">Users</h1>
          {users.map((user) => (
            <div key={user} className="mb-2">
              <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-200">
                {user}
              </button>
            </div>
          ))}
        </div>

        {/* Separator Line */}
        <div className="border-l border-gray-300 h-full mx-4"></div>

        {/* Messages Section */}
        <div className="w-1/2 px-4">
          <h1 className="font-semibold text-lg mb-2">Messages</h1>
          <p className="text-gray-500">Select a user to view their messages</p>
        </div>
      </div>
    </div>
  );
}
