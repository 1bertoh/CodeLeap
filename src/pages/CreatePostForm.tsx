// CreatePostForm.jsx
import React, { useState } from 'react';
import { Button } from '@heroui/button';

type props = {
  postPostIsLoading: boolean;
  onSubmit: (title:string, content: string) => void;
  username: string;
}

export default function CreatePostForm(props:props) {
  const { onSubmit, postPostIsLoading, username } = props
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    onSubmit(title, content);
    setTitle('');
    setContent('');
  };

  return (
    <div
      className="bg-white rounded-2xl p-4 mb-6"
      style={{ border: '1px rgba(153, 153, 153, 1) solid' }}
    >
      <h2 className="title mb-4">What's on your mind?</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Hello world"
            className="w-full h-[32px] border border-gray-300 rounded-lg px-3 py-2"
            style={{ border: '1px rgba(119, 119, 119, 1) solid' }}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content here"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-[74px]"
            style={{ border: '1px rgba(119, 119, 119, 1) solid' }}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!title.trim() || !content.trim() || postPostIsLoading}
            isLoading={postPostIsLoading}
            className='bg-default-blue rounded-lg text-white font-bold w-[120px] h-8 cursor-pointer disabled:bg-gray-500 disabled:cursor-default '
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}