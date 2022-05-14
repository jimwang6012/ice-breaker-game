import React, { useContext, useEffect, useRef, useState } from "react";

import { Outlet, useNavigate } from "react-router-dom";
import { Text, ScrollArea, Group } from "@mantine/core";
import { useInputState, useListState } from "@mantine/hooks";
import { createStyles, Avatar } from "@mantine/core";
import { AppContext } from "../AppContextProvider";
import socket from "../Socket";
import { Modal } from "../component/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { RiInformationFill, RiVipCrownFill } from "react-icons/ri";

export default function RoomPageLayout() {
  const navigate = useNavigate();
  const { classes } = useStyles();
  const { roomId } = useContext(AppContext);
  const [show, setShow] = useState(false);
  const hostLeftInfo = "Host has left the room! The room is closed.";
  const returnToHomePrompt = "Return to home";

  // On browser back button click
  const onBackButtonEvent = (e) => {
    e.preventDefault();
    if (window.confirm("Do you want to leave room ?")) {
      socket.disconnect();
      navigate("/home");
    } else {
      window.history.pushState(null, null, window.location.pathname);
    }
  };

  useEffect(() => {
    // When host leave, inform the other players that the room is closed.
    const openModal = () => {
      setShow(true);
    };
    socket.on("room-closed", openModal);

    // Navigate to home page if context is lost, eg. on refresh.
    if (!roomId) {
      navigate("/home");
    }

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", onBackButtonEvent);
    return () => {
      // Clean up
      socket.off("room-closed", openModal);
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, []);

  if (!roomId) {
    return null;
  }

  return (
    <div className={classes.roomPage}>
      {/* This is the section of the room layout that shows the game page and idle page. */}
      <div className={classes.leftSection}>
        <Outlet />
      </div>
      {/* This is the section of the room layout that shows the player list and message list */}
      <div className={classes.rightSection}>
        <PlayerList />
        <MessageList />
      </div>
      {/* Modal component when room closed */}
      <Modal
        show={show}
        pageJump={() => {
          navigate("/home");
        }}
        mainPrompt={hostLeftInfo}
        buttonPrompt={returnToHomePrompt}
        title={
          <div className="pl-[43%] pb-5 text-5xl font-black text-white center text-ice-6">
            <RiInformationFill />
          </div>
        }
      />
    </div>
  );
}

//player list componenet
function PlayerList() {
  const { classes } = useStyles();
  const { handlers, hostId, name, players, colors } = useContext(AppContext);
  const updateGame = (data) => {
    handlers.setState(data.players);
  };
  useEffect(() => {
    socket.on("game-update", updateGame);
    return () => {
      socket.off("game-update", updateGame);
    };
  }, []);

  return (
    <div className={classes.playerList}>
      <Text size="lg" style={{ paddingBottom: 8 }}>
        Players ({players.length})
      </Text>
      <ScrollArea
        scrollbarSize={8}
        offsetScrollbars
        classNames={{
          root: classes.scrollArea,
          scrollbar: classes.scrollbar,
          thumb: classes.thumb,
        }}
      >
        {players.map((p, index) => (
          <PlayerItem
            key={index}
            color={colors[p.colorId]}
            selfName={name}
            playerName={p.name}
            isHost={p.id === hostId}
            isBreaker={p.isBreaker}
            isReady={p.isReady}
          />
        ))}
      </ScrollArea>
    </div>
  );
}

//player list item
function PlayerItem({
  color,
  selfName,
  playerName,
  isHost,
  isBreaker,
  isReady,
}) {
  const { classes } = useStyles();
  return (
    <Group spacing={"xs"} className={classes.playerItem}>
      <FontAwesomeIcon
        className={`text-green-500 ${isReady ? "visible" : "invisible"}`}
        icon={faCheck}
      />
      <Avatar
        src={
          isBreaker
            ? process.env.PUBLIC_URL + "/avatars/seal_down.png"
            : process.env.PUBLIC_URL + "/avatars/p_down_black.png"
        }
        size="md"
        radius="md"
        styles={{
          image: {
            backgroundColor: color ? color : "white",
          },
        }}
      />
      <Text size="xl" weight={500}>
        {playerName === selfName ? playerName + " (Me)" : playerName}
      </Text>
      <div className={isHost ? "visible" : "invisible"}>
        <RiVipCrownFill color="#f4ac3f" />
      </div>
    </Group>
  );
}

//message list componenet
function MessageList() {
  const { classes } = useStyles();
  const [setMessageValue] = useInputState("");
  const [messageList, handlers] = useListState([]);
  const { roomId, name, setIsTyping, players, colors } = useContext(AppContext);

  const receiveMessage = (message) => {
    handlers.append(message);
    scrollToBottom();
  };

  useEffect(() => {
    socket.on("message-to-chat", receiveMessage);
    return () => {
      socket.off("message-to-chat", receiveMessage);
    };
  }, [socket]);

  const sendMessage = (message) => {
    socket.emit("send-message", {
      roomID: roomId,
      chatMessage: name + ": " + message,
    });
  };

  const viewport = useRef();

  // scroll to bottom of the message list
  const scrollToBottom = () =>
    viewport.current.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "smooth",
    });

  return (
    <div className={classes.messageList}>
      {" "}
      <ScrollArea
        id="scroll"
        scrollbarSize={8}
        offsetScrollbars
        classNames={{
          root: classes.scrollArea,
          scrollbar: classes.scrollbar,
          thumb: classes.thumb,
        }}
        viewportRef={viewport}
      >
        {messageList.map((m, index) => {
          if (m.type === "chat") {
            const msgArray = m.value.split(":");
            const msgName = msgArray[0];
            const playerColor = players.filter(
              (player) => player.name === msgName
            )[0].colorId;
            return (
              <MessageItem
                key={index}
                value={m.value}
                colors={colors}
                colorId={playerColor}
              />
            );
          } else if (m.type === "system") {
            return <NotiItem key={index} value={m.value} />;
          }
        })}
      </ScrollArea>
      {/* Text input box */}
      <div className={classes.InputArea}>
        <input
          className={classes.InputField}
          onChange={setMessageValue}
          onFocus={() => {
            setIsTyping(true);
          }}
          onBlur={() => {
            setIsTyping(false);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        ></input>
      </div>
    </div>
  );
}

//System messages
function NotiItem({ value }) {
  const { classes } = useStyles();
  return (
    <Text size="xl" weight={500} className={classes.NotiItem}>
      {value}
    </Text>
  );
}

function MessageItem({ value, colors, colorId }) {
  const { classes } = useStyles();
  let msgColor;
  if (colorId !== null) {
    msgColor = colors[colorId];
  } else {
    msgColor = "#ffffff";
  }
  return (
    <div className="flex flex-row items-start pl-3">
      <div
        className={`w-1 h-4 mt-1 rounded-md`}
        style={{ backgroundColor: msgColor }}
      />
      <Text size="md" className={classes.MessageItem}>
        {value}
      </Text>
    </div>
  );
}

// Create styles using Mantine theme color
const useStyles = createStyles((theme) => ({
  playerList: {
    backgroundColor: theme.colors.ice[6],
    height: "45vh",
    color: "white",
    paddingInline: 10,
  },
  InputArea: {
    backgroundColor: theme.colors.ice[7],
    height: "6vh",
  },
  messageList: {
    "& #scroll": {
      height: "100%",
    },
    backgroundColor: theme.colors.ice[7],
    height: "49vh",
    color: "white",
  },
  roomPage: {
    display: "flex",
  },
  leftSection: {
    width: "68.75%",
    height: "100vh",
  },
  rightSection: {
    width: "31.25%",
    height: "100vh",
  },

  scrollArea: {
    height: "91%",
  },

  scrollbar: {
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  thumb: {
    backgroundColor: theme.colors.ice[2],
    "&:hover": {
      backgroundColor: theme.colors.ice[2],
    },
  },
  playerItem: {
    marginBottom: 8,
  },
  NotiItem: {
    backgroundColor: theme.colors.ice[5],
    paddingInline: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  MessageItem: {
    paddingInline: 3,
    wordBreak: "break-all",
    flex: 1,
    flexWrap: "wrap",
    color: theme.colors.white,
  },
  InputField: {
    backgroundColor: theme.colors.ice[6],
    margin: 8,
    borderRadius: 6,
    paddingInline: 8,
    color: "white",
    width: "96%",
    onKeyDown: "if(event.keyCode==13)",
    type: "text",
    height: "70%",
  },
}));
