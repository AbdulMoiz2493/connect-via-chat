import ChatHeader from "../Components/ChatHeader";
import { SocketContext } from "../../context/socketContext";
import { useContext, useEffect } from "react";
import ChatList from "../Components/ChatList";

export default function Chat() {
  const socket = useContext(SocketContext);

  useEffect(() => {
    const handleConnect = () => {
      console.log("Socket connected with ID:", socket.id);
    };

    const handleError = (error) => {
      console.log("Error in connecting: " + error);
    };

    const handleConnectError = (error) => {
      console.log(error.message);
      socket.disconnect();
    };

    const handleDisconnect = (reason) => {
      console.log(reason);
    };

    socket.on("connect", handleConnect);
    socket.io.on("error", handleError);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);

    // Cleanup socket events on component unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.io.off("error", handleError);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket]);

  return (
    <section className="p-10 font-bold">
      <h1 className="text-2xl">Chat</h1>
      <div className="mt-5">
        <ChatHeader />
        <div>
          <ChatList />
        </div>
      </div>
    </section>
  );
}
