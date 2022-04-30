import { ScrollArea, Text } from "@mantine/core";
import classNames from "classnames";
import Avatar from "react-avatar";
import "./LeaderBoard.css";

export function LeaderBoard({ list, myID }) {
  return (
    <div>
      <div className="mt-5 w-20% h-0.5 bg-white"></div>

      {/* Titles */}
      <div className="flex flex-row pt-2">
        <div className="flex flex-row justify-around w-1/3">
          <Text size="xl" color="white" weight={500}>
            Ranking.
          </Text>
        </div>
        <div className="flex flex-row justify-around w-2/3">
          <Text size="xl" color="white" weight={500}>
            User.
          </Text>
          <Text size="xl" color="white" weight={500}>
            Score.
          </Text>
        </div>
      </div>
      <div className="wholeBoard">
        {list !== undefined ? (
          list.map((p, index) => (
            <RankItem player={p} rank={index + 1} myID={myID} />
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
  return (
    <div>
      {/* LeaderBoard */}
      <div
        className={classNames("flex flex-row py-2 my-3", {
          "border-dashed border-2 border-ice-0 rounded-lg": myID === player.id,
        })}
      >
        <div className="flex flex-row justify-center w-1/4">
          <Text size="xl" weight={500}>
            {rank}.
          </Text>
        </div>
        <div className="flex flex-row justify-center w-1/2">
          <Avatar size="44" textSizeRatio={2} name={player.name} round />

          <div className="pt-1 username">{player.name}</div>
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
