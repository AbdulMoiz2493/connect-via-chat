import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCamera, FaUserCircle, FaEnvelope, FaLock, FaTrash, FaSave, FaTimes, FaEdit, FaShieldAlt } from "react-icons/fa";
import { logout, updateProfile } from "../features/user/userSlice.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../Auth_Components/firebase.js";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);
  const [newImageUrl, setNewImageUrl] = useState(undefined);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [formData, setFormData] = useState({
    name: userDetails?.name || "",
    email: userDetails?.email || "",
    oldPassword: "",
    newPassword: "",
    imageUrl: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();
  
  // For UI animations
  const [fadeIn, setFadeIn] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [profileCardHover, setProfileCardHover] = useState(false);
  
  useEffect(() => {
    setFadeIn(true);
    // Add smooth page entrance animation
    const timer = setTimeout(() => {
      document.querySelector('.profile-card')?.classList.add('profile-card-loaded');
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPEG or PNG image file", {
        position: "top-right",
        transition: Slide,
        hideProgressBar: false,
      });
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB", {
        position: "top-right",
        transition: Slide,
        hideProgressBar: false,
      });
      return;
    }
    
    const storage = getStorage(app);
    const fileName = `profile_${userDetails._id}_${new Date().getTime()}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      (error) => {
        toast.error(`Upload failed: ${error.message}`, {
          position: "top-right",
          transition: Slide,
        });
        setUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setNewImageUrl(downloadURL);
          setFormData((prevFormData) => ({
            ...prevFormData,
            imageUrl: downloadURL
          }));
          toast.success("Profile picture updated successfully", {
            position: "top-right",
            transition: Slide,
            icon: "🎉",
          });
          setUploadProgress(null);
          setIsEditing(true); // Auto-enable editing mode after photo update
        });
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const { name, email, oldPassword, newPassword, imageUrl } = formData;

    if (!name || !email) {
      toast.error("Name and email are required", {
        position: "top-right",
        transition: Slide,
      });
      return;
    }

    const dataToUpdate = {
      name,
      email,
      oldPassword: undefined,
      newPassword: undefined,
      imageUrl: imageUrl === "" ? undefined : imageUrl
    };

    if (oldPassword || newPassword) {
      if (!oldPassword || !newPassword) {
        toast.error("Please provide both current and new passwords or leave both empty", {
          position: "top-right",
          transition: Slide,
        });
        return;
      } else {
        dataToUpdate.oldPassword = oldPassword;
        dataToUpdate.newPassword = newPassword;
      }
    }

    try {
      const response = await fetch(`${apiUrl}/api/user/update/${userDetails._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToUpdate)
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message, {
          position: "top-right",
          transition: Slide,
        });
        return;
      }

      const data = await response.json();
      dispatch(updateProfile(data.userDetails));
      toast.success("Profile updated successfully", {
        position: "top-right",
        transition: Slide,
        icon: "🎉",
      });
      setIsEditing(false);
      
      // Clear password fields after successful update
      setFormData(prev => ({
        ...prev,
        oldPassword: "",
        newPassword: ""
      }));

    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again later", {
        position: "top-right",
        transition: Slide,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: userDetails?.name || "",
      email: userDetails?.email || "",
      oldPassword: "",
      newPassword: "",
      imageUrl: ""
    });
    setNewImageUrl(undefined);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/user/delete/${userDetails._id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message, {
          position: "top-right",
          transition: Slide,
        });
        return;
      }

      const data = await response.json();
      toast.success(data.message, {
        position: "top-right",
        transition: Slide,
      });
      dispatch(logout());
      navigate("/");

    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again later", {
        position: "top-right",
        transition: Slide,
      });
    }
    setDeleteModalOpen(false);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className={`max-w-4xl mx-auto transition-all duration-700 ease-out transform ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div 
          className="profile-card bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform"
          onMouseEnter={() => setProfileCardHover(true)}
          onMouseLeave={() => setProfileCardHover(false)}
          style={{
            boxShadow: profileCardHover ? 
              '0 25px 50px -12px rgba(79, 70, 229, 0.25)' : 
              '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* Header with animated gradient */}
          <div 
            className="relative px-6 py-8 text-white overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 50%, #3b82f6 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientAnimation 10s ease infinite',
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-0 left-0 w-20 h-20 rounded-full bg-white opacity-10 transform translate-x-12 translate-y-16"></div>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white opacity-10 transform -translate-x-10 translate-y-10"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white opacity-10 transform -translate-y-20 -translate-x-20"></div>
            </div>
            
            <div className="relative z-10 flex items-center">
              <div className="group relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md transition-transform duration-300 transform group-hover:scale-105">
                  <div className="w-full h-full relative">
                    <img
                      className="w-full h-full object-cover"
                      src={newImageUrl !== undefined ? newImageUrl : userDetails?.image || "https://via.placeholder.com/200?text=User"}
                      alt="Profile"
                    />
                    <div 
                      onClick={() => inputRef.current.click()}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300"
                    >
                      <FaCamera className="text-2xl text-white" />
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => inputRef.current.click()}>
                  <FaEdit className="text-indigo-600" size={14} />
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  name="avatar"
                  ref={inputRef}
                  onChange={handleImage}
                  className="hidden"
                />
              </div>

              <div className="ml-6">
                <h1 className="text-2xl font-bold tracking-tight">{userDetails?.name || "User"}</h1>
                <p className="text-indigo-100 mt-1 flex items-center">
                  <FaEnvelope className="mr-2" size={14} />
                  {userDetails?.email || "email@example.com"}
                </p>
                {uploadProgress !== null && (
                  <div className="mt-3">
                    <div className="w-full bg-indigo-200 bg-opacity-30 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <p className="text-xs mt-1 text-indigo-100">{uploadProgress}% uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-gray-50 px-6 pt-2">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('personal')}
                className={`px-4 py-3 font-medium text-sm flex items-center transition-all duration-200 ${activeTab === 'personal' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-indigo-600'}`}
              >
                <FaUserCircle className={`mr-2 ${activeTab === 'personal' ? 'text-indigo-600' : 'text-gray-400'}`} />
                Personal Info
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-3 font-medium text-sm flex items-center transition-all duration-200 ${activeTab === 'security' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-indigo-600'}`}
              >
                <FaShieldAlt className={`mr-2 ${activeTab === 'security' ? 'text-indigo-600' : 'text-gray-400'}`} />
                Security
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form className="space-y-6">
              {/* Personal Information Tab */}
              <div className={`transition-all duration-500 transform ${activeTab === 'personal' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 absolute'}`}>
                {activeTab === 'personal' && (
                  <div className="space-y-6">
                    <div className="transition-all duration-300" style={{transitionDelay: '100ms'}}>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUserCircle className={`${isEditing ? 'text-indigo-400' : 'text-gray-400'} transition-colors duration-200`} />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          onChange={handleChange}
                          value={formData.name}
                          disabled={!isEditing}
                          className={`block w-full pl-10 pr-3 py-2 border ${isEditing ? 'border-indigo-300 ring-1 ring-indigo-300' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 ${!isEditing && 'bg-gray-50'}`}
                        />
                      </div>
                    </div>

                    <div className="transition-all duration-300" style={{transitionDelay: '200ms'}}>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className={`${isEditing ? 'text-indigo-400' : 'text-gray-400'} transition-colors duration-200`} />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          onChange={handleChange}
                          value={formData.email}
                          disabled={!isEditing}
                          className={`block w-full pl-10 pr-3 py-2 border ${isEditing ? 'border-indigo-300 ring-1 ring-indigo-300' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 ${!isEditing && 'bg-gray-50'}`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Security Tab */}
              <div className={`transition-all duration-500 transform ${activeTab === 'security' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 absolute'}`}>
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="transition-all duration-300" style={{transitionDelay: '100ms'}}>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="oldPassword">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className={`${isEditing ? 'text-indigo-400' : 'text-gray-400'} transition-colors duration-200`} />
                        </div>
                        <input
                          id="oldPassword"
                          name="oldPassword"
                          type="password"
                          onChange={handleChange}
                          value={formData.oldPassword}
                          disabled={!isEditing}
                          className={`block w-full pl-10 pr-3 py-2 border ${isEditing ? 'border-indigo-300 ring-1 ring-indigo-300' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 ${!isEditing && 'bg-gray-50'}`}
                        />
                      </div>
                    </div>

                    <div className="transition-all duration-300" style={{transitionDelay: '200ms'}}>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="newPassword">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className={`${isEditing ? 'text-indigo-400' : 'text-gray-400'} transition-colors duration-200`} />
                        </div>
                        <input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          onChange={handleChange}
                          value={formData.newPassword}
                          disabled={!isEditing}
                          className={`block w-full pl-10 pr-3 py-2 border ${isEditing ? 'border-indigo-300 ring-1 ring-indigo-300' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 ${!isEditing && 'bg-gray-50'}`}
                        />
                      </div>
                      {isEditing && (
                        <p className="mt-1 text-xs text-gray-500">
                          Password should be at least 8 characters long and include a mix of letters, numbers, and symbols.
                        </p>
                      )}
                    </div>

                    <div className="pt-6 mt-6 border-t border-gray-200 transition-all duration-300" style={{transitionDelay: '300ms'}}>
                      <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                        <h3 className="text-sm font-medium text-red-800 mb-3 flex items-center">
                          <FaTrash className="mr-2" /> Danger Zone
                        </h3>
                        <button
                          onClick={() => setDeleteModalOpen(true)}
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 transform hover:scale-105"
                        >
                          <FaTrash className="mr-2" /> Delete Account
                        </button>
                        <p className="mt-2 text-xs text-red-700">
                          Permanently delete your account and all of your data. This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <FaEdit className="mr-2" /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      <FaTimes className="mr-2" /> Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={handleUpdateUser}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <FaSave className="mr-2" /> Save Changes
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={() => setDeleteModalOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-modal-in">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaTrash className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Account</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete your account? All of your data will be permanently
                        removed. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gradientAnimation {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        
        .profile-card {
          opacity: 0;
          transform: translateY(20px);
        }
        
        .profile-card-loaded {
          opacity: 1;
          transform: translateY(0);
        }
        
        .animate-modal-in {
          animation: modalIn 0.3s ease-out forwards;
        }
        
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </section>
  );
}