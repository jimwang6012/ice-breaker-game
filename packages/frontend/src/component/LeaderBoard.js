import { Text, Avatar } from "@mantine/core";
import classNames from "classnames";
import { useContext } from "react";
import { AppContext } from "../AppContextProvider";
import "./LeaderBoard.css";

export function LeaderBoard({ list, myID }) {
  return (
    <div>
      <div className="mt-5 w-full h-0.5 bg-white"></div>

      {/* Titles */}
      <div className="flex flex-row pt-2">
        <div className="flex flex-row justify-around w-1/3">
          <Text size="xl" color="white" weight={500}>
            Ranking
          </Text>
        </div>
        <div className="flex flex-row justify-around w-2/3">
          <Text size="xl" color="white" weight={500}>
            Player
          </Text>
          <Text size="xl" color="white" weight={500}>
            Score
          </Text>
        </div>
      </div>
      <div className="wholeBoard">
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
        <div className="flex flex-row justify-center w-1/2 ml-5">
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

          <div className="pt-1 username">{player.name}</div>
        </div>
        <div className="flex flex-row justify-center w-1/4">
          <Text size="xl" weight={500} className="mr-10">
            {player.score}
          </Text>
        </div>
      </div>
    </div>
  );
}
