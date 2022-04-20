import { Routes, Route } from "react-router-dom";
import { Button } from "@mantine/core";
import HomePage from "./page/HomePage";
import NamePage from "./page/NamePage";
import SocketExample from "./socketEample";
import { IdlePage } from "./page/IdlePage";

const SERVER = "http://localhost:8080/";

function App() {
  // TODO: example usage of socket connection, to be removed
  let isHost = true;

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
      <Route path=":code">
        <Route path="idle" element={<IdlePage isHost={isHost} />} />
      </Route>
      <Route path="test" element={<SocketExample />} />
    </Routes>
  );
}

export default App;
