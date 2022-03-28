import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import socketClient from "socket.io-client";
import { useEffect } from "react";

import { Button } from "@mantine/core";
import HomePage from "./page/HomePage";
import { IdlePage } from "./page/IdlePage";
const SERVER = "http://localhost:8080/";

function App() {
  // TODO: example usage of socket connection, to be removed
  let socket = socketClient(SERVER);
  let isHost = true;
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <h1>hi</h1>
            <Button>Default button</Button>
            <h1 className="text-red-500">hi</h1>
          </div>
        }
      ></Route>
      <Route path="home" element={<HomePage />} />
      <Route path=":code">
        <Route path="idle" element={<IdlePage isHost={isHost} />} />
      </Route>
    </Routes>
  );
}

export default App;
