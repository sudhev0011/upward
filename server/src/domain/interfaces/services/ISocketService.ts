export interface ISocketService {
  emitToUser(userId: string, event: string, data: any): void;
  emitToRoom(room: string, event: string, data: any): void;
}
