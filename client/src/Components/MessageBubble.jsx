import { useMemo } from "react";
import Avatar from "./Avatar";

export default function MessageBubble({ message, isCurrentUser, chatPartner }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const formattedTime = useMemo(() => formatTime(message.createdAt), [message.createdAt]);

  if (isCurrentUser) {
    return (
      <div className="flex flex-col items-end space-y-1">
        <div className="flex items-end space-x-2 max-w-[80%]">
          <div className="flex flex-col items-end">
          <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl rounded-br-none shadow-md group-hover:shadow-lg">
              <p className="text-sm">{message.message}</p>
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-500 mr-2">{formattedTime}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start space-y-1">
      <div className="flex items-end space-x-2 max-w-[80%]">
        <Avatar src={chatPartner.image} size="sm" />
        <div className="flex flex-col">
          <span className="text-xs text-gray-600 ml-2 mb-1">{chatPartner.name}</span>
          <div className="px-4 py-3 bg-white text-gray-800 rounded-2xl rounded-bl-none shadow-md group-hover:shadow-lg">
            <p className="text-sm">{message.message}</p>
          </div>
        </div>
      </div>
      <span className="text-xs text-gray-500 ml-10">{formattedTime}</span>
    </div>
  );
}