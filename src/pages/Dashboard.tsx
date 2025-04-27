import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import Header from './Header';
import CreatePostForm from './CreatePostForm';
import PostList from './PostList';
import SearchBar from '../components/Search';
import GlobalStyles from './GlobalStyles';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditPostModal from './EditPostModal';
import { useDisclosure } from '@heroui/modal';
import { getPosts, postPost, deletePost as _deletePost, putPost } from '../api/api';
import { addToast } from '@heroui/react';
import Logout from '../components/Logout';

interface Post {
  id: number;
  username: string;
  author_ip?: string;
  title: string;
  content: string;
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

interface PostHeights {
  [key: number]: number;
}

interface VisiblePosts {
  [key: number]: boolean;
}

interface DeletingPosts {
  [key: number]: boolean | string;
}

interface PostRefs {
  [key: number]: HTMLDivElement | null;
}

interface Observers {
  [key: number]: IntersectionObserver;
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

export default function Dashboard(): React.ReactElement {
  const [posts, setPosts] = useState<Post[]>([]);
  const [username, setUsername] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [spacerHeight, setSpacerHeight] = useState<number>(96);
  const [visiblePosts, setVisiblePosts] = useState<VisiblePosts>({});
  const [deletingPosts, setDeletingPosts] = useState<DeletingPosts>({});
  const [postHeights, setPostHeights] = useState<PostHeights>({});
  const [newPostIds, setNewPostIds] = useState<number[]>([]);
  const [deletePost, setDeletePost] = useState<Post | {}>({});
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [fetchPostIsLoading, setFetchPostIsLoading] = useState(true);
  const [postPostIsLoading, setPostPostIsLoading] = useState(false);
  const [putPostIsLoading, setPutPostIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { isOpen: isEditModalOpen, onOpen: openEditModal, onOpenChange: onEditModalChange } = useDisclosure();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  const lenisRef = useRef<Lenis | null>(null);
  const observers = useRef<Observers>({});
  const postRefs = useRef<PostRefs>({});

  useEffect(() => {
    !isOpen && setDeletePost({});
  }, [isOpen]);

  useEffect(() => {
    const fetch = async () => {
      try{
        const res = await getPosts()
        const postsWithFrontendProps = res.results.map((post: Post) => ({
          ...post,
          likes: 0,
          liked: false,
          comments: []
        }));
        setPosts(postsWithFrontendProps);
        
      } catch(e) {
        addToast({
          title: "Error",
          color: 'danger',
          description: "An error occurred",
          hideIcon: true,
        });
      }
    }
    fetch().finally(() => setFetchPostIsLoading(false))

    const lenis = new Lenis({
      autoRaf: true,
    });
    
    lenisRef.current = lenis;

    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    
    const handleScroll = (): void => {
      let scrollTop: number;
      
      if (lenisRef.current) {
        scrollTop = lenisRef.current.scroll;
      } else {
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      }
      
      const isCurrentlyScrolled = scrollTop > 10;
      setIsScrolled(isCurrentlyScrolled);
      
      const maxHeight = 96;
      const minHeight = 48;
      
      if (scrollTop <= 10) {
        setSpacerHeight(maxHeight);
      } else if (scrollTop >= 50) {
        setSpacerHeight(minHeight);
      } else {
        const scrollRange = 40; // 50 - 10
        const heightRange = maxHeight - minHeight;
        const scrollPosition = scrollTop - 10;
        const newHeight = maxHeight - (scrollPosition / scrollRange) * heightRange;
        setSpacerHeight(newHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    lenis.on('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      
      Object.values(observers.current).forEach(observer => {
        if (observer) {
          observer.disconnect();
        }
      });
      
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (newPostIds.length > 0) {
      const timer = setTimeout(() => {
        setNewPostIds([]);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [newPostIds]);

  useEffect(() => {
    // Clean up existing observers first
    Object.values(observers.current).forEach(observer => {
      if (observer) {
        observer.disconnect();
      }
    });
    
    posts?.forEach(post => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setVisiblePosts(prev => ({ ...prev, [post.id]: true }));
              observer.disconnect();
            }
          });
        },
        { 
          threshold: window.innerWidth < 880 ? 0.02 : 0.1, 
          rootMargin: '0px 0px 10px 0px'
        }
      );
      
      observers.current[post.id] = observer;
      
      const element = postRefs.current[post.id];
      if (element) {
        observer.observe(element);
        
        setPostHeights(prev => ({
          ...prev,
          [post.id]: element.getBoundingClientRect().height
        }));
      }
    });
    
    return () => {
      Object.values(observers.current).forEach(observer => {
        if (observer) {
          observer.disconnect();
        }
      });
    };
  }, [posts]);

  useEffect(() => {
    posts?.forEach(post => {
      const element = postRefs.current[post.id];
      const observer = observers.current[post.id];
      
      if (element && observer) {
        observer.observe(element);
      }
    });
  }, [posts, postRefs.current]);

  const handleSubmitPost = async (title: string, content: string) => {
    const newPost: Post = {
      id: Date.now(),
      username: username || 'Anonymous',
      title: title,
      content: content,
      created_datetime: new Date(),
      likes: 0,
      liked: false,
      comments: []
    };

    try{
      setPostPostIsLoading(true)
      const res = await postPost({content, title, username })

      setPosts([newPost, ...posts]);
      setVisiblePosts(prev => ({ ...prev, [newPost.id]: true }));
      setNewPostIds([newPost.id]);

      addToast({
        color:'success',
        title: "Success",
        description: "Post created!",
      });
    } catch(e) {
      addToast({
        color:'danger',
        title: "Error",
        description: "An error occurred",
      })
    }
    finally{
      setPostPostIsLoading(false)
    }
  };

  const openDeleteModal = (id: number): void => {
    setDeletePost(() => {
      return posts.find((e) => e.id === id) || {};
    });
    onOpen();
  };

  const openEditPostModal = (post: Post): void => {
    setEditingPost(post);
    openEditModal();
  };

  const handleDeletePost = (postId: number) => {
    try{
      const postRef = postRefs.current[postId];
      if (postRef) {
        setPostHeights(prev => ({
          ...prev,
          [postId]: postRef.getBoundingClientRect().height
        }));
      }
      
      setDeletingPosts(prev => ({ ...prev, [postId]: true }));
      
      setTimeout(() => {
        setDeletingPosts(prev => ({ 
          ...prev, 
          [postId]: 'collapsing' 
        }));
        
        _deletePost(postId)
        setTimeout(() => {
          setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
          
          setDeletingPosts(prev => {
            const newState = { ...prev };
            delete newState[postId];
            return newState;
          });
        }, 300);
      }, 300);
      addToast({
            color: 'success',
            title: "Success",
            description: "Post deleted!",
          });
    }catch(e){
      addToast({
            color: 'danger',
            title: "Error",
            description: "An error occurred",
          });
    }
  };

  const handleEditPost = async (id: number, title: string, content: string) => {
    try{
      setPutPostIsLoading(true)
      await putPost({id, title, content})
      setPosts(currentPosts => 
        currentPosts.map(post => 
          post.id === id 
            ? { ...post, title, content }
            : post
        )
      );
      setNewPostIds([id]);
      addToast({
        color: 'success',
        title: "Success",
        description: "Post edited!",
      });
    }catch(e){
      addToast({
        color: 'danger',
        title: "Error",
        description: "An error occurred",
      });
    }
    finally{
      setPutPostIsLoading(false)
    }
  };

  const handleLikePost = (postId: number) => {
    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id === postId) {
          const wasLiked = post.liked || false;
          const newLikes = wasLiked ? (post.likes || 1) - 1 : (post.likes || 0) + 1;
          return { ...post, likes: newLikes, liked: !wasLiked };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: number, commentText: string) => {
    const newComment: Comment = {
      id: Date.now(),
      username: username || 'Anonymous',
      content: commentText,
      created_datetime: new Date()
    };

    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id === postId) {
          const updatedComments = [...(post.comments || []), newComment];
          return { ...post, comments: updatedComments };
        }
        return post;
      })
    );
  };

  const getPostAnimationStyle = (postId: number): AnimationStyle => {
    if (deletingPosts[postId]) {
      if (deletingPosts[postId] === 'collapsing') {
        return {
          height: '0px',
          margin: '0px',
          padding: '0px',
          opacity: '0'
        };
      }
      
      return {
        height: `${postHeights[postId]}px`,
        opacity: '0',
        transform: 'scale(0.95)'
      };
    }
    
    if (newPostIds.includes(postId)) {
      return {
        boxShadow: '0 0 0 2px rgba(0, 0, 255, 0.7)',
        animation: 'pulseBorder 3s ease',
      };
    }
    
    return {};
  };

  return (
    <div className="flex flex-col min-h-screen max-w-[800px] mx-auto bg-white">
      <GlobalStyles />
      
      <Header 
        isScrolled={isScrolled} 
      />

      <div 
        className="w-full transition-all duration-300 ease-in-out" 
        style={{ height: `${spacerHeight}px` }}
      />

      <main className="flex-grow w-full max-w-3xl mx-auto p-4">
        <CreatePostForm username={username} onSubmit={handleSubmitPost} postPostIsLoading={postPostIsLoading} />
        
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <PostList 
          posts={posts}
          username={username}
          postRefs={postRefs}
          visiblePosts={visiblePosts}
          onDeletePost={openDeleteModal}
          getPostAnimationStyle={getPostAnimationStyle}
          deletingPosts={deletingPosts}
          onEditPost={openEditPostModal}
          onLikePost={handleLikePost}
          onAddComment={handleAddComment}
          fetchPostIsLoading={fetchPostIsLoading}
          searchQuery={searchQuery}
        />
        <DeleteConfirmationModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onConfirmDelete={() => {
            const postToDelete = deletePost as Post;
            if (postToDelete.id) {
              handleDeletePost(postToDelete.id);
            }
          }}
          itemName={(deletePost as Post).username} 
          itemTitle={(deletePost as Post).title}
        />
        <EditPostModal
          isOpen={isEditModalOpen}
          onOpenChange={onEditModalChange}
          post={editingPost}
          onSave={handleEditPost}
          putPostIsLoading={putPostIsLoading}
        />
        <Logout/>
      </main>
    </div>
  );
}