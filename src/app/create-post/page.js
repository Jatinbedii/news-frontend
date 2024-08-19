"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Fredericka_the_Great } from "next/font/google";

const fredericka = Fredericka_the_Great({ subsets: ["latin"], weight: ['400'] });

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('newsappEmail')) {
      router.push('/');
    }
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(e.target.files[0]);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !image) {
      setError('All fields are required');
      return;
    }
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "jatinbedi");

    try {
      const imguploaded = await axios.post(
        "https://api.cloudinary.com/v1_1/dspdbzvq9/image/upload",
        data
      );

      axios.post('http://localhost:4000/api/createpost', {
        title,
        content,
        imageLink: imguploaded.data.url,
        createdBy: localStorage.getItem("newsappEmail")
      }).then(() => {
        router.push('/');
      }).catch(() => {
        setError('Post not created');
      });

    } catch (error) {
      return setError('Image not uploaded');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-center mb-6">
          <h1 className={`text-4xl font-bold text-gray-900 ${fredericka.className}`}>The Turbine</h1>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create New Post</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded-md mb-4">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Post Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter your post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Post Content
            </label>
            <textarea
              id="content"
              placeholder="Write your post content here"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm h-40"
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Upload Cover Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            />
          </div>
          {imagePreview && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2 text-gray-700">Image Preview</h2>
              <img
                src={imagePreview}
                alt="Image Preview"
                className="w-full h-auto rounded-md border border-gray-300"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
          >
            Publish Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
