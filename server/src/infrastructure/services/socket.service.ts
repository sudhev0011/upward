import { Server as SocketIOServer } from 'socket.io';
import { ISocketService } from '../../domain/interfaces/services/ISocketService';

export class SocketService implements ISocketService {
  private _io: SocketIOServer | null = null;

  setIo(io: SocketIOServer): void {
    this._io = io;
  }

  emitToUser(userId: string, event: string, data: any): void {
    if (this._io) {
      this._io.to(`user_${userId}`).emit(event, data);
    }
  }

  emitToRoom(room: string, event: string, data: any): void {
    if (this._io) {
      this._io.to(room).emit(event, data);
    }
  }
}

export const socketService = new SocketService();
