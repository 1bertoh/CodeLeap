import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { PenBox, Trash2Icon, Heart, MessageCircle, SendIcon } from 'lucide-react';

interface Post {
  id: number;
  username: string;
  title: string;
  content: string;
  author_ip?: string;
  created_datetime: Date;
  likes?: number;
  liked?: boolean;
  comments?: Comment[];
}

interface Comment {
  id: number;
  username: string;
  content: string;
  created_datetime: Date;
}

interface AnimationStyle {
  height?: string;
  margin?: string;
  padding?: string;
  opacity?: string;
  transform?: string;
  boxShadow?: string;
  animation?: string;
}

interface PostItemProps {
  post: Post;
  username: string;
  isVisible: boolean;
  onDelete: () => void;
  animationStyle: AnimationStyle;
  isDeleting: boolean;
  onEditPost: (post: Post) => void;
  onLikePost: (id: number) => void;
  onAddComment: (postId: number, comment: string) => void;
}

const PostItem = forwardRef<HTMLDivElement, PostItemProps>(({ 
  post, 
  username, 
  isVisible, 
  onDelete, 
  animationStyle,
  isDeleting,
  onEditPost,
  onLikePost,
  onAddComment
}, ref) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [likeAnimation, setLikeAnimation] = useState(false);
  const heartRef = useRef<SVGSVGElement>(null);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(post.id, newComment);
      setNewComment('');
    }
  };

  const handleLike = () => {
    setLikeAnimation(true);
    onLikePost(post.id);
  };

  useEffect(() => {
    if (likeAnimation) {
      const timer = setTimeout(() => {
        setLikeAnimation(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [likeAnimation]);

  return (
    <div
      ref={ref}
      className={`bg-default-blue rounded-lg overflow-hidden transition-all duration-500 ease-out ${
        isDeleting 
          ? '' 
          : isVisible 
              ? 'translate-x-0 opacity-100' 
              : '-translate-x-full opacity-0'
      }`}
      style={{
        border: '1px solid rgba(153, 153, 153, 1)',
        ...animationStyle,
        transition: 'all 0.5s ease-out, height 0.3s ease-in-out, margin 0.3s ease, opacity 0.5s ease-out, transform 0.5s ease-out'
      }}
    >
      <div className="bg-default-blue text-white p-4 flex justify-between items-center">
        <h3 className="font-bold">{post.title}</h3>
        <div className="flex space-x-2">
          {post.username === username && (
            <>
              <button 
                className="text-white cursor-pointer"
                onClick={onDelete}
              >
                <Trash2Icon className='hover:text-red-700' />
              </button>
              <button
                className="text-white cursor-pointer"
                onClick={() => onEditPost(post)}
                >
                <PenBox className='hover:text-blue-300' />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white p-4">
        <div
          className="flex justify-between text-sm mb-2"
          style={{ color: 'rgba(119, 119, 119, 1)' }}
        >
          <span className='font-bold text-lg'>@{post.username}</span>
          <span>{formatDistanceToNow(post.created_datetime)} ago</span>
        </div>
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        
        <div className="flex items-center mt-4 pt-2 border-t border-gray-200">
          <button 
            className={`flex items-center mr-4 ${post.liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 relative`}
            onClick={handleLike}
            aria-label={post.liked ? "Unlike post" : "Like post"}
          >
            <Heart 
              ref={heartRef}
              className={`h-5 w-5 mr-1 transition-all duration-300 
                ${post.liked ? 'fill-current' : ''} 
                ${likeAnimation ? 'animate-heartBeat' : ''}`}
              style={{
                transformOrigin: 'center',
                ...(likeAnimation && {
                  animation: post.liked 
                    ? 'heartBeat 0.6s ease-in-out' 
                    : 'heartPop 0.6s ease-in-out'
                })
              }}
            />
            {likeAnimation && post.liked && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="animate-ping absolute h-6 w-6 rounded-full bg-red-400 opacity-75"></span>
                <span className="animate-burst-1 absolute h-1 w-1 bg-red-500 rounded-full"></span>
                <span className="animate-burst-2 absolute h-1 w-1 bg-red-500 rounded-full"></span>
                <span className="animate-burst-3 absolute h-1 w-1 bg-red-500 rounded-full"></span>
                <span className="animate-burst-4 absolute h-1 w-1 bg-red-500 rounded-full"></span>
                <span className="animate-burst-5 absolute h-1 w-1 bg-red-500 rounded-full"></span>
                <span className="animate-burst-6 absolute h-1 w-1 bg-red-500 rounded-full"></span>
                <span className="animate-burst-7 absolute h-1 w-1 bg-red-500 rounded-full"></span>
                <span className="animate-burst-8 absolute h-1 w-1 bg-red-500 rounded-full"></span>
              </span>
            )}
            <span className={`transition-all duration-300 ${likeAnimation ? 'scale-125' : ''}`}>
              {post.likes || 0}
            </span>
          </button>
          <button 
            className="flex items-center text-gray-500 hover:text-blue-500"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-5 w-5 mr-1" />
            <span>{post.comments?.length || 0}</span>
          </button>
        </div>
        
        {showComments && (
          <div className="mt-4 pt-2 border-t border-gray-200">
            <h4 className="font-medium text-gray-700 mb-2">Comments</h4>
            
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-2 mb-3">
                {post.comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 p-2 rounded">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span className="font-semibold">@{comment.username}</span>
                      <span>{formatDistanceToNow(comment.created_datetime)} ago</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-3">No comments yet</p>
            )}
            
            <form onSubmit={handleSubmitComment} className="flex">
              <input
                type="text"
                className="flex-grow border border-gray-300 rounded-l px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-default-blue text-white px-3 py-1 rounded-r hover:bg-blue-700 focus:outline-none"
              >
                <SendIcon className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
});

export default PostItem;