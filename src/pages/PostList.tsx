import React from 'react';
import PostItem from './PostItem';
import { Spinner } from '@heroui/react';

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

interface PostListProps {
  posts: Post[];
  username: string;
  postRefs: React.MutableRefObject<{ [key: number]: HTMLDivElement | null }>;
  visiblePosts: { [key: number]: boolean };
  onDeletePost: (id: number) => void;
  getPostAnimationStyle: (id: number) => AnimationStyle;
  deletingPosts: { [key: number]: boolean | string };
  onEditPost: (post: Post) => void;
  onLikePost: (id: number) => void;
  onAddComment: (postId: number, comment: string) => void;
  fetchPostIsLoading: boolean;
  searchQuery: string;
}

export default function PostList({
  posts,
  username,
  postRefs,
  visiblePosts,
  onDeletePost,
  getPostAnimationStyle,
  deletingPosts,
  onEditPost,
  onLikePost,
  onAddComment,
  fetchPostIsLoading,
  searchQuery
}: PostListProps): React.ReactElement {
  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(lowerCaseQuery) ||
      post.content.toLowerCase().includes(lowerCaseQuery)
    );
  });

  return (
    <div className="space-y-4 w-full">
      {fetchPostIsLoading ? (
        <Spinner size='lg' className='mx-auto w-full text-center' />
      ) : filteredPosts.length > 0 ? (
        filteredPosts.map(post => (
          <PostItem
            key={post.id}
            post={post}
            username={username}
            ref={(el: HTMLDivElement | null) => {
              postRefs.current[post.id] = el;
            }}
            onEditPost={onEditPost}
            isVisible={visiblePosts[post.id]}
            onDelete={() => onDeletePost(post.id)}
            animationStyle={getPostAnimationStyle(post.id)}
            isDeleting={!!deletingPosts[post.id]}
            onLikePost={onLikePost}
            onAddComment={onAddComment}
          />
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          {searchQuery ? "No posts match your search" : "No posts yet"}
        </div>
      )}
    </div>
  );
}