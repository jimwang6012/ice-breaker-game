import { Routes, Route } from "react-router-dom";
import { Button } from "@mantine/core";
import HomePage from "./page/HomePage";
import GamePage from "./page/GamePage";
import NamePage from "./page/NamePage";
import SocketExample from "./socketEample";
import { IdlePage } from "./page/IdlePage";
import RoomPageLayout from "./page/RoomPageLayout";

const SERVER = "http://localhost:8080/";

function App() {
  // TODO: example usage of socket connection, to be removed

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

      <Route path="name" element={<NamePage />} />
      <Route path=":code" element={<RoomPageLayout />}>
        <Route path="idle" element={<IdlePage />} />
        <Route path="game" element={<GamePage />} />
      </Route>

      <Route path="test" element={<SocketExample />} />
    </Routes>
  );
}

export default App;
