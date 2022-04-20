import React from "react";
import { Outlet } from "react-router-dom";
import { Text, ScrollArea, Group, ColorPicker } from "@mantine/core";
import { createStyles } from "@mantine/core";
import Avatar from "react-avatar";

export default function RoomPageLayout() {
  const { classes } = useStyles();
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
        <InputArea />
      </div>
    </div>
  );
}

//player list componenet
function PlayerList() {
  const { classes } = useStyles();
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
        <PlayerItem></PlayerItem>
        <PlayerItem></PlayerItem>
        <PlayerItem></PlayerItem>
        <PlayerItem></PlayerItem>
        <PlayerItem></PlayerItem>
        <PlayerItem></PlayerItem>
        <PlayerItem></PlayerItem>
        <PlayerItem></PlayerItem>
        <PlayerItem></PlayerItem>
        <PlayerItem></PlayerItem>
        <PlayerItem></PlayerItem>
        <PlayerItem></PlayerItem>
      </ScrollArea>
    </div>
  );
}

//player list item
function PlayerItem() {
  const { classes } = useStyles();
  return (
    <Group spacing={"xs"} className={classes.playerItem}>
      <Avatar size="44" textSizeRatio={2} name="Dylan Xin" round />
      <Text size="xl" weight={500}>
        Dylan Xin
      </Text>
    </Group>
  );
}
function InputArea() {
  const { classes } = useStyles();
  return (
    <div className={classes.InputArea}>
      <InputField></InputField>
    </div>
  );
}
//message list componenet
function MessageList() {
  const { classes } = useStyles();
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
      >
        <NotiItem></NotiItem>
        <NotiItem></NotiItem>
        <NotiItem></NotiItem>
        <NotiItem></NotiItem>
        <MessageHead></MessageHead>
        <MessageContent></MessageContent>
        <MessageContent></MessageContent>
        <MessageContent></MessageContent>
        <NotiItem></NotiItem>
        <MessageHead></MessageHead>
        <MessageContent></MessageContent>
        <MessageContent></MessageContent>
        <MessageContent></MessageContent>
        <MessageHead></MessageHead>
        <MessageContent></MessageContent>
        <MessageContent></MessageContent>
        <MessageContent></MessageContent>
        <NotiItem></NotiItem>
      </ScrollArea>
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
function MessageContent() {
  const { classes } = useStyles();
  return (
    <Group className={classes.MessageHead}>
      <Text size="md">Rnm, tuiqian.</Text>
    </Group>
  );
}

function AddMessage(message) {}

function InputField() {
  const { classes } = useStyles();
  return <input className={classes.InputField}></input>;
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
