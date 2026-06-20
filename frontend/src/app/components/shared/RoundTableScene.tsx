import type { Player } from "../../types";

type StickmanState = "idle" | "typing" | "speaking"

interface RoundTableSceneProps {
    players: Player[];
    playerId?: string;
    typingPlayerIds?: string[];
    speakingPlayerIds?: string[];
}

interface StickmanPosition {
    x: number;
    y: number;
    angle: number;
    player: Player;
    isMe: boolean;
    state: StickmanState;
}

function getStickmanState(playerId: string, typingIds: string[], speakingIds: string[]): StickmanState {
    if (speakingIds.includes(playerId)) return "speaking";
    if (typingIds.includes(playerId)) return "typing";
    return "idle"
}

function getPositions(
    players: Player[],
    playerId: string,
    typingIds: string[],
    speakingIds: string[],
    cx: number,
    cy: number,
    rx: number,
    ry: number
): StickmanPosition[] {
    return players.map((player, i) => {
        const angle = (2 * Math.PI * i) / players.length - Math.PI / 2;
        return {
            x: cx + rx * Math.cos(angle),
            y: cy + ry * Math.sin(angle),
            angle,
            player,
            isMe: player.id === playerId,
            state: getStickmanState(player.id, typingIds, speakingIds),
        };
    });
}

function getStickmanImage(state: StickmanState): string {
    switch (state) {
        case "typing": return "/stickman-typing.svg";
        case "speaking": return "/stickman-speaking.svg";
        default: return "/stickman-idle.svg";
    }
}

export function RoundTableScene({ players, playerId = "", typingPlayerIds = [], speakingPlayerIds = [] }: RoundTableSceneProps) {
    const W = 520;
    const H = 320;
    const cx = W / 2;
    const cy = H / 2 + 10;
    const tableRx = 130;
    const tableRy = 70;
    const orbitRx = tableRx + 80;
    const orbitRy = tableRy + 80;
    const IMG_W = 48;
    const IMG_H = 64;

    const positions = getPositions(players, playerId, typingPlayerIds, speakingPlayerIds, cx, cy, orbitRx, orbitRy);

    return (
        <div className="w-full flex justify-center items-center">
            <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full max-w-lg"
                style={{ height: "280px" }}
                aria-label="Round table with players"
            >
                {/* Table shadow */}
                <ellipse cx={cx} cy={cy + 8} rx={tableRx} ry={tableRy * 0.4} fill="rgba(0,0,0,0.07)" />

                {/* Table surface */}
                <ellipse cx={cx} cy={cy} rx={tableRx} ry={tableRy} fill="#f0f4f8" stroke="#cbd5e1" strokeWidth={2.5} />
                <ellipse cx={cx} cy={cy} rx={tableRx - 14} ry={tableRy - 10} fill="none" stroke="#e2e8f0" strokeWidth={1.2} />

                {/* Table label */}
                <text x={cx} y={cy - 6} textAnchor="middle" fontSize={10} fill="#94a3b8" fontWeight={600} letterSpacing={1.5}>DISCUSSION</text>
                <text x={cx} y={cy + 10} textAnchor="middle" fontSize={9} fill="#cbd5e1" letterSpacing={0.5}>ROUND TABLE</text>

                {/* Render back players first, front players on top */}
                {[...positions]
                    .sort((a, b) => Math.sin(a.angle) - Math.sin(b.angle))
                    .map((pos) => {
                        const imgX = pos.x - IMG_W / 2;
                        const imgY = pos.y - IMG_H;
                        const color = pos.player.color ?? "#6366f1";

                        return (
                            <g key={pos.player.id}>
                                {/* Highlight ring for local player */}
                                {pos.isMe && (
                                    <ellipse
                                        cx={pos.x}
                                        cy={pos.y - IMG_H / 2}
                                        rx={IMG_W / 2 + 6}
                                        ry={IMG_H / 2 + 6}
                                        fill="none"
                                        stroke={color}
                                        strokeWidth={2}
                                        opacity={0.3}
                                    />
                                )}

                                {/* Stickman PNG */}
                                <image
                                    href={getStickmanImage(pos.state)}
                                    x={imgX}
                                    y={imgY}
                                    width={IMG_W}
                                    height={IMG_H}
                                />

                                {/* Speaking indicator bubble */}
                                {pos.state === "speaking" && (
                                    <circle cx={pos.x + IMG_W / 2} cy={imgY} r={5} fill="#22c55e" />
                                )}

                                {/* Typing indicator bubble */}
                                {pos.state === "typing" && (
                                    <circle cx={pos.x + IMG_W / 2} cy={imgY} r={5} fill="#f59e0b" />
                                )}

                                {/* Player name */}
                                <text
                                    x={pos.x}
                                    y={imgY + IMG_H + 14}
                                    textAnchor="middle"
                                    fontSize={9}
                                    fontWeight={600}
                                    fill={color}
                                    opacity={0.9}
                                >
                                    {pos.isMe ? `${pos.player.name} (You)` : pos.player.name}
                                </text>
                            </g>
                        );
                    })}
            </svg>
        </div>
    );
}