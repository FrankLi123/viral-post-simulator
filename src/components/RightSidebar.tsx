'use client';

import { Search, TrendingUp } from 'lucide-react';

const trendingTopics = [
  { category: 'Trending in Technology', topic: '#ViralPostSim', posts: '42.5K posts' },
  { category: 'Trending', topic: 'Startup Ideas', posts: '15.2K posts' },
  { category: 'Technology · Trending', topic: 'AI Tools', posts: '8,234 posts' },
  { category: 'Entertainment · Trending', topic: 'Viral Content', posts: '23.1K posts' },
];

const whoToFollow = [
  { name: 'ViralPost Creator', handle: '@viralpost', verified: true },
  { name: 'Startup Enthusiast', handle: '@startupfan', verified: false },
  { name: 'Tech News', handle: '@technews', verified: true },
];

export default function RightSidebar() {
  return (
    <div className="p-4 h-full">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search size={20} className="absolute left-4 top-3.5 text-[#71767b]" />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-[#16181c] border border-[#2f3336] rounded-full py-3 pl-12 pr-4 text-white placeholder-[#71767b] focus:outline-none focus:border-[#1d9bf0]"
        />
      </div>
      
      {/* Subscribe Premium */}
      <div className="bg-[#16181c] border border-[#2f3336] rounded-2xl p-4 mb-4">
        <h2 className="text-xl font-bold mb-2">Subscribe to Premium+</h2>
        <p className="text-[#71767b] text-sm mb-3">
          Subscribe to unlock new features and if eligible, receive a share of ads revenue.
        </p>
        <button className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold py-2 px-6 rounded-full transition-colors">
          Subscribe
        </button>
      </div>
      
      {/* What's happening */}
      <div className="bg-[#16181c] border border-[#2f3336] rounded-2xl overflow-hidden mb-4">
        <div className="p-4 border-b border-[#2f3336]">
          <h2 className="text-xl font-bold flex items-center">
            <TrendingUp size={20} className="mr-2" />
            What's happening
          </h2>
        </div>
        {trendingTopics.map((trend, index) => (
          <div key={index} className="p-3 hover:bg-[#1a1a1a] cursor-pointer transition-colors border-b border-[#2f3336] last:border-b-0">
            <div className="text-[#71767b] text-sm">{trend.category}</div>
            <div className="font-bold">{trend.topic}</div>
            <div className="text-[#71767b] text-sm">{trend.posts}</div>
          </div>
        ))}
        <div className="p-3 hover:bg-[#1a1a1a] cursor-pointer transition-colors">
          <div className="text-[#1d9bf0]">Show more</div>
        </div>
      </div>
      
      {/* Who to follow */}
      <div className="bg-[#16181c] border border-[#2f3336] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#2f3336]">
          <h2 className="text-xl font-bold">Who to follow</h2>
        </div>
        {whoToFollow.map((user, index) => (
          <div key={index} className="p-3 hover:bg-[#1a1a1a] cursor-pointer transition-colors border-b border-[#2f3336] last:border-b-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                <div>
                  <div className="flex items-center">
                    <span className="font-bold">{user.name}</span>
                    {user.verified && (
                      <span className="ml-1 text-[#1d9bf0]">✓</span>
                    )}
                  </div>
                  <div className="text-[#71767b] text-sm">{user.handle}</div>
                </div>
              </div>
              <button className="bg-white text-black font-bold py-1.5 px-4 rounded-full text-sm hover:bg-gray-200 transition-colors">
                Follow
              </button>
            </div>
          </div>
        ))}
        <div className="p-3 hover:bg-[#1a1a1a] cursor-pointer transition-colors">
          <div className="text-[#1d9bf0]">Show more</div>
        </div>
      </div>
    </div>
  );
} 