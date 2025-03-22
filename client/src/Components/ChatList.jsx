import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearchAlt } from "react-icons/bi";
import { IoLogOutOutline } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { useGetChatListQuery } from "../features/api/chatApi";
import { logout } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import ChatBox from "./ChatBox";
import ChatListItem from "./ChatListItem";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export default function ChatList() {
  const { userDetails } = useSelector((state) => state.user);
  const isChatSelected = useRef(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isChangingChat, setIsChangingChat] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isError, error, refetch } = useGetChatListQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Track if component is mounted to avoid state updates after unmounting
  const isMounted = useRef(true);

  useEffect(() => {
    // Set the mounted ref to true
    isMounted.current = true;
    
    // Clean up function to set mounted ref to false when unmounting
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (data && data.chats && isMounted.current) {
      const transformedChatList = data.chats.flatMap((chat) =>
        chat.members
          .filter((user) => user._id !== userDetails._id)
          .map((user) => ({ ...user, chatId: chat._id }))
      );
      setChatList(transformedChatList);
    }
  }, [data, userDetails]);

  useEffect(() => {
    refetch();
  }, [userDetails, refetch]);

  const handleSelectChat = (user) => {
    if (user.chatId === selectedChat?.chatId) return; // No need to reload the same chat
    
    setIsChangingChat(true); // Set loading state
    
    // Don't set selectedChat to null, just directly update to the new chat
    if (isMounted.current) {
      setSelectedChat(user);
      isChatSelected.current = true;
      
      // Force a refresh of the messages by using window.location with a hash
      window.location.hash = `chat-${user.chatId}`;
      
      // Remove the hash after a short delay to keep the URL clean
      setTimeout(() => {
        if (isMounted.current) {
          history.replaceState(null, null, ' ');
          setIsChangingChat(false); // End loading state
        }
      }, 100);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Handle chat cleared callback
  const handleChatCleared = (chatId) => {
    // Update the UI to reflect that the chat has been emptied
    // This could involve updating the lastMessage for the cleared chat
    setChatList(prevChatList => 
      prevChatList.map(user => 
        user.chatId === chatId 
          ? { ...user, lastMessage: null } 
          : user
      )
    );
    
    // If this is the currently selected chat, you might want to refresh the messages display
    if (selectedChat && selectedChat.chatId === chatId) {
      // Force a refresh of the messages
      window.location.hash = `chat-refresh-${Date.now()}`;
      setTimeout(() => {
        if (isMounted.current) {
          history.replaceState(null, null, ' ');
        }
      }, 100);
    }

    // Optional: Show a notification or toast
    console.log("Chat cleared successfully");

    refetch();
  };
  
  // Handle chat deleted callback
  const handleChatDeleted = (chatId) => {
    // Remove the chat from the list
    setChatList(prevChatList => prevChatList.filter(user => user.chatId !== chatId));
    
    // If the deleted chat was selected, clear the selection
    if (selectedChat && selectedChat.chatId === chatId) {
      setSelectedChat(null);
      isChatSelected.current = false;
    }

    // Optional: Show a notification or toast
    console.log("Chat deleted successfully");
    
    // Optionally refetch the chat list from the server to ensure consistency
    refetch();
  };

  const filteredChatList = chatList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row h-[600px] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
      {/* Chat List Section */}
      <div
        className={`bg-white lg:w-[350px] border-r border-gray-200 ${
          isChatSelected.current ? "hidden md:flex md:flex-col" : "flex flex-col"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <FaUserFriends className="text-blue-600 text-xl mr-2" />
            <h2 className="font-bold text-gray-800">Conversations</h2>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
            title="Logout"
          >
            <IoLogOutOutline className="text-xl" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <input
              placeholder="Search conversations..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <BiSearchAlt className="absolute left-3 top-2.5 text-gray-400 text-xl" />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-grow overflow-y-auto">
          {isLoading && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          )}
          
          {isError && (
            <div className="flex flex-col items-center justify-center h-32 p-4">
              <p className="text-red-500 text-center mb-2">{error.data?.message || "Error loading chats"}</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          
          {!isLoading && !isError && filteredChatList.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32">
              <p className="text-gray-500 text-center">No conversations found</p>
              {searchQuery && (
                <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
              )}
            </div>
          )}
          
          {!isLoading &&
            !isError &&
            filteredChatList.map((user) => (
              <ChatListItem
                key={user._id}
                user={user}
                isSelected={selectedChat && selectedChat._id === user._id}
                onClick={() => handleSelectChat(user)}
                lastMessage={user.lastMessage}
                onChatCleared={handleChatCleared}
                onChatDeleted={handleChatDeleted}
              />
            ))}
        </div>
      </div>
      
      {/* Chat Box Section */}
      <div
        className={`flex-grow ${
          isChatSelected.current ? "block" : "hidden md:block"
        }`}
      >
        <ChatBox 
          key={selectedChat ? selectedChat.chatId : 'empty'} // Add key to force re-render
          isChatSelected={isChatSelected} 
          selectedChat={selectedChat}
          isChangingChat={isChangingChat}
          setSelectedChat={setSelectedChat} 
        />
      </div>
    </div>
  );
}