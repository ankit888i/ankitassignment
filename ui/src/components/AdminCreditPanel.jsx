import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrlUser } from "../ApiUrl";

export default function AdminCreditPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [creditAmount, setCreditAmount] = useState(0);
  const [creditReason, setCreditReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Analytics data states
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    averageCredits: 0,
    mostActiveUsers: [],
    creditDistribution: {
      low: 0, // 0-10 credits
      medium: 0, // 11-50 credits
      high: 0, // 51+ credits
    },
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/login");
      return;
    }

    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrlUser}fetch`);
      setUsers(response.data);
      calculateAnalytics(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.", err);
      setLoading(false);
    }
  };

  const calculateAnalytics = (userData) => {
    const totalUsers = userData.length;

    const totalCredits = userData.reduce(
      (sum, user) => sum + (user.credits || 0),
      0
    );
    const averageCredits =
      totalUsers > 0 ? (totalCredits / totalUsers).toFixed(1) : 0;

    const creditDistribution = {
      low: userData.filter((user) => (user.credits || 0) <= 10).length,
      medium: userData.filter(
        (user) => (user.credits || 0) > 10 && (user.credits || 0) <= 50
      ).length,
      high: userData.filter((user) => (user.credits || 0) > 50).length,
    };

    const sortedByActivity = [...userData].sort((a, b) => {
      const aActivity =
        (a.interactions?.likes || 0) +
        (a.interactions?.shares || 0) +
        (a.interactions?.comments || 0);
      const bActivity =
        (b.interactions?.likes || 0) +
        (b.interactions?.shares || 0) +
        (b.interactions?.comments || 0);
      return bActivity - aActivity;
    });

    const mostActiveUsers = sortedByActivity.slice(0, 5);

    setAnalytics({
      totalUsers,
      averageCredits,
      mostActiveUsers,
      creditDistribution,
    });
  };

  const handleAdjustCredits = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${apiUrlUser}update-credits`,
        {
          userId: selectedUser._id,
          amount: parseInt(creditAmount, 10),
          reason: creditReason || "Manual adjustment by admin",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(`Successfully adjusted credits for ${selectedUser.name}`);
      setCreditAmount(0);
      setCreditReason("");
      setSelectedUser(null);

      fetchUsers();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to adjust credits");

      // Clear error message after 3 seconds
      setTimeout(() => setError(""), 3000);
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
  };

  const filteredUsers = users.filter((user) => {
    // First apply search term filter
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    // Then apply credit filter
    if (!matchesSearch) return false;

    switch (filterOption) {
      case "low":
        return (user.credits || 0) <= 10;
      case "medium":
        return (user.credits || 0) > 10 && (user.credits || 0) <= 50;
      case "high":
        return (user.credits || 0) > 50;
      default:
        return true;
    }
  });

  const getUserActivity = (user) => {
    return (
      (user.interactions?.likes || 0) +
      (user.interactions?.shares || 0) +
      (user.interactions?.comments || 0)
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Admin Credit Management Panel
      </h1>

      {/* Analytics Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          User Analytics Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Users Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {analytics.totalUsers}
            </p>
          </div>

          {/* Average Credits Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">
              Average Credits Per User
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {analytics.averageCredits}
            </p>
          </div>

          {/* Credit Distribution Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">
              Credit Distribution
            </h3>
            <div className="flex items-center mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-red-500 h-2.5 rounded-full"
                  style={{
                    width: `${
                      (analytics.creditDistribution.low /
                        analytics.totalUsers) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <span className="ml-2 text-xs text-gray-500">
                {analytics.creditDistribution.low} users
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">0-10 credits (Low)</p>

            <div className="flex items-center mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-yellow-500 h-2.5 rounded-full"
                  style={{
                    width: `${
                      (analytics.creditDistribution.medium /
                        analytics.totalUsers) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <span className="ml-2 text-xs text-gray-500">
                {analytics.creditDistribution.medium} users
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">11-50 credits (Medium)</p>

            <div className="flex items-center mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{
                    width: `${
                      (analytics.creditDistribution.high /
                        analytics.totalUsers) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <span className="ml-2 text-xs text-gray-500">
                {analytics.creditDistribution.high} users
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">51+ credits (High)</p>
          </div>
        </div>
      </div>

      {/* Most Active Users */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Most Active Users
        </h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Likes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shares
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Activity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.mostActiveUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user.interactions?.likes || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user.interactions?.shares || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user.interactions?.comments || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getUserActivity(user)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User List and Credit Management */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User List */}
        <div className="md:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-medium text-gray-700 mb-4">
              User Management
            </h2>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterOption}
                  onChange={(e) => setFilterOption(e.target.value)}
                >
                  <option value="all">All Credits</option>
                  <option value="low">Low Credits (0-10)</option>
                  <option value="medium">Medium Credits (11-50)</option>
                  <option value="high">High Credits (51+)</option>
                </select>
              </div>
            </div>

            {/* Error or Success Messages */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            {/* User Table */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credits
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profile Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            {user.credits || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.profileCompleted ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Complete
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Incomplete
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {getUserActivity(user)} actions
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => viewUserDetails(user)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Credit Adjustment Panel */}
        <div className="md:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-medium text-gray-700 mb-4">
              Adjust Credits
            </h2>

            {selectedUser ? (
              <div>
                <div className="mb-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium text-gray-700">Selected User</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Name: {selectedUser.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: {selectedUser.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    Current Credits: {selectedUser.credits || 0}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Credit Adjustment (use negative to deduct)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter amount"
                        value={creditAmount}
                        onChange={(e) => setCreditAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Reason
                    </label>
                    <div className="mt-1">
                      <textarea
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Reason for adjustment"
                        rows="3"
                        value={creditReason}
                        onChange={(e) => setCreditReason(e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleAdjustCredits}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Apply Adjustment
                    </button>

                    <button
                      onClick={() => setSelectedUser(null)}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">
                  Select a user from the list to adjust their credits
                </p>
              </div>
            )}

            {/* Credit History */}
            {selectedUser &&
              selectedUser.creditHistory &&
              selectedUser.creditHistory.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Credit History
                  </h3>
                  <div className="max-h-64 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                      {selectedUser.creditHistory.map((entry, index) => (
                        <li key={index} className="py-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {entry.amount > 0
                                  ? `+${entry.amount}`
                                  : entry.amount}
                              </p>
                              <p className="text-sm text-gray-500">
                                {entry.reason}
                              </p>
                            </div>
                            <p className="text-xs text-gray-400">
                              {new Date(entry.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
