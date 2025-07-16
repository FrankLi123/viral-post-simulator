'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, MessageCircle, Repeat2, Share, BarChart3, User, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalyticsModal from './AnalyticsModal';
import TweetDetailModal from './TweetDetailModal';
import { useNotifications } from './Layout';
import { useUser } from '@/hooks/useUser';

interface PostProps {
  content: string;
  timestamp: Date;
}

interface Comment {
  id: string;
  author: string;
  handle: string;
  content: string;
  verified?: boolean;
  timestamp: Date;
  likes: number;
  retweets: number;
  replies: number;
  baseLikes: number; // Base likes for growth calculation
  baseRetweets: number; // Base retweets for growth calculation
  baseReplies: number; // Base replies for growth calculation
}

const viralComments: Omit<Comment, 'id' | 'timestamp' | 'likes' | 'retweets' | 'replies'>[] = [
  { author: 'Viral Enthusiast', handle: '@viralking', content: 'This is exactly what I needed! 🔥', verified: true, baseLikes: 47, baseRetweets: 12, baseReplies: 3 },
  { author: 'Tech Startup', handle: '@techstartup', content: 'Mind = blown! How did you think of this?', verified: false, baseLikes: 23, baseRetweets: 8, baseReplies: 1 },
  { author: 'Innovation Hub', handle: '@innovationhub', content: 'This could change everything! 🚀', verified: true, baseLikes: 89, baseRetweets: 34, baseReplies: 7 },
  { author: 'Future Builder', handle: '@futurebuilder', content: 'Already implementing this idea!', verified: false, baseLikes: 15, baseRetweets: 4, baseReplies: 0 },
  { author: 'CEO Daily', handle: '@ceodaily', content: 'Featured this in our newsletter! 📧', verified: true, baseLikes: 156, baseRetweets: 67, baseReplies: 12 },
  { author: 'Trend Spotter', handle: '@trendspotter', content: 'Called it! This is going viral 📈', verified: false, baseLikes: 78, baseRetweets: 29, baseReplies: 5 },
  { author: 'Product Punk', handle: '@producpunk', content: 'This needs to be on Product Hunt! 🚀', verified: true, baseLikes: 234, baseRetweets: 89, baseReplies: 18 },
  { author: 'Unicorn Ventures', handle: '@unicornvc', content: 'Solid execution. Would love to see more.', verified: true, baseLikes: 312, baseRetweets: 124, baseReplies: 23 },
  { author: 'TechCrunch', handle: '@techcrunch', content: 'Covering this in our next article! 📰', verified: true, baseLikes: 445, baseRetweets: 189, baseReplies: 34 },
  { author: 'Tech Visionary', handle: '@techvisionary', content: 'Interesting 🤔', verified: true, baseLikes: 2847, baseRetweets: 1234, baseReplies: 567 },
  { author: 'AI Ventures', handle: '@aiventures', content: 'Love seeing innovative applications! 🤖', verified: true, baseLikes: 1567, baseRetweets: 678, baseReplies: 123 },
  { author: 'Alpha Capital', handle: '@alphacap', content: 'This is the future we\'re investing in.', verified: true, baseLikes: 892, baseRetweets: 445, baseReplies: 78 },
  { author: 'VentureBeat', handle: '@venturebeat', content: 'Breaking: This post just went mega viral! 📊', verified: true, baseLikes: 678, baseRetweets: 267, baseReplies: 45 },
  { author: 'Growth Capital', handle: '@growthcapital', content: 'Impressive growth trajectory 📈', verified: true, baseLikes: 534, baseRetweets: 198, baseReplies: 29 },
  { author: 'Innovation CEO', handle: '@innovationceo', content: 'This is how innovation happens! 💡', verified: true, baseLikes: 743, baseRetweets: 321, baseReplies: 67 },
];

// Simple Animated Number Component with hydration fix
function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (displayValue !== value) {
      setIsAnimating(true);
      setDisplayValue(value);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [value, displayValue, mounted]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (!mounted) return <span className={className}>0</span>;

  return (
    <span className={`${className} ${isAnimating ? 'text-[#1d9bf0]' : ''} transition-colors duration-300`}>
      {formatNumber(displayValue)}
    </span>
  );
}

export default function Post({ content, timestamp }: PostProps) {
  const { setNotificationCount } = useNotifications();
  const userData = useUser();
  
  const [metrics, setMetrics] = useState({
    likes: 0,
    retweets: 0,
    comments: 0,
    views: 0,
  });
  
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotificationStage, setCurrentNotificationStage] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTweetDetail, setShowTweetDetail] = useState(false);
  const [viralStage, setViralStage] = useState(0);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update notification count to reflect total engagement (likes + reposts + comments)
  useEffect(() => {
    if (mounted) {
      const totalEngagement = metrics.likes + metrics.retweets + metrics.comments;
      // Set notification count to total engagement
      setNotificationCount(totalEngagement);
    }
  }, [metrics.likes, metrics.retweets, metrics.comments, mounted, setNotificationCount]);

  // Safe timestamp calculation to prevent hydration issues
  const getTimestamp = () => {
    if (!mounted) return '0s';
    const diffInSeconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  // Function to show notification once and move to next stage
  const showNextNotification = useCallback((stage: number) => {
    if (!mounted) return; // Only check if mounted, remove time limit
    
    setCurrentNotificationStage(stage);
    setShowNotification(true);
    
    // Hide notification after 3 seconds and don't show again
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  }, [mounted]);

  // Function to update comment metrics over time
  const updateCommentMetrics = useCallback(() => {
    if (!mounted) return;
    
    setAllComments(prevComments => 
      prevComments.map(comment => {
        const timeSinceCreation = (Date.now() - comment.timestamp.getTime()) / 1000;
        const growthFactor = Math.min(timeSinceCreation / 300, 1); // Grow over 5 minutes
        const viralMultiplier = 1 + (viralStage * 0.2); // Slight boost during viral stages
        
        // Calculate new values
        const newLikes = Math.floor(comment.baseLikes * growthFactor * viralMultiplier * (0.3 + Math.random() * 0.4));
        const newRetweets = Math.floor(comment.baseRetweets * growthFactor * viralMultiplier * (0.1 + Math.random() * 0.15)); // Reduced to maintain 1:30 ratio
        const newReplies = Math.floor(comment.baseReplies * growthFactor * viralMultiplier * (0.1 + Math.random() * 0.2));
        
        return {
          ...comment,
          // Only increase, never decrease
          likes: Math.max(comment.likes, newLikes),
          retweets: Math.max(comment.retweets, newRetweets),
          replies: Math.max(comment.replies, newReplies),
        };
      })
    );
  }, [viralStage, mounted]);



  // Clear all intervals when limit is reached
  useEffect(() => {
    if (hasReachedLimit) {
      // Show final notification that limit is reached
      setShowNotification(true);
      setCurrentNotificationStage(7);
      
      setTimeout(() => {
        setShowNotification(false);
      }, 5000); // Show for longer since it's the final message
    }
  }, [hasReachedLimit]);

  // Main growth intervals - COMPLETELY ISOLATED
  useEffect(() => {
    if (!mounted) return;

    let currentInterval: NodeJS.Timeout | null = null;
    const timeouts: NodeJS.Timeout[] = [];

    // Clear any existing interval when starting a new one
    const startNewInterval = (intervalFn: () => void, delay: number) => {
      if (currentInterval) {
        clearInterval(currentInterval);
      }
      currentInterval = setInterval(() => {
        if (hasReachedLimit) return; // Stop all growth when limit reached
        intervalFn();
      }, delay);
    };

    // Stage 1: Initial engagement (0-10s) - Slow start
    timeouts.push(setTimeout(() => {
      if (!mounted) return;
      startNewInterval(() => {
        if (!mounted) return;
        setMetrics(prev => {
          return {
            ...prev,
            likes: prev.likes + Math.floor(Math.random() * 5) + 1,
            views: prev.views + Math.floor(Math.random() * 25) + 10,
          };
        });
      }, 800);
    }, 1000));

    // Stage 2: Building momentum (10-30s) - Add retweets
    timeouts.push(setTimeout(() => {
      if (!mounted) return;
      startNewInterval(() => {
        if (!mounted) return;
        setMetrics(prev => {
          const retweetIncrease = Math.random() < 0.3 ? 1 : 0; // Only 30% chance of getting 1 retweet
          const commentIncrease = Math.random() < 0.2 ? 1 : 0; // 20% chance of getting 1 comment
          
          // Create actual comment objects when count increases
          if (commentIncrease > 0) {
            setAllComments(prevComments => {
              const newComments = [];
              for (let i = 0; i < commentIncrease; i++) {
                if (prevComments.length + i < viralComments.length) {
                  const comment: Comment = {
                    ...viralComments[prevComments.length + i],
                    id: (prevComments.length + i + 1).toString(),
                    timestamp: new Date(timestamp.getTime() + (prevComments.length + i + 1) * 300 + 15000),
                    likes: 0,
                    retweets: 0,
                    replies: 0,
                  };
                  newComments.push(comment);
                }
              }
              return [...prevComments, ...newComments];
            });
          }
          
          return {
            ...prev,
            likes: prev.likes + Math.floor(Math.random() * 5) + 1,
            retweets: prev.retweets + retweetIncrease,
            comments: prev.comments + commentIncrease,
            views: prev.views + Math.floor(Math.random() * 100) + 50,
          };
        });
      }, 600);
    }, 10000));

    // Stage 3: Viral explosion (30s) - Exponential growth
    timeouts.push(setTimeout(() => {
      if (!mounted) return;
      setViralStage(1);
      showNextNotification(1);
      startNewInterval(() => {
        if (!mounted) return;
        setMetrics(prev => {
          if (prev.views >= 100000000) { // 100M limit check
            setHasReachedLimit(true);
            return prev;
          }
                      const likesIncrease = Math.floor(Math.random() * 100) + 50; // 50-149
            const retweetsIncrease = Math.floor(Math.random() * 3) + 1; // 1-3 (1:40+ ratio)
            const commentIncrease = Math.floor(Math.random() * 2) + 1; // 1-2 comments
            
            // Create actual comment objects
            setAllComments(prevComments => {
              const newComments = [];
              for (let i = 0; i < commentIncrease; i++) {
                if (prevComments.length + i < viralComments.length) {
                  const comment: Comment = {
                    ...viralComments[prevComments.length + i],
                    id: (prevComments.length + i + 1).toString(),
                    timestamp: new Date(timestamp.getTime() + (prevComments.length + i + 1) * 300 + 15000),
                    likes: 0,
                    retweets: 0,
                    replies: 0,
                  };
                  newComments.push(comment);
                }
              }
              return [...prevComments, ...newComments];
            });
            
            const newLikes = prev.likes + likesIncrease;
            const newRetweets = prev.retweets + retweetsIncrease;
            const newViews = prev.views + Math.floor(Math.random() * 2000) + 1000; // 1000-2999
            
            return {
              ...prev,
              likes: newLikes,
              retweets: newRetweets,
              comments: prev.comments + commentIncrease,
              views: newViews,
            };
        });
      }, 200);
    }, 30000));

    // Stage 4: Mega viral (60s) - MUCH FASTER!
    timeouts.push(setTimeout(() => {
      if (!mounted) return;
      setViralStage(2);
      showNextNotification(2);
      startNewInterval(() => {
        if (!mounted) return;
        setMetrics(prev => {
          if (prev.views >= 100000000) { // 100M limit check
            setHasReachedLimit(true);
            return prev;
          }
                      const likesIncrease = Math.floor(Math.random() * 500) + 300; // 300-799
            const retweetsIncrease = Math.floor(Math.random() * 14) + 7; // 7-20 (1:40+ ratio)
            const commentIncrease = Math.floor(Math.random() * 4) + 2; // 2-5 comments
            
            // Create actual comment objects
            setAllComments(prevComments => {
              const newComments = [];
              for (let i = 0; i < commentIncrease; i++) {
                if (prevComments.length + i < viralComments.length) {
                  const comment: Comment = {
                    ...viralComments[prevComments.length + i],
                    id: (prevComments.length + i + 1).toString(),
                    timestamp: new Date(timestamp.getTime() + (prevComments.length + i + 1) * 300 + 15000),
                    likes: 0,
                    retweets: 0,
                    replies: 0,
                  };
                  newComments.push(comment);
                }
              }
              return [...prevComments, ...newComments];
            });
            
            const newLikes = prev.likes + likesIncrease;
            const newRetweets = prev.retweets + retweetsIncrease;
            const newViews = prev.views + Math.floor(Math.random() * 20000) + 15000; // 15000-34999
            
            return {
              ...prev,
              likes: newLikes,
              retweets: newRetweets,
              comments: prev.comments + commentIncrease,
              views: newViews,
            };
        });
      }, 100);
    }, 60000));

    // Stage 5: BREAKING Viral (90s) - EXPLOSIVE!
    timeouts.push(setTimeout(() => {
      if (!mounted) return;
      setViralStage(3);
      showNextNotification(3);
      startNewInterval(() => {
        if (!mounted) return;
        setMetrics(prev => {
          if (prev.views >= 100000000) { // 100M limit check
            setHasReachedLimit(true);
            return prev;
          }
                      const likesIncrease = Math.floor(Math.random() * 1000) + 800; // 800-1799
            const retweetsIncrease = Math.floor(Math.random() * 26) + 20; // 20-45 (1:40+ ratio)
            const commentIncrease = Math.floor(Math.random() * 8) + 5; // 5-12 comments
            
            // Create actual comment objects
            setAllComments(prevComments => {
              const newComments = [];
              for (let i = 0; i < commentIncrease; i++) {
                if (prevComments.length + i < viralComments.length) {
                  const comment: Comment = {
                    ...viralComments[prevComments.length + i],
                    id: (prevComments.length + i + 1).toString(),
                    timestamp: new Date(timestamp.getTime() + (prevComments.length + i + 1) * 300 + 15000),
                    likes: 0,
                    retweets: 0,
                    replies: 0,
                  };
                  newComments.push(comment);
                }
              }
              return [...prevComments, ...newComments];
            });
            
            const newLikes = prev.likes + likesIncrease;
            const newRetweets = prev.retweets + retweetsIncrease;
            const newViews = prev.views + Math.floor(Math.random() * 40000) + 30000; // 30000-69999
            
            return {
              ...prev,
              likes: newLikes,
              retweets: newRetweets,
              comments: prev.comments + commentIncrease,
              views: newViews,
            };
        });
      }, 60);
    }, 90000));

    // Stage 6: MEGA VIRAL (2.5 min) - Internet Breaker!
    timeouts.push(setTimeout(() => {
      if (!mounted) return;
      setViralStage(4);
      showNextNotification(4);
      startNewInterval(() => {
        if (!mounted) return;
        setMetrics(prev => {
          if (prev.views >= 100000000) { // 100M limit check
            setHasReachedLimit(true);
            return prev;
          }
                      const likesIncrease = Math.floor(Math.random() * 2000) + 1500; // 1500-3499
            const retweetsIncrease = Math.floor(Math.random() * 51) + 37; // 37-87 (1:40+ ratio)
            const commentIncrease = Math.floor(Math.random() * 15) + 10; // 10-24 comments
            
            // Create actual comment objects
            setAllComments(prevComments => {
              const newComments = [];
              for (let i = 0; i < commentIncrease; i++) {
                if (prevComments.length + i < viralComments.length) {
                  const comment: Comment = {
                    ...viralComments[prevComments.length + i],
                    id: (prevComments.length + i + 1).toString(),
                    timestamp: new Date(timestamp.getTime() + (prevComments.length + i + 1) * 300 + 15000),
                    likes: 0,
                    retweets: 0,
                    replies: 0,
                  };
                  newComments.push(comment);
                }
              }
              return [...prevComments, ...newComments];
            });
            
            const newLikes = prev.likes + likesIncrease;
            const newRetweets = prev.retweets + retweetsIncrease;
            const newViews = prev.views + Math.floor(Math.random() * 80000) + 60000; // 60000-139999
            
            return {
              ...prev,
              likes: newLikes,
              retweets: newRetweets,
              comments: prev.comments + commentIncrease,
              views: newViews,
            };
        });
      }, 40);
    }, 150000));

    // Stage 7: LEGENDARY (3 min) - Global Phenomenon!
    timeouts.push(setTimeout(() => {
      if (!mounted) return;
      setViralStage(5);
      showNextNotification(5);
      startNewInterval(() => {
        if (!mounted) return;
        setMetrics(prev => {
          if (prev.views >= 100000000) { // 100M limit check
            setHasReachedLimit(true);
            return prev;
          }
                      const likesIncrease = Math.floor(Math.random() * 4000) + 3000; // 3000-6999
            const retweetsIncrease = Math.floor(Math.random() * 101) + 75; // 75-175 (1:40+ ratio)
            const commentIncrease = Math.floor(Math.random() * 30) + 25; // 25-54 comments
            
            // Create actual comment objects
            setAllComments(prevComments => {
              const newComments = [];
              for (let i = 0; i < commentIncrease; i++) {
                if (prevComments.length + i < viralComments.length) {
                  const comment: Comment = {
                    ...viralComments[prevComments.length + i],
                    id: (prevComments.length + i + 1).toString(),
                    timestamp: new Date(timestamp.getTime() + (prevComments.length + i + 1) * 300 + 15000),
                    likes: 0,
                    retweets: 0,
                    replies: 0,
                  };
                  newComments.push(comment);
                }
              }
              return [...prevComments, ...newComments];
            });
            
            const newLikes = prev.likes + likesIncrease;
            const newRetweets = prev.retweets + retweetsIncrease;
            const newViews = prev.views + Math.floor(Math.random() * 150000) + 100000; // 100000-249999
            
            return {
              ...prev,
              likes: newLikes,
              retweets: newRetweets,
              comments: prev.comments + commentIncrease,
              views: newViews,
            };
        });
      }, 30);
    }, 180000));

    // Stage 8: ULTIMATE (4 min) - Making History!
    timeouts.push(setTimeout(() => {
      if (!mounted) return;
      setViralStage(6);
      showNextNotification(6);
      startNewInterval(() => {
        if (!mounted) return;
        setMetrics(prev => {
          if (prev.views >= 100000000) { // 100M limit check
            setHasReachedLimit(true);
            return prev;
          }
                      const likesIncrease = Math.floor(Math.random() * 8000) + 6000; // 6000-13999
            const retweetsIncrease = Math.floor(Math.random() * 201) + 150; // 150-350 (1:40+ ratio)
            const commentIncrease = Math.floor(Math.random() * 50) + 40; // 40-89 comments
            
            // Create actual comment objects
            setAllComments(prevComments => {
              const newComments = [];
              for (let i = 0; i < commentIncrease; i++) {
                if (prevComments.length + i < viralComments.length) {
                  const comment: Comment = {
                    ...viralComments[prevComments.length + i],
                    id: (prevComments.length + i + 1).toString(),
                    timestamp: new Date(timestamp.getTime() + (prevComments.length + i + 1) * 300 + 15000),
                    likes: 0,
                    retweets: 0,
                    replies: 0,
                  };
                  newComments.push(comment);
                }
              }
              return [...prevComments, ...newComments];
            });
            
            const newLikes = prev.likes + likesIncrease;
            const newRetweets = prev.retweets + retweetsIncrease;
            const newViews = prev.views + Math.floor(Math.random() * 300000) + 200000; // 200000-499999
            
            return {
              ...prev,
              likes: newLikes,
              retweets: newRetweets,
              comments: prev.comments + commentIncrease,
              views: newViews,
            };
        });
      }, 20);
    }, 240000));

    // Stage 9: WORLD RECORD (5 min) - Biggest Viral Post Ever!
    timeouts.push(setTimeout(() => {
      if (!mounted) return;
      setViralStage(7);
      showNextNotification(7);
      startNewInterval(() => {
        if (!mounted) return;
        setMetrics(prev => {
          if (prev.views >= 100000000) { // 100M limit - LEGENDARY!
            setHasReachedLimit(true);
            return prev;
          }
                      const likesIncrease = Math.floor(Math.random() * 15000) + 10000; // 10000-24999
            const retweetsIncrease = Math.floor(Math.random() * 376) + 250; // 250-625 (1:40+ ratio)
            const commentIncrease = Math.floor(Math.random() * 100) + 80; // 80-179 comments
            
            // Create actual comment objects
            setAllComments(prevComments => {
              const newComments = [];
              for (let i = 0; i < commentIncrease; i++) {
                if (prevComments.length + i < viralComments.length) {
                  const comment: Comment = {
                    ...viralComments[prevComments.length + i],
                    id: (prevComments.length + i + 1).toString(),
                    timestamp: new Date(timestamp.getTime() + (prevComments.length + i + 1) * 300 + 15000),
                    likes: 0,
                    retweets: 0,
                    replies: 0,
                  };
                  newComments.push(comment);
                }
              }
              return [...prevComments, ...newComments];
            });
            
            const newLikes = prev.likes + likesIncrease;
            const newRetweets = prev.retweets + retweetsIncrease;
            const newViews = prev.views + Math.floor(Math.random() * 500000) + 400000; // 400000-899999
            
            return {
              ...prev,
              likes: newLikes,
              retweets: newRetweets,
              comments: prev.comments + commentIncrease,
              views: newViews,
            };
        });
      }, 15);
    }, 300000));

    return () => {
      if (currentInterval) {
        clearInterval(currentInterval);
      }
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [mounted, timestamp, showNextNotification, hasReachedLimit]);

  // Separate useEffect for comment metrics updates
  useEffect(() => {
    if (!mounted) return;

    let metricsInterval: NodeJS.Timeout | null = null;
    const metricsTimeout = setTimeout(() => {
      if (!mounted) return;
      metricsInterval = setInterval(() => {
        if (mounted && !hasReachedLimit) {
          updateCommentMetrics();
        }
      }, 5000); // Update every 5 seconds
    }, 18000); // Start after comments begin

    return () => {
      clearTimeout(metricsTimeout);
      if (metricsInterval) {
        clearInterval(metricsInterval);
      }
    };
  }, [mounted, updateCommentMetrics, hasReachedLimit]);

  const getViralMessage = () => {
    switch (currentNotificationStage) {
      case 1:
        return "🔥 Your post is going viral!";
      case 2:
        return "🚀 You're trending! #1 in Technology";
      case 3:
        return "⚡ BREAKING: Viral explosion detected!";
      case 4:
        return "🌟 MEGA VIRAL! You broke the internet!";
      case 5:
        return "👑 LEGENDARY STATUS! Global phenomenon!";
      case 6:
        return "🎆 ULTIMATE VIRAL! Making history!";
      case 7:
        return "🌍 WORLD RECORD! Quickest viral post ever!";
      default:
        return "";
    }
  };

  const handleContentClick = () => {
    setShowTweetDetail(true);
  };

  const handleAnalyticsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAnalytics(true);
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTweetDetail(true);
  };

  return (
    <>
      <div className="border-b border-[#2f3336] p-4 hover:bg-[#0a0a0a]/50 transition-colors">
        {/* Viral Notification */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className={`mb-4 p-3 rounded-lg text-center font-bold ${
                currentNotificationStage >= 5
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                  : 'bg-gradient-to-r from-[#1d9bf0] to-[#7c3aed]'
              }`}
            >
              {getViralMessage()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Post Header */}
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={24} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold">{userData.name}</span>
              <span className="text-[#71767b]">@{userData.handle}</span>
              <span className="text-[#71767b]">·</span>
              <span className="text-[#71767b]">{getTimestamp()}</span>
              <button className="ml-auto text-[#71767b] hover:text-white">
                <MoreHorizontal size={20} />
              </button>
            </div>
            
            {/* Post Content - Clickable */}
            <div 
              className="mt-2 text-white text-lg leading-6 cursor-pointer hover:bg-[#1a1a1a]/30 rounded-lg p-2 -m-2 transition-colors"
              onClick={handleContentClick}
            >
              {content}
            </div>
            
            {/* Post Metrics - Fixed alignment */}
            <div className="flex items-center justify-between mt-4 max-w-md">
              <button 
                className="flex items-center text-[#71767b] hover:text-[#1d9bf0] group"
                onClick={handleCommentClick}
              >
                <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                  <MessageCircle size={18} />
                </div>
                <AnimatedNumber value={metrics.comments} className="text-sm ml-1" />
              </button>
              
              <button className="flex items-center text-[#71767b] hover:text-[#00ba7c] group">
                <div className="p-2 rounded-full group-hover:bg-[#00ba7c]/10 transition-colors">
                  <Repeat2 size={18} />
                </div>
                <AnimatedNumber value={metrics.retweets} className="text-sm ml-1" />
              </button>
              
              <button className="flex items-center text-[#71767b] hover:text-[#f91880] group">
                <div className="p-2 rounded-full group-hover:bg-[#f91880]/10 transition-colors">
                  <Heart size={18} />
                </div>
                <AnimatedNumber value={metrics.likes} className="text-sm ml-1" />
              </button>
              
              <button 
                className="flex items-center text-[#71767b] hover:text-[#1d9bf0] group"
                onClick={handleAnalyticsClick}
              >
                <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                  <BarChart3 size={18} />
                </div>
                <AnimatedNumber value={metrics.views} className="text-sm ml-1" />
              </button>
              
              <button className="text-[#71767b] hover:text-[#1d9bf0] group">
                <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                  <Share size={18} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Modal */}
      <AnalyticsModal
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        metrics={metrics}
        content={content}
        timestamp={timestamp}
      />

      {/* Tweet Detail Modal */}
      <TweetDetailModal
        isOpen={showTweetDetail}
        onClose={() => setShowTweetDetail(false)}
        metrics={metrics}
        content={content}
        timestamp={timestamp}
        comments={allComments}
      />
    </>
  );
} 