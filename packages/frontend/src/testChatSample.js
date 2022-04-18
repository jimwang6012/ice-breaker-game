import { useEffect, useState } from "react";

export default function TestChatSample({ roomID, socket }) {
  const [receive, setReceieve] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("message-to-chat", (chatMessage) => {
      setReceieve(receive + "\n" + chatMessage);
    });
  }, [receive, socket]);

  const sentMessage = () => {
    socket.emit("send-message", { roomID, chatMessage: message });
  };

  return (
    <>
      <div>
        <span>message: {receive}</span>
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button
          className="px-6 py-3 text-xl font-semibold text-white rounded-lg bg-ice-6 hover:bg-ice-5"
          onClick={sentMessage}
        >
          sentMessage
        </button>
      </div>
      <hr />
    </>
  );
}
