'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import PostComposer from '@/components/PostComposer';
import Post from '@/components/Post';
import { Sparkles } from 'lucide-react';
import { UserContext } from '@/hooks/useUser';

interface PostData {
  id: string;
  content: string;
  timestamp: Date;
}

interface UserData {
  name: string;
  handle: string;
}

function PostAppContent() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [userData, setUserData] = useState<UserData>({ name: 'You', handle: 'yourhandle' });
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get user data from URL parameters
    const name = searchParams.get('name');
    const handle = searchParams.get('handle');
    
    if (name && handle) {
      setUserData({ name, handle });
    }
  }, [searchParams]);

  const handleNewPost = (content: string) => {
    const newPost: PostData = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <UserContext.Provider value={userData}>
      <Layout>
        {/* Header */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-[#2f3336] z-10">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold">Home</h1>
            <Sparkles size={20} className="text-[#1d9bf0]" />
          </div>
          
          {/* Tab Navigation */}
          <div className="flex">
            <div className="flex-1 text-center py-4 border-b-2 border-[#1d9bf0] font-bold cursor-pointer">
              For you
            </div>
            <div className="flex-1 text-center py-4 text-[#71767b] hover:text-white cursor-pointer transition-colors">
              Following
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        {posts.length === 0 && (
          <div className="p-6 m-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl">
            <h2 className="text-xl font-bold mb-2 text-purple-300">🎭 Welcome to the Viral Post Simulator, {userData.name}!</h2>
            <p className="text-[#71767b] text-sm mb-2">
              This is a parody app for fun! Watch your post &quot;go viral&quot; with fake metrics and comments.
            </p>
            <p className="text-[#71767b] text-xs">
              Not affiliated with X/Twitter. Just pure vibes! ✨
            </p>
          </div>
        )}

        {/* Post Composer */}
        <PostComposer onPost={handleNewPost} />
        
        {/* Posts Feed */}
        <div>
          {posts.map((post) => (
            <Post 
              key={post.id} 
              content={post.content} 
              timestamp={post.timestamp} 
            />
          ))}
          
          {/* Sample posts when empty */}
          {posts.length === 0 && (
            <div className="p-8 text-center text-[#71767b]">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2 text-white">Ready to go viral, {userData.name}?</h3>
              <p className="mb-4">Write something amazing above and watch the magic happen!</p>
              <div className="text-sm">
                Try something like: &quot;I just discovered the perfect way to...&quot; or &quot;Here&apos;s why everyone should...&quot;
              </div>
            </div>
          )}
        </div>
      </Layout>
    </UserContext.Provider>
  );
}

export default function PostApp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostAppContent />
    </Suspense>
  );
} 