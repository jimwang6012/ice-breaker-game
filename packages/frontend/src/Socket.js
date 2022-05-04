import socketClient from "socket.io-client";

const PORT = 43179;
const SERVER = "https://ice-breaking-game.herokuapp.com:" + PORT;

// the socketClient object must be unique globally, and only instantiated once
export default socketClient(SERVER);
