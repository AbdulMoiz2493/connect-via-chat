import { useState, useEffect, useRef } from "react";
import { useGetUsersListQuery } from "../features/api/chatApi";
import { useSelector } from "react-redux";
import { IoMdSearch, IoMdClose, IoMdPerson, IoMdChatbubbles } from "react-icons/io";

export default function ChatHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const searchRef = useRef(null);
  const modalRef = useRef(null);
  const { data } = useGetUsersListQuery({ refetchOnMountOrArgChange: true });
  const { userDetails } = useSelector(state => state.user);
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    if (data && data.users) {
      setFilteredUsers(data.users);
    }
  }, [data]);

  useEffect(() => {
    if (data && data.users && searchTerm) {
      const filtered = data.users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else if (data && data.users) {
      setFilteredUsers(data.users);
    }
  }, [searchTerm, data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  const toggleModal = async () => {
    setIsModalOpen(!isModalOpen);
    setSearchTerm("");
    if (!isModalOpen && searchRef.current) {
      setTimeout(() => {
        searchRef.current.focus();
      }, 100);
    }
  };

  const handleCreateChat = async(memberId) => {
    const members = [userDetails._id, memberId];
    if(members.length !== 2) {
      alert("At least 2 members should be present.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/chat/create`,  {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(members),
      });

      if(response.status === 400){
        const error = await response.json();
        console.log(error);
        return;
      }

      const data = await response.json();
      console.log("Chat Created Successfully: ", data);
      setIsModalOpen(false);

    } catch(err){
      console.log(err);
      return;
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="w-full bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 flex items-center">
            <IoMdChatbubbles className="mr-2 text-blue-600" /> 
            ChatConnect
          </h1>
          <button
            onClick={toggleModal}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full px-4 py-2 text-sm transition-all duration-200 shadow-md hover:shadow-lg"
            type="button"
          >
            <IoMdPerson className="mr-1" />
            New Chat
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        >
          <div 
            ref={modalRef}
            className="relative p-4 w-full max-w-md max-h-[90vh] mx-4 bg-white rounded-xl shadow-2xl transition-all duration-300 transform animate-modal-appear"
          >
            <div className="relative bg-white rounded-xl overflow-hidden">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <IoMdPerson className="mr-2 text-blue-600" />
                  Select User to Chat
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full p-2 transition-colors"
                  onClick={toggleModal}
                >
                  <IoMdClose className="w-5 h-5" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              
              {/* Search input */}
              <div className="p-4 border-b">
                <div className="relative">
                  <input
                    ref={searchRef}
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              {/* Modal body */}
              <div className="max-h-[50vh] overflow-y-auto">
                <ul className="divide-y divide-gray-200">
                  {filteredUsers && filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <li 
                        key={user._id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="flex items-center p-4">
                          <div className="flex-shrink-0">
                            <img
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                              src={user.image}
                              alt={`${user.name}'s profile`}
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                          </div>
                          <button 
                            onClick={() => handleCreateChat(user._id)} 
                            className="ml-4 inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors duration-200"
                          >
                            <IoMdChatbubbles className="mr-1" />
                            Chat
                          </button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10">
                      <div className="bg-gray-100 rounded-full p-4 mb-4">
                        <IoMdSearch className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-center">No users found</p>
                    </div>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}