import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";

export function createServer() {
  const app = express();
  app.use(bodyParser.json());

  const corsOptions = {
    origin: ["http://localhost:3000"],
    credentials: true,
  };
  app.use(cors(corsOptions));
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: corsOptions,
  });

  server.listen(process.env.PORT || 8000, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });

  return io;
}
