"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link'; 
import Navbar from "@/components/Navbar";
import { Fredericka_the_Great } from "next/font/google";

const fredericka = Fredericka_the_Great({ subsets: ["latin"], weight: ['400'] });

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/getallposts')
      .then(response => {
        const approvedPosts = response.data.filter(post => post.isApproved);
        setPosts(approvedPosts);
      })
      .catch(error => {
        console.error("There was an error fetching the posts!", error);
      });
  }, []);

  const truncateContent = (content, wordLimit) => {
    const words = content.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return content;
  };

  return (
    <main className="bg-gray-100 min-h-screen p-6">
      <Navbar />
      <h1
        className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-center text-gray-900 ${fredericka.className} pt-4 pb-6 border-b-4 border-gray-400`}
      >
        THE TURBINE
      </h1>

      <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <Link key={post._id} href={`/post/${post._id}`}>
            <div
              className={`bg-white shadow-lg rounded-lg p-8 transition transform hover:-translate-y-1 hover:shadow-xl cursor-pointer ${index === 0 ? "col-span-2 sm:col-span-2 lg:col-span-3" : ""}`}
            >
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">{post.title}</h2>
              {post.imageLink && (
                <img src={post.imageLink} alt={post.title} className="w-full h-56 object-cover rounded mb-6" />
              )}
              <p className="text-gray-700">
                {truncateContent(post.content, 20)} 
              </p>
              <p className="text-sm text-gray-500 mt-6">Created by: {post.createdBy}</p>
              <p className="text-sm text-gray-500">Date: {new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
