import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./page/HomePage";
import GamePage from "./page/GamePage";
import NamePage from "./page/NamePage";
import IdlePage from "./page/IdlePage";
import RoomPageLayout from "./page/RoomPageLayout";

function App() {
  return (
    <Routes>
      <Route index element={<Navigate to="home" replace />} />
      <Route path="home" element={<HomePage />} />

      <Route path="name" element={<NamePage />} />

      {/* Routing to the page with the game code */}
      <Route path=":code" element={<RoomPageLayout />}>
        <Route path="idle" element={<IdlePage />} />
        <Route path="game" element={<GamePage />} />
      </Route>

      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default App;
