import React from "react";

export default function TweetFeedHeader() {
  return (
    <div className="flex flex-col items-center pb-4 bg-gray-50 w-full">
      <h1 className="text-4xl font-bold text-black mb-4">Hustle Feed</h1>
      <p className="text-gray-700 text-lg mb-6">
        Discover trending tweets and earn credits by engaging with content you
        love!
      </p>
      <div className="flex items-center space-x-2 text-gray-600">
        <button className="hover:text-blue-500 transition-colors">Like</button>
        <span className="text-green-500">+2</span>
        <span className="text-gray-500">•</span>
        <button className="hover:text-blue-500 transition-colors">
          UnLike
        </button>
        <span className="text-red-500">-2</span>
        <span className="text-gray-500">•</span>
        <button className="hover:text-blue-500 transition-colors">Share</button>
        <span className="text-green-500">+5</span>
        <span className="text-gray-500">•</span>

        <button className="hover:text-blue-500 transition-colors">Save</button>
        <span className="text-green-500">+1</span>
        <button className="hover:text-blue-500 transition-colors">
          UnSave
        </button>
        <span className="text-gray-500">•</span>
        <span className="text-red-500">-1</span>
      </div>
    </div>
  );
}
