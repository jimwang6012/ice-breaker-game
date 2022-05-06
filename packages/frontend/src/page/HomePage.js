import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContextProvider";
import { MainButton } from "../component/Component";

function HomePage() {
  document.body.style.overflow = "hidden";
  const [pin, setPin] = useState("");
  const navigate = useNavigate();
  const { setIsHost, setRoomId } = useContext(AppContext);
  const createGame = () => {
    setIsHost(true);
    navigate("/name");
  };
  const joinGame = () => {
    setIsHost(false);
    setRoomId(pin);
    navigate("/name");
  };

  return (
    <body className="overflow-hidden">
      <div className="flex items-center justify-center h-screen overflow-y-auto bg-ice-8 opacity-90">
        {/* left square */}
        <div className="absolute top-0 rotate-45 -left-96 h-2/3 aspect-square bg-ice-3" />
        <div className="z-40 flex flex-col items-center justify-center gap-20 ">
          <div className="text-6xl font-bold text-white">Ice Breaker!</div>
          {/* center modal */}
          <div className="z-40 py-16 rounded-lg shadow-lg px-28 bg-ice-2">
            <div className="flex flex-row justify-start gap-10">
              <input
                className="justify-center text-xl font-bold text-center border rounded-md text-ice-7 px-14 bg-ice-0 border-ice-6"
                onChange={(e) => setPin(e.target.value)}
              />
              <MainButton handleClick={joinGame} text="Join Room" />
            </div>
          </div>
          <MainButton handleClick={createGame} text="Create Game" />
          {/* right square */}
          <div className="absolute bottom-0 rotate-45 -right-96 h-2/3 aspect-square bg-ice-3" />
        </div>
      </div>
    </body>
  );
}

export default HomePage;
