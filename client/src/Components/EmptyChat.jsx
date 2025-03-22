import React from 'react';
import { BsChatDots, BsSearch, BsPersonPlus, BsShieldCheck } from 'react-icons/bs';

const EmptyChat = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="text-center max-w-md transition-all duration-300 hover:transform hover:scale-105">
        <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full shadow-lg">
          <BsChatDots className="text-5xl text-white animate-pulse" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Start Connecting
        </h2>
        
        <p className="text-gray-600 mb-8">
          Select a conversation from the list or create a new chat to begin connecting
        </p>
        
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 transform transition-all duration-300 hover:shadow-lg">
          <h3 className="text-sm font-semibold text-indigo-700 mb-4">Quick Guide</h3>
          <ul className="text-sm text-gray-600 space-y-4">
            <li className="flex items-start">
              <div className="rounded-full p-2 bg-blue-100 mr-3 mt-0">
                <BsPersonPlus className="text-blue-600" />
              </div>
              <span>Select a contact to start chatting instantly</span>
            </li>
            <li className="flex items-start">
              <div className="rounded-full p-2 bg-indigo-100 mr-3 mt-0">
                <BsSearch className="text-indigo-600" />
              </div>
              <span>Find contacts using the search feature</span>
            </li>
            <li className="flex items-start">
              <div className="rounded-full p-2 bg-purple-100 mr-3 mt-0">
                <BsShieldCheck className="text-purple-600" />
              </div>
              <span>Your messages are delivered securely and instantly</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmptyChat;