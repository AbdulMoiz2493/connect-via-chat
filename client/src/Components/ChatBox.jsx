import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import EmptyChat from "./EmptyChat";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoSend, IoPaperPlane } from "react-icons/io5";
import { BiLoaderAlt } from "react-icons/bi";
import { useSelector } from "react-redux";
import { SocketContext } from "../../context/socketContext";
import Avatar from "./Avatar";
import MessageBubble from "./MessageBubble";

export default function ChatBox({
  isChatSelected,
  selectedChat,
  setSelectedChat,
}) {
  const { userDetails } = useSelector((state) => state.user);
  const [messageList, setMessageList] = useState([]);
  const socket = useContext(SocketContext);
  const [messageData, setMessageData] = useState("");
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isEmptyChat, setIsEmptyChat] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const limit = 10;
  const [offset, setOffset] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

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

  const fetchMessages = async (newOffset = 0) => {
    if (!selectedChat || isFetching || !hasMoreMessages) return;
    
    setIsFetching(true);

    try {
      const response = await fetch(`${apiUrl}/api/message/${selectedChat.chatId}?limit=${limit}&offset=${newOffset}`, {
        method: "GET",
        credentials: "include"
      });

      if (!isMounted.current) return; // Check if component is still mounted

      if (response.status !== 200) {
        const error = await response.json();
        console.log(error);
        throw new Error(error);
      }

      const data = await response.json();
      
      // If this is the first fetch and there are no messages, mark as empty chat
      if (newOffset === 0 && data.chatMessages.length === 0) {
        setIsEmptyChat(true);
      } else {
        setIsEmptyChat(false);
      }
      
      if (data.chatMessages.length > 0) {
        setMessageList((prevMessages) => {
          if (newOffset === 0) {
            // If it's the initial load, just set the messages
            return [...data.chatMessages.reverse()];
          } else {
            // Otherwise, append to the beginning
            return [...data.chatMessages.reverse(), ...prevMessages];
          }
        });
        setOffset(newOffset + limit);
      } else {
        setHasMoreMessages(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      if (isMounted.current) {
        setIsFetching(false);
        setIsInitialLoad(false);
      }
    }
  };

  // Reset state and fetch messages when selected chat changes
  useEffect(() => {
    if (selectedChat) {
      setMessageList([]);
      setOffset(0);
      setHasMoreMessages(true);
      setIsInitialLoad(true);
      setIsEmptyChat(false);
      fetchMessages(0);
      
      // Focus the input field when chat changes
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [selectedChat]);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    // Only scroll to bottom on initial load or when we add a new message
    if (messageList.length > 0 && (offset <= limit || !isInitialLoad)) {
      scrollToBottom();
    }
  }, [messageList, offset, isInitialLoad]);

  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop } = messagesContainerRef.current;
      if (scrollTop === 0 && hasMoreMessages && !isFetching) {
        fetchMessages(offset);
      }
    }
  }, [hasMoreMessages, isFetching, offset]);

  useEffect(() => {
    const currentContainer = messagesContainerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  const handleSelectedChat = () => {
    isChatSelected.current = false;
    setSelectedChat(null);
  };

  const handleMessage = (e) => {
    const { value } = e.target;
    setMessageData(value);
  };

  const submitMessage = (e) => {
    e.preventDefault();
    if (selectedChat === null || messageData.trim() === "") {
      return;
    }

    setIsSending(true);

    const newMessage = {
      chatId: selectedChat.chatId,
      members: [userDetails._id, selectedChat._id],
      message: messageData.trim(),
    };

    socket.emit("NEW_MESSAGE", newMessage);
    setMessageData("");
    
    // If this was an empty chat, it's no longer empty
    if (isEmptyChat) {
      setIsEmptyChat(false);
    }
    
    // Simulate network delay for better UX
    setTimeout(() => {
      setIsSending(false);
      inputRef.current?.focus();
    }, 300);
  };

  useEffect(() => {
    const handleNewMessage = (data) => {
      if (isMounted.current) {
        setMessageList((prevList) => [...prevList, data]);
        
        // If this chat was previously empty, now it has messages
        setIsEmptyChat(false);
        
        // Scroll to bottom when new message comes in
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };
    
    socket.on("NEW_MESSAGE", handleNewMessage);

    return () => {
      socket.off("NEW_MESSAGE", handleNewMessage);
    };
  }, [socket]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Enter to send message
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (messageData.trim() !== "") {
          submitMessage(e);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [messageData]);

  return (
    <>
      {selectedChat && isChatSelected ? (
        <div className="flex flex-col h-full bg-gray-50">
          {/* Chat Header with gradient and animations */}
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md rounded-t-lg">
            <IoMdArrowRoundBack
              onClick={handleSelectedChat}
              className="md:hidden text-2xl text-white hover:text-blue-200 cursor-pointer transition-all duration-200 hover:scale-110"
            />
            <Avatar src={selectedChat.image} size="md" status="online" showStatusRing={true} />
            <div className="flex-1">
              <h3 className="font-semibold text-white">{selectedChat.name}</h3>
              <p className="text-xs text-blue-100">{selectedChat.email}</p>
            </div>
          </div>

          {/* Chat Messages with improved styling */}
          <div 
            className="flex-grow overflow-y-auto p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
            ref={messagesContainerRef}
          >
            {isInitialLoad && isFetching ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin text-blue-500 text-3xl">
                  <BiLoaderAlt />
                </div>
              </div>
            ) : (
              <>
                {/* Loading indicator for pagination at top */}
                {isFetching && !isInitialLoad && (
                  <div className="flex justify-center my-2">
                    <div className="animate-spin text-blue-500 text-xl">
                      <BiLoaderAlt />
                    </div>
                  </div>
                )}
                
                {/* Show message content or empty state */}
                {!isFetching && messageList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                      <IoPaperPlane className="text-indigo-500 text-2xl" />
                    </div>
                    <p className="text-indigo-700 font-medium mb-2">No messages yet</p>
                    <p className="text-sm text-gray-500">Send a message to start the conversation</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messageList.map((message, index) => (
                      <MessageBubble
                        key={message.message._id || index}
                        message={message.message}
                        isCurrentUser={message.message.sender === userDetails._id}
                        chatPartner={selectedChat}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Message Input with animations and visual feedback */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg shadow-inner">
            <form 
              className="flex items-center space-x-3"
              onSubmit={submitMessage}
            >
              <input
                ref={inputRef}
                type="text"
                value={messageData}
                onChange={handleMessage}
                className="flex-grow p-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                placeholder="Type your message..."
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={!messageData.trim() || isSending}
                className={`p-3 rounded-full transition-all duration-200 ${
                  messageData.trim() && !isSending
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:scale-105" 
                    : "bg-gray-300 cursor-not-allowed"
                } text-white flex items-center justify-center`}
              >
                {isSending ? (
                  <BiLoaderAlt className="animate-spin" />
                ) : (
                  <IoSend />
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <EmptyChat />
      )}
    </>
  );
}