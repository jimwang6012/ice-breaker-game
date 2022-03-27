import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

// Setup Express
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 8080;

// Setup JSON parsing for the request body
app.use(express.json());

// Setup our routes.

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("client connected");
});

// When we make a GET request to '/hello', send back this HTML content.
app.get("/hello", (req, res) => {
  res
    .status(200)
    .contentType("text/html")
    .send(
      `<!DOCTYPE html>
        <html>
            <head>
                <title>Served from an Express endpoint!</title>
            </head>
            <body>
                <h1>Hello, Express!</h1>
                <p>This HTML content was served from an Express endpoint!</p>
            </body>
        </html>`
    );
});

// When we make a GET request to '/api', send back this JSON content.
// Uses the "name" query param e.g. http://localhost:3000/api?name=Clara
app.get("/api", (req, res) => {
  res.json({
    greeting: "Hello, world!",
    name: req.query.name,
  });
});

httpServer.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
