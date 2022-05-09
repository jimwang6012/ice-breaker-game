import { NativeSelect } from "@mantine/core";

export function PlayerSelector(props) {
  const dataList = [];
  props.players.map((player) => {
    dataList.push(player.name);
  });
  return (
    <NativeSelect
      data={dataList}
      placeholder="Choose a player"
      label="Seal Team Player"
      description="Choose a player as the Seal"
      defaultValue={props.defaultValue}
      ref={props.breakerRef}
      disabled={props.disabled}
      styles={{
        input: {
          "&:disabled": {
            backgroundColor: "white",
            color: "black",
          },
        },
      }}
    />
  );
}
