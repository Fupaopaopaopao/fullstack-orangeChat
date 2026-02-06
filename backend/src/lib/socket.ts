import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

export const app = express();

export const httpServer = createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
})
// const PORT:number = parseInt(process.env.PORT!);

const onlineUsersMap: Record<string, string> = {};

export const getReceiverSocketId = (userId: string) => {
    return onlineUsersMap[userId] || null;
}

io.on("connection", (socket) => {
    console.log("a user connected");
    const userId = socket.handshake.query.userId as string;
    if (userId) {
        onlineUsersMap[userId] = socket.id;
    }
    console.log(onlineUsersMap);

    io.emit("getOnlineUsers", Object.keys(onlineUsersMap));
    socket.on("disconnect", () => {
        console.log("a user disconnected");
        delete onlineUsersMap[userId];
        io.emit("getOnlineUsers", Object.keys(onlineUsersMap));
    });
});
