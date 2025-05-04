import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, Share } from "lucide-react";
import { apiurlTwitter, apiUrlUser } from "../ApiUrl";
import { apiurlStoreTrending } from "../ApiUrl";

const RightSection = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interactions, setInteractions] = useState({});
  const [notification, setNotification] = useState(null);

  const userId = localStorage.getItem("_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);

        // First try to get live Twitter trending data
        try {
          const res = await axios.get(apiurlTwitter + "trending");

          if (
            res.data &&
            Array.isArray(res.data.data) &&
            res.data.data.length > 0
          ) {
            console.log("Fetched live tweets:", res.data.data);
            setTrending(res.data.data);
            setLoading(false);
            return; // Exit if successful
          }
        } catch (twitterErr) {
          console.log(
            "Twitter API error, falling back to stored tweets:",
            twitterErr.message
          );
          // Continue to stored tweets fallback
        }

        // Fallback: Get stored tweets from our database
        const storedRes = await axios.get(
          `${apiurlStoreTrending}stored-tweets?limit=15`
        );

        if (
          storedRes.data &&
          Array.isArray(storedRes.data.data) &&
          storedRes.data.data.length > 0
        ) {
          console.log("Fetched stored tweets:", storedRes.data.data);
          setTrending(storedRes.data.data);
        } else {
          throw new Error("No trending data available");
        }
      } catch (err) {
        console.error("Failed to load Twitter trends:", err);
        setError("Failed to load trending topics. Please try again later.");

        // Development fallback
        setTrending([
          {
            id: "placeholder1",
            text: "JavaScript frameworks comparison: React vs Vue vs Angular",
            created_at: new Date().toISOString(),
          },
          {
            id: "placeholder2",
            text: "Top 10 programming languages to learn in 2023",
            created_at: new Date().toISOString(),
          },
          {
            id: "placeholder3",
            text: "The future of AI in web development - trends and predictions",
            created_at: new Date().toISOString(),
          },
          {
            id: "placeholder4",
            text: "How to optimize your Node.js application for production",
            created_at: new Date().toISOString(),
          },
          {
            id: "placeholder5",
            text: "Building responsive mobile-first interfaces with modern CSS",
            created_at: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    const fetchInteractions = async () => {
      if (!userId || !token) return;

      try {
        const res = await axios.get(`${apiUrlUser}profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && res.data.interactions) {
          setInteractions(res.data.interactions);
        }
      } catch (err) {
        console.error("Error fetching user interactions:", err);
      }
    };

    fetchInteractions();
  }, [userId, token]);

  const formatDate = (dateString) => {
    try {
      let date;
      if (dateString instanceof Date) {
        date = dateString;
      } else {
        date = new Date(dateString);
      }

      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }

      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== new Date().getFullYear()
            ? "numeric"
            : undefined,
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Recent";
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2000);
  };

  const handleAction = async (tweetId, actionType) => {
    if (!userId || !token) {
      showNotification("Please login to interact", "error");
      return;
    }

    const currentInteractions = interactions[tweetId] || {};
    let delta = 0;
    let updateState = false;

    // Create a new interactions object
    const newInteractions = { ...interactions };

    if (!newInteractions[tweetId]) {
      newInteractions[tweetId] = {};
    }

    if (actionType === "like") {
      updateState = !currentInteractions.liked;
      newInteractions[tweetId].liked = updateState;
      delta = updateState ? 2 : -2;
      showNotification(
        updateState ? "+2 Credits for Like" : "-2 Credits for Unlike",
        updateState ? "success" : "error"
      );
    } else if (actionType === "share") {
      updateState = !currentInteractions.shared;
      newInteractions[tweetId].shared = updateState;
      delta = updateState ? 5 : -5;

      if (updateState) {
        navigator.clipboard
          ?.writeText?.(window.location.href + "/tweet/" + tweetId)
          .catch(() => {});
        showNotification("Link copied! +5 Credits", "success");
      } else {
        showNotification("Unshared", "info");
      }
    }

    // Update the interactions state
    setInteractions(newInteractions);

    try {
      await axios.post(
        apiUrlUser + "interaction",
        {
          userId,
          tweetId,
          action: actionType,
          delta,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Failed to record interaction:", err);
      // Revert state on error
      if (actionType === "like") {
        newInteractions[tweetId].liked = !updateState;
      } else if (actionType === "share") {
        newInteractions[tweetId].shared = !updateState;
      }
      setInteractions(newInteractions);
    }
  };

  const handleRefresh = () => {
    setTrending([]);
    setError(null);
    setLoading(true);
    const fetchTrending = async () => {
      try {
        // Try to get live tweets first
        const res = await axios.get(apiurlTwitter);

        if (
          res.data &&
          Array.isArray(res.data.data) &&
          res.data.data.length > 0
        ) {
          setTrending(res.data.data);
        } else {
          throw new Error("No trending data available");
        }
      } catch (err) {
        console.error("Failed to refresh trends, trying fallback:", err);

        try {
          // Try stored tweets as fallback
          const storedRes = await axios.get(
            `${apiurlStoreTrending}stored-tweets?limit=15`
          );

          if (
            storedRes.data &&
            Array.isArray(storedRes.data.data) &&
            storedRes.data.data.length > 0
          ) {
            setTrending(storedRes.data.data);
          } else {
            throw new Error("No stored trending data available");
          }
        } catch (fallbackErr) {
          console.error("Fallback also failed:", fallbackErr);
          setError("Failed to load trending topics. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  };

  return (
    <aside className="p-4 h-screen overflow-hidden">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-4 px-4 py-2 rounded-md shadow-md z-50 text-sm font-medium
          ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : notification.type === "error"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Search Bar */}
      <div className="relative mb-4">
        <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
        <input
          type="text"
          className="w-full py-3 px-10 rounded-full border-none bg-gray-100 font-normal text-base focus:outline-2 focus:outline-[#ff9933] focus:bg-white"
          placeholder="Search HustleNest"
        />
      </div>

      {/* Dynamic Trending Section */}
      <div className="bg-gray-100 rounded-2xl mb-4 overflow-hidden">
        <div className="py-3 px-4 text-lg font-bold border-b border-gray-200 flex justify-between items-center">
          <span>Trending in India</span>
          <button
            onClick={handleRefresh}
            className="text-sm text-gray-500 hover:text-gray-700"
            title="Refresh"
          >
            <svg
              className="w-4 h-4"
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
          </button>
        </div>

        <div className="h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="py-6 text-center text-gray-500">
              <div className="animate-pulse flex flex-col space-y-4 p-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="py-6 text-center text-gray-500 px-4">
              <p>{error}</p>
              <button
                className="mt-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 text-sm font-medium"
                onClick={handleRefresh}
              >
                Retry
              </button>
            </div>
          ) : (
            trending.map((tweet, i) => {
              const tweetInteractions = interactions[tweet.id] || {};
              const isLiked = !!tweetInteractions.liked;
              const isShared = !!tweetInteractions.shared;

              return (
                <div
                  key={tweet.id || i}
                  className="py-3 px-4 cursor-pointer transition-colors hover:bg-black hover:bg-opacity-5 border-b border-gray-200 border-opacity-30"
                >
                  <div className="text-xs text-gray-500 mb-1">
                    Trending · Tweet
                  </div>
                  <div className="font-bold mb-1">
                    {tweet.text.slice(0, 60)}
                    {tweet.text.length > 60 ? "..." : ""}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(tweet.created_at)}
                  </div>

                  {/* Interaction buttons */}
                  <div className="flex justify-between mt-3 pt-2 border-t border-gray-200 border-opacity-30">
                    <button
                      className={`group flex items-center gap-1 px-2 py-1 rounded-full transition-all text-xs ${
                        isLiked ? "bg-red-50" : "hover:bg-red-50"
                      }`}
                      onClick={() => handleAction(tweet.id, "like")}
                    >
                      <Heart
                        className={`h-3 w-3 transition-transform group-hover:scale-110 ${
                          isLiked
                            ? "fill-red-500 text-red-500"
                            : "text-gray-500"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          isLiked ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        {isLiked ? "Liked" : "Like"}
                      </span>
                    </button>

                    <button
                      className={`group flex items-center gap-1 px-2 py-1 rounded-full transition-all text-xs ${
                        isShared ? "bg-green-50" : "hover:bg-green-50"
                      }`}
                      onClick={() => handleAction(tweet.id, "share")}
                    >
                      <Share
                        className={`h-3 w-3 transition-transform group-hover:scale-110 ${
                          isShared ? "text-green-500" : "text-gray-500"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          isShared ? "text-green-500" : "text-gray-500"
                        }`}
                      >
                        {isShared ? "Shared" : "Share"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
};

export default RightSection;
