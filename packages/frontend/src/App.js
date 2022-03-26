import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import socketClient from "socket.io-client";
import { useEffect } from "react";
const SERVER = "http://localhost:8080/";

function App() {
  //TODO: example usage of socket connection, to be removed
  let socket = socketClient(SERVER);
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
          </div>
        }
      ></Route>
    </Routes>
  );
}

export default App;
