import React, { useState, useRef, useEffect } from 'react';
import Avatar from "./Avatar";
const apiUrl = import.meta.env.VITE_APP_API_URL;

export default function ChatListItem({ 
  user, 
  isSelected, 
  onClick, 
  lastMessage = null, 
  onChatCleared, 
  onChatDeleted 
}) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const contextMenuRef = useRef(null);
  
  // Format time for last message
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time
      return new Intl.DateTimeFormat('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }).format(messageDate);
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(messageDate);
    } else {
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(messageDate);
    }
  };

  // Placeholder message and time if none provided
  const messageText = lastMessage?.text;
  const messageTime = formatTime(lastMessage?.timestamp);
  const hasUnread = lastMessage?.unread || false;

  // Handle right click to show context menu
  const handleRightClick = (e) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  // Handle clear chat action
  const handleClearChat = async (e) => {
    e.stopPropagation(); // Prevent triggering onClick of parent
    
    try {
      const response = await fetch(`${apiUrl}/api/chat/empty/${user.chatId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        // Call the callback to update parent state
        if (onChatCleared) {
          onChatCleared(user.chatId);
        }
        console.log("Chat cleared successfully");
      } else {
        console.error("Failed to clear chat");
      }
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
    
    setShowContextMenu(false);
  };

  // Handle delete chat action
  const handleDeleteChat = async (e) => {
    e.stopPropagation(); // Prevent triggering onClick of parent
    
    try {
      const response = await fetch(`${apiUrl}/api/chat/delete/${user.chatId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        // Call the callback to update parent state
        if (onChatDeleted) {
          onChatDeleted(user.chatId);
        }
        console.log("Chat deleted successfully");
      } else {
        console.error("Failed to delete chat");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
    
    setShowContextMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    // Close menu on page scroll
    const handleScroll = () => {
      setShowContextMenu(false);
    };
    
    document.addEventListener("scroll", handleScroll);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`flex items-center p-3 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? "bg-blue-50 border-l-4 border-blue-500 shadow-sm" 
          : "hover:bg-gray-50 border-l-4 border-transparent hover:translate-x-1"
      }`}
      onClick={onClick}
      onContextMenu={handleRightClick}
    >
      <Avatar 
        src={user.image} 
        size="md" 
        status={user.status || "online"} 
        showStatusRing={isSelected}
      />
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
          {messageTime && <span className="text-xs text-gray-500">{messageTime}</span>}
        </div>
        <div className="flex items-center">
          <p className={`text-sm truncate ${hasUnread ? "text-gray-900 font-medium" : "text-gray-500"}`}>
            {messageText}
          </p>
          
          {hasUnread && (
            <span className="ml-2 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
          )}
        </div>
      </div>
      
      {/* Context Menu */}
      {showContextMenu && (
        <div 
          ref={contextMenuRef}
          className="absolute bg-white shadow-lg rounded-md py-1 z-50"
          style={{ 
            top: `${contextMenuPos.y}px`, 
            left: `${contextMenuPos.x}px`,
            minWidth: "150px"
          }}
        >
          <button 
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            onClick={handleClearChat}
          >
            Clear Chat
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleDeleteChat}
          >
            Delete Chat
          </button>
        </div>
      )}
    </div>
  );
}