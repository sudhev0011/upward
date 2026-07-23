import { Server as SocketIOServer } from "socket.io";
import { ISocketService } from "../../domain/interfaces/services/ISocketService";

export class SocketService implements ISocketService {
  private _io: SocketIOServer | null = null;

  setIo(io: SocketIOServer): void {
    this._io = io;
  }

  emitToUser(userId: string, event: string, data: any): void {
    this._io?.to(`user_${userId}`).emit(event, data);
  }

  emitToRoom(room: string, event: string, data: any): void {
    this._io?.to(room).emit(event, data);
  }

  isUserOnline(userId: string): boolean {
    if (!this._io) {
      return false;
    }

    return this._io.sockets.adapter.rooms.has(`user_${userId}`);
  }

  emitToAll(event: string, data: unknown): void {
    this._io?.emit(event, data);
  }
}

export const socketService = new SocketService();
