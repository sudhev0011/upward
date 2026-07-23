import { IPresenceService } from "../../domain/interfaces/services/IPresenceService";
import { socketService } from "./socket.service";

export class SocketPresenceService implements IPresenceService {

    isUserOnline(userId: string): boolean {
        return socketService.isUserOnline(userId);
    }

}