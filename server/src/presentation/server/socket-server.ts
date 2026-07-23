import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { env } from "../../infrastructure/config/env";
import { socketService } from "../../infrastructure/services/socket.service";
import { socketAuthMiddleware } from "../socket/middleware/socket-auth";
import { socketConnectionHandler } from "../../infrastructure/di/socketDi";

export function initSocketServer(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
    },
  });

  socketService.setIo(io);

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    socketConnectionHandler.handleConnection(io, socket);
  });

  return io;
}
