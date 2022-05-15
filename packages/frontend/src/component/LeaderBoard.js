import { Text, Avatar } from "@mantine/core";
import classNames from "classnames";
import { useContext } from "react";
import { AppContext } from "../AppContextProvider";

export function LeaderBoard({ list, myID }) {
  return (
    <div>
      <div className="mt-5 w-96 h-0.5 bg-white"></div>

      {/* Titles */}
      <div className="flex flex-row pt-2">
        <div className="w-1/4">
          <Text size="xl" color="white" weight={500}>
            Ranking
          </Text>
        </div>
        <div className="w-1/2 flex flex-row justify-center">
          <Text size="xl" color="white" weight={500}>
            Player
          </Text>
        </div>
        <div className="w-1/4  flex flex-row justify-center">
          <Text size="xl" color="white" weight={500}>
            Score
          </Text>
        </div>
      </div>
      <div>
        {list !== undefined ? (
          list.map((p, index) => (
            <RankItem player={p} rank={index + 1} myID={myID} key={index} />
          ))
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

//player list item
function RankItem({ player, rank, myID }) {
  const { colors } = useContext(AppContext);
  const color = colors[player.colorId];
  return (
    <div>
      {/* LeaderBoard */}
      <div
        className={classNames("flex flex-row py-2 my-3", {
          "border-2 border-ice-0 rounded-lg": myID === player.id,
        })}
      >
        <div className="flex flex-row justify-center w-1/4">
          <Text size="xl" weight={500}>
            {rank}.
          </Text>
        </div>
        <div className="flex flex-row justify-center align-middle w-1/2">
          <Avatar
            src={
              player.isBreaker
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

          <div className="pl-2 pt-1 ">{player.name}</div>
        </div>
        <div className="flex flex-row justify-center w-1/4">
          <Text size="xl" weight={500}>
            {player.score}
          </Text>
        </div>
      </div>
    </div>
  );
}
