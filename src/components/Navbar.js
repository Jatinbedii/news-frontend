"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaPencilAlt, FaUserAlt } from "react-icons/fa";
import { RiLoginBoxFill } from "react-icons/ri";
import { MdAdminPanelSettings } from "react-icons/md";
import { Fredericka_the_Great } from "next/font/google";

const fredericka = Fredericka_the_Great({ subsets: ["latin"], weight: ['400'] });

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem("newsappName");
    const email = localStorage.getItem("newsappEmail");
    const adminStatus = localStorage.getItem("newsappAdmin") === "true";

    if (name && email) {
      setIsLoggedIn(true);
      setIsAdmin(adminStatus);
    }

    // Get today's date and day
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(today.toLocaleDateString('en-US', options));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("newsappName");
    localStorage.removeItem("newsappEmail");
    localStorage.removeItem("newsappAdmin");
    setIsLoggedIn(false);
    setIsAdmin(false);
    router.push("/login");
  };

  return (
    <nav className="bg-gray-900">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center py-4">
        <div className="bg-black text-white px-4 py-2 rounded-md flex justify-center items-center w-full sm:w-auto">
          <span className={`text-xl sm:text-2xl md:text-3xl ${fredericka.className}`}>{currentDate}</span>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-4">
          {isLoggedIn ? (
            <div className="flex space-x-4">
              <Link
                href="/create-post"
                className="bg-gray-800 text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-700 transition ease-in-out duration-200"
                aria-label="Create Post"
              >
                <FaPencilAlt className="text-lg" />
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="bg-gray-800 text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-700 transition ease-in-out duration-200"
                  aria-label="Admin Panel"
                >
                  <MdAdminPanelSettings className="text-lg" />
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-red-500 transition ease-in-out duration-200"
                aria-label="Logout"
              >
                <RiLoginBoxFill className="text-lg" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-gray-800 text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-700 transition ease-in-out duration-200"
              aria-label="Login"
            >
              <FaUserAlt className="text-lg" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
