import { DefaultEventsMap, Server, Socket } from "socket.io";
import mongoose from "mongoose";
import { ChatEvents, ChatEventsEnum } from "./chatEvents";
import { Request } from "express";
import { addUser, removeUser } from "./socketManager";

export interface AuthPayload {
  _id: mongoose.Types.ObjectId;
  role: string;
}

export interface CustomAuth {
  token?: string;
}

export interface CustomHandshake {
  auth: CustomAuth;
}

export interface CustomSocket
  extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
  handshake: Socket["handshake"] & CustomHandshake;
  user?: AuthPayload;
}

export const initSocketIO = (io: Server) => {
  return io.on("connection", (socket: CustomSocket) => {
    try {
      const userId = socket?.user?._id.toString() as string;

      socket.join(userId);

      addUser(socket, userId);
      console.log(`User ${userId} is now online as: ${socket.id}`);

      socket.on("disconnect", () => {
        removeUser(socket, userId);
        console.log(`User ${userId} disconnected`);
      });
    } catch (error: any) {
      socket.emit(
        ChatEventsEnum.SOCKET_ERROR,
        error?.message || "Socket connection failed"
      );
    }
  });
};

export const emitSocketEvent = (
  req: Request,
  roomId: string,
  event: ChatEvents,
  payload: any
) => {
  req.app.get("io").in(roomId).emit(event, payload);
};
