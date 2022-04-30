import React from "react";
import { useListState } from "@mantine/hooks";
import { useState } from "react";

export const AppContext = React.createContext({
  players: [],
  handlers: null,
  isHost: false,
  setIsHost: (isHost) => {},
  roomId: "",
  setRoomId: (roomId) => {},
  name: "",
  setName: (name) => {},
  isTyping: false,
  setIsTyping: (isTyping) => {},
  config: {
    roomSize: 8,
    boardSize: 9,
    roundTime: 60,
    breakTime: 1,
  },
  setConfig: (config) => {},
});

export function AppContextProvider({ children }) {
  // Manage players in the room
  const [players, handlers] = useListState();

  // Whether the player is a host
  const [isHost, setIsHost] = useState(false);

  // The current room id
  const [roomId, setRoomId] = useState("");

  //player name
  const [name, setName] = useState("");

  //game config
  const [config, setConfig] = useState();

  //isChatting
  const [isTyping, setIsTyping] = useState(false);

  const context = {
    players,
    handlers,
    isHost,
    setIsHost,
    roomId,
    setRoomId,
    name,
    setName,
    config,
    setConfig,
    isTyping,
    setIsTyping,
  };

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}
