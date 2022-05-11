import { Routes, Route, Navigate } from "react-router-dom";
import { Button } from "@mantine/core";
import HomePage from "./page/HomePage";
import GamePage from "./page/GamePage";
import NamePage from "./page/NamePage";
import IdlePage from "./page/IdlePage";
import RoomPageLayout from "./page/RoomPageLayout";
import { useEffect } from "react";

const SERVER = "http://localhost:8080/";

function App() {
  return (
    <Routes>
      <Route index element={<Navigate to="home" replace />} />
      <Route path="home" element={<HomePage />} />

      <Route path="name" element={<NamePage />} />

      <Route path=":code" element={<RoomPageLayout />}>
        <Route path="idle" element={<IdlePage />} />
        <Route path="game" element={<GamePage />} />
      </Route>

      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default App;
