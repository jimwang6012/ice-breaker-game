import socketClient from "socket.io-client";
const SERVER = "http://localhost:8080/";

// the socketClient object must be unique globally, and only instantiated once
export default socketClient(SERVER);
