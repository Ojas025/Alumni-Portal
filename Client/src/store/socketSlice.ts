import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

interface SocketState {
    socket: Socket | null;
    onlineUsers: { user: string, socket: string }[] 
};

const initialState: SocketState = {
    socket: null,
    onlineUsers: []
}

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setSocket: (state, action: PayloadAction<Socket>) => {
            return { ...state, socket: action.payload  };
        },

        clearSocket: (state) =>  {
            state.socket = null;
        },

        setOnlineUsers: (state, action: PayloadAction<{ user: string, socket: string }[]>) => {
            state.onlineUsers = action.payload; 
        },

        addOnlineUser: (state, action: PayloadAction<{ user: string, socket: string }>) => {
            const exists = state.onlineUsers.some(onlineUser => onlineUser.user === action.payload.user && onlineUser.socket === action.payload.socket);
            if (!exists) {
                state.onlineUsers.push(action.payload);
            }   
        },

        removeOnlineUser: (state, action: PayloadAction<{ user: string, socket: string }>) => {
            state.onlineUsers = state.onlineUsers.filter(onlineUser => onlineUser.user !== action.payload.user || onlineUser.socket !== action.payload.socket );   
        },
    }, 
});

export const { setSocket, clearSocket, setOnlineUsers, addOnlineUser, removeOnlineUser } = socketSlice.actions;
export default socketSlice.reducer;