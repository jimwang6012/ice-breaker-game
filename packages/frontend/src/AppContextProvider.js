import React from "react";
import { useListState } from "@mantine/hooks";
import { useState } from "react";
import useAudio from "./hook/useAudio";

export const AppContext = React.createContext({
  players: [],
  handlers: null,
  isHost: false,
  setIsHost: (isHost) => {},
  roomId: "",
  setRoomId: (roomId) => {},
  hostId: "",
  setHostId: (hostId) => {},
  name: "",
  setName: (name) => {},
  isTyping: false,
  setIsTyping: (isTyping) => {},
  config: {
    roomSize: 8,
    boardSize: 9,
    roundTime: 30,
    breakTime: 0.5,
  },
  setConfig: (config) => {},
  colors: [],
  setColors: (colors) => {},
  colorStatus: [],
  setColorStatus: (colorStatus) => {},
  playing: true,
  toggle: () => {},
  stop: () => {},
});

export function AppContextProvider({ children }) {
  // Manage players in the room
  const [players, handlers] = useListState();

  // Whether the player is a host
  const [isHost, setIsHost] = useState(false);

  // The current room id
  const [roomId, setRoomId] = useState("");

  // The host's id
  const [hostId, setHostId] = useState("");

  //player name
  const [name, setName] = useState("");

  //game config
  const [config, setConfig] = useState({
    roomSize: 8,
    boardSize: 9,
    roundTime: 30,
    breakTime: 0.5,
  });

  //player colors
  const [colors, setColors] = useState([]);

  //player color status
  const [colorStatus, setColorStatus] = useState([]);

  //isChatting
  const [isTyping, setIsTyping] = useState(false);

  const { playing, toggle, stop } = useAudio("../music/music2.ogg");

  const context = {
    players,
    handlers,
    isHost,
    setIsHost,
    roomId,
    setRoomId,
    hostId,
    setHostId,
    name,
    setName,
    config,
    setConfig,
    colors,
    setColors,
    colorStatus,
    setColorStatus,
    isTyping,
    setIsTyping,
    playing,
    toggle,
    stop,
  };

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}
