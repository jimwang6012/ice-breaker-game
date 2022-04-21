import React from "react";
import { useListState } from "@mantine/hooks";
import { useState } from "react";

export const AppContext = React.createContext({});

export function AppContextProvider({ children }) {
  // Manage players in the room
  const [players, handlers] = useListState();

  // Whether the player is a host
  const [isHost, setIsHost] = useState(false);

  // The current room id
  const [roomId, setRoomId] = useState("");

  //player name
  const [name, setName] = useState("");

  const context = {
    players,
    handlers,
    isHost,
    setIsHost,
    roomId,
    setRoomId,
    name,
    setName,
  };

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}
