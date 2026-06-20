import { Server, Socket } from "socket.io";
import { createRoom, joinRoom, leaveRoom, startGame, pickCard, getRoom } from "../rooms/roomManager.js";
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
        const room = startGame(data.code, socket.id, data.category);
        if (!room) {
            socket.emit("room:error", "Could not start game.");
            return;
        }

        room.players.forEach((player) => {
            io.to(player.id).emit("game:started", {
                category: room.category
            });
        });

        io.to(room.code).emit("room:updated", {
            ...room,
            civilianWord: undefined,
            undercoverWord: undefined,
            players: room.players.map((p) => ({ ...p, word: undefined, role: undefined })),
            cards: room.cards?.map(c => ({ id: c.id, pickedBy: c.pickedBy }))
        });
    });

    socket.on("game:pickCard", (data: { code: string, cardId: number }) => {
        const room = pickCard(data.code, socket.id, data.cardId);
        if (!room) return; // Invalid pick

        // Sync card state
        io.to(room.code).emit("room:updated", {
            ...room,
            civilianWord: undefined,
            undercoverWord: undefined,
            players: room.players.map((p) => ({ ...p, word: undefined, role: undefined })),
            cards: room.cards?.map(c => ({ id: c.id, pickedBy: c.pickedBy }))
        });

        const player = room.players.find(p => p.id === socket.id);
        if (player) {
            socket.emit("game:roleRevealed", { role: player.role, word: player.word });
        }
    });

    socket.on("game:getCategories", () => {
        socket.emit("game:categories", getCategories());
    });

    socket.on("chat:send", (data: { roomId: string; type?: string; content?: string; isCritical?: boolean }) => {
        const room = getRoom(data.roomId);
        if (!room) return;

        const player = room.players.find(p => p.id === socket.id);
        const playerName = player ? player.name : "System";

        const chatMessage = {
            playerId: socket.id,
            playerName: "System",
            color: "#EF4444", // System message color
            message: data.content || `${playerName} sent a system message`,
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            isSystem: true
        };

        io.to(data.roomId).emit("chat:message", chatMessage);
    });

    socket.on("chat:message", (data: { roomCode: string, message: string, playerName: string, color: string }) => {
        const room = getRoom(data.roomCode);
        if (!room) return;

        const chatMessage = {
            playerId: socket.id,
            playerName: data.playerName,
            color: data.color,
            message: data.message,
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        };

        io.to(data.roomCode).emit("chat:message", chatMessage);
    });

    socket.on("chat:typing", (roomCode: string) => {
        const room = getRoom(roomCode)
        if (!room) return;

        socket.to(roomCode).emit("chat:typing", socket.id);
    });

    socket.on("chat:stop_typing", (roomCode: string) => {
        const room = getRoom(roomCode);
        if (!room) return;

        socket.to(roomCode).emit("chat:stop_typing", socket.id);
    });
}