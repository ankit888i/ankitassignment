import React, { useState, useEffect } from "react";
import axios from "axios";
import { Heart, Share, Bookmark, Flag, X } from "lucide-react";
import { apiUrlUser } from "../ApiUrl";

const TweetCard = ({ tweet }) => {
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reported, setReported] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const userId = localStorage.getItem("_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${apiUrlUser}profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const interactions = res.data.interactions || {};
        const tweetInteractions = interactions[tweet.id] || {};
        setLiked(!!tweetInteractions.liked);
        setShared(!!tweetInteractions.shared);
        setSaved(!!tweetInteractions.saved);
        setReported(!!tweetInteractions.reported);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchProfile();
  }, [userId, token, tweet.id]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2000);
  };

  const handleAction = async (actionType) => {
    let delta = 0;
    let updateState;

    if (actionType === "like") {
      updateState = !liked;
      setLiked(updateState);
      delta = updateState ? 2 : -2;
      showNotification(
        updateState ? "+2 Credits for Like" : "-2 Credits for Unlike",
        updateState ? "success" : "error"
      );
    } else if (actionType === "share") {
      updateState = !shared;
      setShared(updateState);
      delta = updateState ? 5 : -5;
      if (updateState) {
        navigator.clipboard
          ?.writeText?.(window.location.href + "/tweet/" + tweet.id)
          .catch(() => {});
        showNotification("Link copied! +5 Credits", "success");
      } else {
        showNotification("Unshared", "info");
      }
    } else if (actionType === "save") {
      updateState = !saved;
      setSaved(updateState);
      delta = updateState ? 1 : -1;

      try {
        await axios.post(
          `${apiUrlUser}save-tweet`,
          {
            userId,
            tweetId: tweet.id,
            tweetData: tweet,
            saved: updateState,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        showNotification(
          updateState ? "+1 Credit for Save" : "-1 Credit for Unsave",
          updateState ? "success" : "error"
        );
      } catch (err) {
        console.error("Failed to save tweet:", err);
        setSaved(!updateState);
        showNotification("Failed to save tweet", "error");
        return;
      }
    } else if (actionType === "report") {
      if (reported) {
        showNotification("You've already reported this tweet", "info");
        return;
      }

      setShowReportModal(true);
      return;
    }

    try {
      await axios.post(
        apiUrlUser + "interaction",
        {
          userId,
          tweetId: tweet.id,
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
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) {
      showNotification("Please provide a reason for reporting", "error");
      return;
    }

    try {
      await axios.post(
        `${apiUrlUser}report-tweet`,
        {
          userId,
          tweetId: tweet.id,
          tweetData: tweet,
          reason: reportReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReported(true);
      setShowReportModal(false);
      setReportReason("");
      showNotification("Tweet reported successfully", "success");

      // Update the interaction
      await axios.post(
        apiUrlUser + "interaction",
        {
          userId,
          tweetId: tweet.id,
          action: "report",
          delta: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Failed to report tweet:", err);
      showNotification("Failed to report tweet", "error");
    }
  };

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      {notification && (
        <div
          className={`absolute top-2 right-2 px-3 py-1 rounded text-sm font-medium shadow-md z-10
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

      {/* Report Button */}
      <button
        className={`absolute top-2 right-2 p-1.5 rounded-full transition-all ${
          reported
            ? "bg-red-100 text-red-500"
            : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
        }`}
        onClick={() => handleAction("report")}
        title={reported ? "Reported" : "Report"}
      >
        <Flag className="h-4 w-4" />
      </button>

      <div className="flex items-start">
        <div className="relative">
          <img
            src={tweet.avatar ? tweet.avatar : "/default-avatar.png"}
            alt={tweet.name}
            className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
            <div className="bg-twitter-blue h-3 w-3 rounded-full"></div>
          </div>
        </div>
        <div className="flex-1 ml-4">
          <div className="flex items-center mb-1">
            <h3 className="font-bold text-lg">{tweet.name}</h3>
            <span className="ml-2 text-gray-500 text-sm">
              @{tweet.username}
            </span>
            <span className="ml-2 text-gray-500 text-xs">· {tweet.time}</span>
          </div>
          <p className="my-2 text-gray-800 leading-relaxed">{tweet.content}</p>
          <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
            <button
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                liked ? "bg-red-50" : "hover:bg-red-50"
              }`}
              onClick={() => handleAction("like")}
            >
              <Heart
                className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                  liked ? "fill-red-500 text-red-500" : "text-gray-500"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  liked ? "text-red-500" : "text-gray-500"
                }`}
              >
                {liked ? "Liked" : "Like"}
              </span>
            </button>
            <button
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                shared ? "bg-green-50" : "hover:bg-green-50"
              }`}
              onClick={() => handleAction("share")}
            >
              <Share
                className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                  shared ? "text-green-500" : "text-gray-500"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  shared ? "text-green-500" : "text-gray-500"
                }`}
              >
                {shared ? "Shared" : "Share"}
              </span>
            </button>
            <button
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                saved ? "bg-yellow-50" : "hover:bg-yellow-50"
              }`}
              onClick={() => handleAction("save")}
            >
              <Bookmark
                className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                  saved ? "fill-yellow-500 text-yellow-500" : "text-gray-500"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  saved ? "text-yellow-500" : "text-gray-500"
                }`}
              >
                {saved ? "Saved" : "Save"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Report Tweet</h3>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason("");
                }}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Please let us know why you're reporting this tweet. This will help
              us understand the issue and take appropriate action.
            </p>

            <div className="mb-4">
              <label
                htmlFor="reportReason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Reason for reporting
              </label>
              <textarea
                id="reportReason"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Please explain why you're reporting this tweet..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TweetCard;
