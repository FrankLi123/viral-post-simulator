'use client';

import { useState } from 'react';
import { Image as ImageIcon, Smile, Calendar, MapPin, User } from 'lucide-react';

interface PostComposerProps {
  onPost: (content: string) => void;
}

export default function PostComposer({ onPost }: PostComposerProps) {
  const [content, setContent] = useState('');
  const maxLength = 280;

  const handlePost = () => {
    if (content.trim()) {
      onPost(content);
      setContent('');
    }
  };

  const remainingChars = maxLength - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="border-b border-[#2f3336] p-4">
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User size={24} />
        </div>
        
        {/* Composer */}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?!"
            className="w-full bg-transparent text-xl placeholder-[#71767b] resize-none border-none outline-none text-white"
            rows={3}
          />
          
          {/* Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <button className="text-[#1d9bf0] hover:bg-[#1d9bf0]/10 p-2 rounded-full transition-colors">
                <ImageIcon size={20} />
              </button>
              <button className="text-[#1d9bf0] hover:bg-[#1d9bf0]/10 p-2 rounded-full transition-colors">
                <Smile size={20} />
              </button>
              <button className="text-[#1d9bf0] hover:bg-[#1d9bf0]/10 p-2 rounded-full transition-colors">
                <Calendar size={20} />
              </button>
              <button className="text-[#1d9bf0] hover:bg-[#1d9bf0]/10 p-2 rounded-full transition-colors">
                <MapPin size={20} />
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Character count */}
              <div className="flex items-center space-x-2">
                <div className="relative w-6 h-6">
                  <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#2f3336"
                      strokeWidth="2"
                      fill="transparent"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke={isOverLimit ? "#f4212e" : remainingChars <= 20 ? "#ffd400" : "#1d9bf0"}
                      strokeWidth="2"
                      fill="transparent"
                      strokeDasharray={`${Math.min(1, (maxLength - remainingChars) / maxLength) * 62.83} 62.83`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                {remainingChars <= 20 && (
                  <span className={`text-sm ${isOverLimit ? 'text-[#f4212e]' : 'text-[#ffd400]'}`}>
                    {remainingChars}
                  </span>
                )}
              </div>
              
              {/* Post button */}
              <button
                onClick={handlePost}
                disabled={!content.trim() || isOverLimit}
                className={`px-6 py-1.5 rounded-full font-bold transition-colors ${
                  !content.trim() || isOverLimit
                    ? 'bg-[#1d9bf0]/50 text-white/50 cursor-not-allowed'
                    : 'bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white'
                }`}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 