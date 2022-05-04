import { io } from "socket.io-client";

const PORT = process.env.PORT || 8080;
const SERVER = "https://ice-breaker-alpha0.herokuapp.com/";

// the socketClient object must be unique globally, and only instantiated once
export default io();
