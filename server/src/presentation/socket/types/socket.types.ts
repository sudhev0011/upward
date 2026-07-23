import { Socket } from "socket.io";

export interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    email: string;
    roles: string[];
  };
}

export interface SocketResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

export type SocketCallback<T = unknown> =
    (response: SocketResponse<T>) => void;