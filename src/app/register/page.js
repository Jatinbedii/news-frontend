"use client";
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation'; 
import { Fredericka_the_Great } from "next/font/google";

const fredericka = Fredericka_the_Great({ subsets: ["latin"], weight: ['400'] });
export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const router = useRouter(); 

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/register', {
        email,
        password,
        name,
      });

      if (response.status === 201) {
        router.push('/login'); 
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      if (error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-sm">
      <div className="flex justify-center mb-6">
          <h1 className={`text-4xl font-bold text-gray-900 ${fredericka.className}`}>The Turbine</h1>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded-md mb-4">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white px-3 py-2 rounded-md hover:bg-gray-700 transition"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-black hover:underline">Login</Link>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <Link href="/" className="text-black hover:underline">Go to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
