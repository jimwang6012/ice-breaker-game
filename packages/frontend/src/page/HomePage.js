import React, { useState } from "react";

function HomePage() {
  const [pin, setPin] = useState("");
  return (
    <div className="flex items-center justify-center h-screen overflow-y-auto bg-ice-8 opacity-90">
      {/* left square */}
      <div className="absolute top-0 rotate-45 -left-96 h-2/3 aspect-square bg-ice-3" />
      <div className="z-40 flex flex-col items-center justify-center gap-20 ">
        <div className="text-6xl font-bold text-white">Ice Breaker!</div>
        {/* center modal */}
        <div className="py-16 rounded-lg shadow-lg px-28 bg-ice-2">
          <div className="flex flex-row justify-start gap-10">
            <input
              className="justify-center text-xl font-bold text-center border rounded-md text-ice-7 px-14 bg-ice-0 border-ice-6"
              onChange={(e) => setPin(e.target.value)}
            />
            <button
              className="px-6 py-3 text-xl font-semibold text-white rounded-lg bg-ice-6 hover:bg-ice-5"
              onClick={() => console.log(pin)}
            >
              Join Room
            </button>
          </div>
        </div>
        <button className="px-6 py-3 text-xl font-semibold text-white rounded-lg bg-ice-6 hover:bg-ice-5">
          Create Game
        </button>
      </div>
      {/* right square */}
      <div className="absolute bottom-0 rotate-45 -right-96 h-2/3 aspect-square bg-ice-3" />
    </div>
  );
}

export default HomePage;
