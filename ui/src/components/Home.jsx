import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import TweetCard from "./TweetCard";
import RightSection from "./RightSection";
import TweetFeedHeader from "./UI/Tweetfeedheader";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [after, setAfter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const loaderRef = useRef(null);

  // Fetch directly from Reddit API
  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const redditUrl = `https://www.reddit.com/r/javascript/top.json?limit=10${
        after ? `&after=${after}` : ""
      }`;

      const res = await axios.get(redditUrl);

      if (!res.data || !res.data.data) {
        throw new Error("Invalid response from Reddit API");
      }

      const newPosts = res.data.data.children.map((child) => ({
        id: child.data.id,
        name: child.data.author,
        username: child.data.author,
        time: new Date(child.data.created_utc * 1000).toLocaleDateString(),
        content: child.data.title,
        avatar: `https://www.redditstatic.com/avatars/avatar_default_0${
          Math.floor(Math.random() * 7) + 1
        }_F.png`,
        url: child.data.url,
      }));

      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const uniqueNewPosts = newPosts.filter((p) => !existingIds.has(p.id));
        return [...prev, ...uniqueNewPosts];
      });

      setAfter(res.data.data.after);
      setHasMore(!!res.data.data.after);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");

      if (posts.length === 0) {
        setPosts([
          {
            id: "placeholder1",
            name: "JavaScript Dev",
            username: "jsdev",
            time: new Date().toLocaleDateString(),
            content: "10 tips for better React performance in 2025",
            avatar: `https://www.redditstatic.com/avatars/avatar_default_01_F.png`,
          },
          {
            id: "placeholder2",
            name: "Web Designer",
            username: "webdes",
            time: new Date().toLocaleDateString(),
            content: "CSS Grid vs Flexbox: The ultimate comparison",
            avatar: `https://www.redditstatic.com/avatars/avatar_default_02_F.png`,
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [after, loading, hasMore, posts.length]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          fetchPosts();
        }
      },
      { rootMargin: "200px" }
    );

    if (loaderRef.current) {
      observerRef.current.observe(loaderRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [fetchPosts, hasMore, loading]);

  const handleRefresh = () => {
    setPosts([]);
    setAfter(null);
    setHasMore(true);
    fetchPosts();
  };

  return (
    <div className="relative container mx-auto  px-4 py-4 text">
      <div className="h-0.5 w-full fixed top-0  z-50 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />
      <TweetFeedHeader />
      <div className="grid grid-cols-1  rounded-3xl md:grid-cols-[2.5fr_1.5fr] gap-4 min-h-screen bg-white text-gray-900">
        <div className="w-full px-2">
          {error && posts.length === 0 && (
            <div className="bg-red-50 p-4 rounded-lg mb-4 text-red-700">
              <p>{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-2 bg-red-100 px-4 py-2 rounded-md hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Pull to refresh */}
          <div className="text-center mb-4">
            <button
              onClick={handleRefresh}
              className="text-sm text-gray-500 flex items-center justify-center w-full py-2 hover:bg-gray-100 rounded-md transition"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Pull to refresh
            </button>
          </div>

          {/* Posts */}
          {posts.map((tweet, index) => (
            <TweetCard key={tweet.id + "-" + index} tweet={tweet} />
          ))}

          {/* Loader */}
          {loading && (
            <div className="text-center  py-4">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2 text-gray-500">Loading more posts...</p>
            </div>
          )}

          {/* End of feed */}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              You've reached the end of the feed
            </div>
          )}

          {/* Intersection Observer target */}
          <div ref={loaderRef} className="h-10" />
        </div>

        {/* Right section */}
        <div className="hidden md:block">
          <RightSection />
        </div>
      </div>
    </div>
  );
}
