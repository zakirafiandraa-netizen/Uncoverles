import { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import type { Screen, Player, ChatMessage } from "../types";
import { COLORS, CHAT_MESSAGES as DEFAULT_CHAT } from "../constants";

// ── Game State ────────────────────────────────────────────────────
interface GameState {
  screen: Screen;
  go: (s: Screen) => void;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  roomCode: string;
  chatMessages: ChatMessage[];
}

const GameContext = createContext<GameState | null>(null);

export function useGame(): GameState {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within <GameProvider>");
  return ctx;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>("home");
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Budi",  color: COLORS[0], avatar: "🧑" },
    { id: 2, name: "Siti",  color: COLORS[1], avatar: "👩" },
    { id: 3, name: "Andi",  color: COLORS[2], avatar: "🧔" },
    { id: 4, name: "Dewi",  color: COLORS[3], avatar: "👧" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState("Acak");
  const [chatMessages] = useState<ChatMessage[]>(DEFAULT_CHAT);

  const go = useCallback((s: Screen) => setScreen(s), []);
  const roomCode = "MED42K";

  const value = useMemo<GameState>(() => ({
    screen, go,
    players, setPlayers,
    selectedCategory, setSelectedCategory,
    roomCode, chatMessages,
  }), [screen, go, players, selectedCategory, roomCode, chatMessages]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
