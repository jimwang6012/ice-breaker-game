import React, { useState } from "react";
import { useParams } from "react-router-dom";

export function IdlePage({ isHost }) {
  const { code } = useParams();
  let ishost = isHost;
  return (
    <div className="flex items-center  h-screen bg-ice-8 opacity-90">
      {/* Room Info */}
      <div className="flex flex-col items-center justify-center gap-20 pt-5 w-full ">
        <div className="text-6xl font-bold text-white">
          {ishost ? "Invite your friends!" : "Wait for host to Start!"}
        </div>
        {/* Room Code  */}
        <div className="py-16 rounded-lg shadow-lg px-28 bg-ice-2 w-2/5 ">
          <div className="flex flex-row text-2xl justify-center gap-10 font-bold text-black">
            Room Code: {code}
          </div>
        </div>
        {ishost ? (
          <div className="flex  justify-around  w-3/5 ">
            {/* Two Buttons */}
            <button className="px-6 py-3 text-xl font-semibold text-white rounded-lg bg-ice-6 hover:bg-ice-5">
              Leave Room
            </button>

            <button className="px-6 py-3 text-xl font-semibold text-white rounded-lg bg-ice-6 hover:bg-ice-5">
              Start Game
            </button>
          </div>
        ) : (
          <button className="px-6 py-3 text-xl font-semibold text-white rounded-lg bg-ice-6 hover:bg-ice-5">
            Leave Room
          </button>
        )}
      </div>
    </div>
  );
}
