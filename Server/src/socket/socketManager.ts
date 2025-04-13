import { Socket } from "socket.io";

const onlineUsers = new Map<string, string>();

export const addUser = (socket: Socket, userId: string) => {
    if (!userId) return;

    onlineUsers.set(userId, socket.id);

    socket.broadcast.emit("user-status", { user: userId, status: 'online' });
};

export const removeUser = (socket: Socket, userId: string) => {
    if (!userId) return;

    onlineUsers.delete(userId);

    socket.broadcast.emit('user-status', { user: userId, status: 'offline' });
}

export const getSocketId = (userId: string) => {
    if (!userId) return;

    return onlineUsers.get(userId);
};