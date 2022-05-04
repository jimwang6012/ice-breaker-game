import { io } from "socket.io-client";

const PORT = 8080;
const SERVER = "http://localhost:" + PORT;

// the socketClient object must be unique globally, and only instantiated once
export default io(SERVER);
