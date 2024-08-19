"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Fredericka_the_Great } from 'next/font/google';

const fredericka = Fredericka_the_Great({ subsets: ['latin'], weight: ['400'] });

export default function Page() {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem('newsappAdmin') === 'true';
    if (!isAdmin) {
      router.push('/');
      return;
    }

    axios.get('http://localhost:4000/api/getallposts')
      .then(response => {
        const unapprovedPosts = response.data.filter(post => !post.isApproved);
        setPosts(unapprovedPosts);
      })
      .catch(error => {
        console.error("There was an error fetching the posts!", error);
      });
  }, [router]);

  const handleApprove = async (postId) => {
    try {
      const res = await axios.patch(`http://localhost:4000/api/approvepost/${postId}`);
      if (res.status === 200) {
        setPosts(posts.filter(post => post._id !== postId));
      } else {
        console.log('Unexpected Error');
      }
    } catch (error) {
      console.error("There was an error approving the post!", error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:4000/api/deletepost/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("There was an error deleting the post!", error);
    }
  };

  return (
    <main className="flex flex-col items-center p-6 min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/" className="text-gray-800 hover:text-gray-900 font-medium text-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Go to Home
          </Link>
          <h1 className={`text-4xl font-bold text-gray-900 text-center ${fredericka.className}`}>Admin Panel</h1>
        </div>

        {posts.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600 text-lg">No posts to review</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post._id} className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h2>
                {post.imageLink && (
                  <img src={post.imageLink} alt={post.title} className="w-full h-48 object-cover rounded mb-4" />
                )}
                <p className="text-gray-600 mb-4">
                  {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
                </p>
                <p className="text-sm text-gray-400 mb-4">Created by: {post.createdBy}</p>
                <p className="text-sm text-gray-400 mb-4">Date: {new Date(post.createdAt).toLocaleDateString()}</p>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => handleApprove(post._id)} 
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleDelete(post._id)} 
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
