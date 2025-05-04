import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrlUser } from "../ApiUrl";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  CreditCard,
  Activity,
  Bookmark,
  RefreshCw,
  Heart,
  Share2,
  Calendar,
  Clock,
  ChevronRight,
  TrendingUp,
  Award,
  Filter,
  MessageSquare,
} from "lucide-react";

const UserCreditDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [creditHistory, setCreditHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedTweets, setSavedTweets] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateFilter, setDateFilter] = useState("all");

  const userId = localStorage.getItem("_id");
  const token = localStorage.getItem("token");

  // Fetch user's profile data and credit history
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Fetch user profile
        const profileRes = await axios.get(`${apiUrlUser}profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("User profile data:", profileRes.data);
        setUserData(profileRes.data);

        // Fetch credit history
        const creditRes = await axios.get(
          `${apiUrlUser}credit-history/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCreditHistory(creditRes.data.history || []);

        // Fetch saved tweets
        const savedRes = await axios.get(
          `${apiUrlUser}saved-tweets/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const formattedTweets = savedRes.data.map((item) => {
          // Ensure tweetData has all required fields or provide defaults
          return {
            name: item.tweetData?.name || "Unknown User",
            username: item.tweetData?.username || "unknown",
            content: item.tweetData?.content || "No content available",
            avatar: item.tweetData?.avatar || "/default-avatar.png",
            time: new Date(item.savedAt).toLocaleDateString() || "May 4, 2025",
          };
        });

        setSavedTweets(formattedTweets || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId, token]);

  // Filter credit history based on selected date range
  const getFilteredHistory = () => {
    if (dateFilter === "all") return creditHistory;

    const now = new Date();
    let startDate;

    switch (dateFilter) {
      case "today":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        return creditHistory;
    }

    return creditHistory.filter(
      (item) => new Date(item.timestamp) >= startDate
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Prepare data for charts
  const prepareInteractionData = () => {
    if (!userData || !userData.interactions) return [];

    // Ensure all interaction fields exist
    const interactions = {
      likes: userData.interactions.likes || 0,
      shares: userData.interactions.shares || 0,
      comments: userData.interactions.comments || 0,
    };

    // Make sure we have at least one interaction to show in the chart
    const totalInteractions =
      interactions.likes + interactions.shares + interactions.comments;

    if (totalInteractions === 0) {
      return [{ name: "No Interactions", value: 1, color: "#CBD5E1" }];
    }

    return [
      {
        name: "Likes",
        value: interactions.likes,
        color: "#EF4444",
      },
      {
        name: "Shares",
        value: interactions.shares,
        color: "#10B981",
      },
      {
        name: "Comments",
        value: interactions.comments,
        color: "#3B82F6",
      },
    ];
  };

  const prepareCreditSourceData = () => {
    if (!creditHistory || creditHistory.length === 0) return [];

    const sources = {};
    getFilteredHistory().forEach((item) => {
      const reason = item.reason.includes("Like")
        ? "Likes"
        : item.reason.includes("Share")
        ? "Shares"
        : item.reason.includes("Save") || item.reason.includes("Comment")
        ? "Saves/Comments"
        : item.reason.includes("Login")
        ? "Login Bonus"
        : item.reason.includes("Profile") ||
          item.reason.includes("Registration")
        ? "Profile/Registration"
        : "Other";

      sources[reason] = (sources[reason] || 0) + item.amount;
    });

    return Object.keys(sources).map((key) => ({
      name: key,
      value: sources[key],
    }));
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Credit Dashboard
      </h1>

      {/* Credit Summary Card */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-blue-100 p-3 rounded-full">
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">
                Total Credits
              </h2>
              <p className="text-4xl font-bold text-gray-800">
                {userData?.credits || 0}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-purple-500" />
                <span className="ml-2 text-sm font-medium text-gray-500">
                  Interactions
                </span>
              </div>
              <p className="mt-1 text-xl font-semibold">
                {userData?.interactions
                  ? (userData.interactions.likes || 0) +
                    (userData.interactions.shares || 0) +
                    (userData.interactions.comments || 0)
                  : 0}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Bookmark className="h-5 w-5 text-yellow-500" />
                <span className="ml-2 text-sm font-medium text-gray-500">
                  Saved
                </span>
              </div>
              <p className="mt-1 text-xl font-semibold">{savedTweets.length}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <RefreshCw className="h-5 w-5 text-green-500" />
                <span className="ml-2 text-sm font-medium text-gray-500">
                  Last Earned
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold">
                {creditHistory.length > 0
                  ? `${creditHistory[0].amount > 0 ? "+" : ""}${
                      creditHistory[0].amount
                    }`
                  : "0"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`py-3 px-6 ${
            activeTab === "overview"
              ? "border-b-2 border-blue-500 text-blue-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`py-3 px-6 ${
            activeTab === "history"
              ? "border-b-2 border-blue-500 text-blue-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Credit History
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`py-3 px-6 ${
            activeTab === "saved"
              ? "border-b-2 border-blue-500 text-blue-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Saved Content
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Interaction Stats */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Interaction Analytics
                </h3>
                <div className="flex items-center text-sm text-blue-500">
                  <span className="font-medium">View All</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareInteractionData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {prepareInteractionData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, "Count"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-around mt-4">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    Likes: {userData?.interactions?.likes || 0}
                  </span>
                </div>
                <div className="flex items-center">
                  <Share2 className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    Shares: {userData?.interactions?.shares || 0}
                  </span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    Comments: {userData?.interactions?.comments || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Credit Sources */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Credit Sources
                </h3>
                <div className="relative">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
                  >
                    <option value="all">All Time</option>
                    <option value="month">Last Month</option>
                    <option value="week">Last Week</option>
                    <option value="today">Today</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <Filter className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareCreditSourceData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" name="Credits">
                      {prepareCreditSourceData().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Recent Activity
              </h3>
              <div className="flex items-center text-sm text-blue-500">
                <span
                  className="font-medium cursor-pointer"
                  onClick={() => setActiveTab("history")}
                >
                  View All
                </span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            <div className="overflow-hidden">
              {creditHistory.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="flex items-start py-4 border-b border-gray-100 last:border-b-0"
                >
                  <div
                    className={`p-2 rounded-full ${
                      item.amount > 0 ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {item.reason.includes("Like") ? (
                      <Heart
                        className={`h-5 w-5 ${
                          item.amount > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      />
                    ) : item.reason.includes("Share") ? (
                      <Share2
                        className={`h-5 w-5 ${
                          item.amount > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      />
                    ) : item.reason.includes("Comment") ||
                      item.reason.includes("Save") ? (
                      <MessageSquare
                        className={`h-5 w-5 ${
                          item.amount > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      />
                    ) : item.reason.includes("Login") ? (
                      <Calendar
                        className={`h-5 w-5 ${
                          item.amount > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      />
                    ) : item.reason.includes("Profile") ||
                      item.reason.includes("Registration") ? (
                      <Award
                        className={`h-5 w-5 ${
                          item.amount > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      />
                    ) : (
                      <TrendingUp
                        className={`h-5 w-5 ${
                          item.amount > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      />
                    )}
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">
                          {item.reason}
                        </h4>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-400">
                            {formatDate(item.timestamp)}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`font-semibold ${
                          item.amount > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {item.amount > 0 ? "+" : ""}
                        {item.amount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {creditHistory.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No recent activity found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Credit History
            </h3>
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
              >
                <option value="all">All Time</option>
                <option value="month">Last Month</option>
                <option value="week">Last Week</option>
                <option value="today">Today</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Filter className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reason
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date & Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Credits
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredHistory().map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`p-1 rounded-full ${
                            item.amount > 0 ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          {item.reason.includes("Like") ? (
                            <Heart
                              className={`h-4 w-4 ${
                                item.amount > 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            />
                          ) : item.reason.includes("Share") ? (
                            <Share2
                              className={`h-4 w-4 ${
                                item.amount > 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            />
                          ) : item.reason.includes("Comment") ||
                            item.reason.includes("Save") ? (
                            <MessageSquare
                              className={`h-4 w-4 ${
                                item.amount > 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            />
                          ) : item.reason.includes("Login") ? (
                            <Calendar
                              className={`h-4 w-4 ${
                                item.amount > 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            />
                          ) : item.reason.includes("Profile") ||
                            item.reason.includes("Registration") ? (
                            <Award
                              className={`h-4 w-4 ${
                                item.amount > 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            />
                          ) : (
                            <TrendingUp
                              className={`h-4 w-4 ${
                                item.amount > 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            />
                          )}
                        </div>
                        <span className="ml-3 text-sm text-gray-800">
                          {item.reason}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span
                        className={`text-sm font-medium ${
                          item.amount > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {item.amount > 0 ? "+" : ""}
                        {item.amount}
                      </span>
                    </td>
                  </tr>
                ))}

                {getFilteredHistory().length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                      No credit history found for the selected period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "saved" && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Saved Content
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {savedTweets.length > 0 ? (
              savedTweets.map((tweet, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <img
                      src={tweet.avatar || "/default-avatar.png"}
                      alt={tweet.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">
                          {tweet.name}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          @{tweet.username}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-700">{tweet.content}</p>
                      <div className="mt-3 flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{tweet.time || "May 4, 2025"}</span>
                        <div className="mx-2">•</div>
                        <Bookmark className="h-3 w-3 mr-1 text-yellow-500" />
                        <span>Saved</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <Bookmark className="h-12 w-12 mx-auto text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No saved content
                </h3>
                <p className="mt-1 text-gray-500">
                  You haven't saved any content yet.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCreditDashboard;
