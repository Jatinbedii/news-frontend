"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Fredericka_the_Great } from "next/font/google";
import Link from 'next/link';

const fredericka = Fredericka_the_Great({ subsets: ["latin"], weight: ['400'] });

export default function PostPage({ params }) {
  const id = params.id;
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:4000/api/getpost/${id}`)
        .then(response => {
          setPost(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the post data!", error);
        });

      axios.get('http://localhost:4000/api/getallposts')
        .then(response => {
          const allPosts = response.data;
          const filteredPosts = allPosts
            .filter(post => post._id !== id && post.isApproved)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
          setRecentPosts(filteredPosts);
        })
        .catch(error => {
          console.error("There was an error fetching all posts!", error);
        });
    }
  }, [id]);

  if (!post) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto bg-gray-100">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-black font-medium text-lg">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>

      <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold ${fredericka.className} text-gray-900 text-center mb-12`}>
        THE TURBINE
      </h1>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 text-center mb-6">
        {post.title}
      </h2>

      {post.imageLink && (
        <div className="flex justify-center mb-6">
          <img src={post.imageLink} alt={post.title} className="w-full max-w-2xl h-auto object-cover rounded-lg shadow-md" />
        </div>
      )}
      <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed mb-6">
        {post.content}
      </p>
      <div className="text-sm text-gray-500 mb-6">
        <p>Created by: {post.createdBy}</p>
        <p>Date: {new Date(post.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="mt-12">
        <h3 className={`text-2xl sm:text-3xl font-bold ${fredericka.className} text-gray-900 mb-6`}>
          Recent Posts
        </h3>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((recentPost) => (
            <div key={recentPost._id} className="bg-white shadow-md rounded-lg p-4">
              <Link href={`/post/${recentPost._id}`} className="block mb-4 text-xl font-semibold text-gray-800 hover:text-blue-600">
                {recentPost.title}
              </Link>
              {recentPost.imageLink && (
                <img src={recentPost.imageLink} alt={recentPost.title} className="w-full h-32 object-cover rounded mb-4" />
              )}
              <p className="text-gray-600">
                {recentPost.content.length > 100 ? `${recentPost.content.substring(0, 100)}...` : recentPost.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
