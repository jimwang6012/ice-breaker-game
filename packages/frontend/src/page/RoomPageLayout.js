import React, { useContext, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Text, ScrollArea, Group, TextInput } from "@mantine/core";
import { useInputState, useListState } from "@mantine/hooks";
import { createStyles } from "@mantine/core";
import Avatar from "react-avatar";
import { AppContext } from "../AppContextProvider";
import socket from "../Socket";
import { Modal } from "../component/Modal";
export default function RoomPageLayout() {
  const { classes } = useStyles();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const openModal = () => {
      setShow(true);
    };
    socket.on("room-closed", openModal);
    return () => {
      // Clean up
      socket.off("room-closed", openModal);
    };
  }, []);
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
      <Modal show={show} />
    </div>
  );
}

//player list componenet
function PlayerList() {
  const { classes } = useStyles();
  const { handlers, players } = useContext(AppContext);
  useEffect(() => {
    socket.on("game-update", (data) => {
      console.log(data.players);
      handlers.setState(data.players);
    });
  }, []);

  return (
    <div className={classes.playerList}>
      <Text size="lg" style={{ paddingBottom: 5 }}>
        Players (6)
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
          <PlayerItem key={index} name={p.name} />
        ))}
      </ScrollArea>
    </div>
  );
}

//player list item
function PlayerItem({ name }) {
  const { classes } = useStyles();
  return (
    <Group spacing={"xs"} className={classes.playerItem}>
      <Avatar size="44" textSizeRatio={2} name={name} round />
      <Text size="xl" weight={500}>
        {name}
      </Text>
    </Group>
  );
}

//message list componenet
function MessageList() {
  const { classes } = useStyles();
  const [messageValue, setMessageValue] = useInputState("");
  const [messageList, handlers] = useListState([]);
  const { roomId, name } = useContext(AppContext);

  useEffect(() => {
    socket.on("message-to-chat", (chatMessage) => {
      handlers.append(chatMessage);
      scrollToBottom();
    });
  }, [socket]);

  const sendMessage = (message) => {
    socket.emit("send-message", {
      roomID: roomId,
      chatMessage: name + ": " + message,
    });
  };

  const viewport = useRef();

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
        }}
        viewportRef={viewport}
      >
        {messageList.map((m, index) => (
          <MessageContent key={index} value={m} />
        ))}
      </ScrollArea>
      {/* Text input box */}
      <div className={classes.InputArea}>
        <input
          className={classes.InputField}
          onChange={setMessageValue}
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

function NotiItem() {
  const { classes } = useStyles();
  return (
    <Group className={classes.NotiItem}>
      <Text size="xl" weight={500}>
        Jeff Peng joined the room.
      </Text>
    </Group>
  );
}
function MessageHead() {
  const { classes } = useStyles();
  return (
    <Group className={classes.MessageHead}>
      <Text size="md">Owen Wang:</Text>
    </Group>
  );
}
function MessageContent({ value }) {
  const { classes } = useStyles();
  return (
    <Group className={classes.MessageHead}>
      <Text size="md">{value}</Text>
    </Group>
  );
}

// Create styles using Mantine theme color
const useStyles = createStyles((theme) => ({
  playerList: {
    backgroundColor: theme.colors.ice[6],
    height: "45vh",
    color: "white",
    paddingLeft: 30,
    paddingRight: 5,
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

    marginBottom: 5,
  },
  MessageHead: {
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
