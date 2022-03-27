import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import socketClient from "socket.io-client";
import { useEffect } from "react";
import HomePage from "./page/HomePage";
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
            <h1 className="text-red-500">hi</h1>
          </div>
        }
      ></Route>
      <Route path="home" element={<HomePage />} />
    </Routes>
  );
}

export default App;
