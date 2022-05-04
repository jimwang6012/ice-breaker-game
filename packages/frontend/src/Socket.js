import socketClient from "socket.io-client";

const PORT = process.env.PORT || 8080;
const SERVER = "https://ice-breaking-game.herokuapp.com/" + String(PORT);

// the socketClient object must be unique globally, and only instantiated once
export default socketClient(SERVER);
