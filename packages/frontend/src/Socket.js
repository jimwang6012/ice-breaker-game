import { io } from "socket.io-client";

// the socketClient object must be unique globally, and only instantiated once
export default io(
  process.env.NODE_ENV === "production"
    ? "http://ec2-13-236-207-49.ap-southeast-2.compute.amazonaws.com/"
    : "http://localhost:8080"
);
