import { Server, Socket } from "socket.io";
import { createRoom, joinRoom, leaveRoom, startGame } from "../rooms/roomManager.js";
import type { Player } from "../types/game.js";
import { getCategories } from "../rooms/wordManager.js";

export function registerGameHandlers(io: Server, socket: Socket) {
    socket.on("room:create", (playerName: string) => {
        const player: Player = {
            id: socket.id,
            name: playerName,
            isHost: true,
            score: 0
        };
        const room = createRoom(player);
        socket.join(room.code);
        socket.emit("room:created", room);
    });

    socket.on("room:join", (code: string, playerName: string) => {
        const player = {
            id: socket.id,
            name: playerName
        };
        const room = joinRoom(code, player);
        if (room) {
            socket.join(code);
            socket.emit("room:joined", room);
            socket.to(code).emit("room:updated", room);
        } else {
            socket.emit("room:error", "Room not found or game already started");
        }
    });

    socket.on("room:leave", (code: string) => {
        const room = leaveRoom(code, socket.id);
        socket.leave(code);
        if (room) {
            socket.to(code).emit("room:updated", room);
        }
    });

    socket.on("disconnect", () => {
        socket.rooms.forEach((roomCode) => {
            if (roomCode === socket.id) return;
            const updatedRoom = leaveRoom(roomCode, socket.id);
            if (updatedRoom) {
                io.to(roomCode).emit("room:updated", updatedRoom);
            }
        });
    });

    socket.on("game:start", (data: { code: string, category?: string }) => {
        const room = startGame(data.code, data.category);
        if (!room) {
            socket.emit("room:error", "Could not start game.");
            return;
        }

        room.players.forEach((player) => {
            io.to(player.id).emit("game:started", {
                category: room.category,
                role: player.role,
                word: player.word
            });
        });

        io.to(room.code).emit("room:updated", {
            ...room,
            civilianWord: undefined,
            undercoverWord: undefined,
            players: room.players.map((p) => ({ ...p, word: undefined, role: undefined })),
        });
    });

    socket.on("game:getCategories", () => {
        socket.emit("game:categories", getCategories());
    });
}