import { motion } from "motion/react";
import { ArrowLeft, BookOpen, Stethoscope, Users, Clock, Target, AlertTriangle } from "lucide-react";
import { useGame } from "../context/GameContext";
import { fadeUp, staggerList } from "../animations/presets";

const ROLES = [
  {
    title: "Main Diagnose",
    percentage: "60% of players",
    description:
      "Receives the primary disease to diagnose. Your goal is to provide accurate diagnosis while identifying other roles.",
    bg: "bg-[#EFF6FF]",
    border: "border-[#BFDBFE]",
    titleColor: "text-[#2563EB]",
  },
  {
    title: "Differential Diagnose",
    percentage: "30% of players",
    description:
      "Receives a similar but different disease. Must blend in while providing plausible alternative diagnoses.",
    bg: "bg-[#ECFDF5]",
    border: "border-[#A7F3D0]",
    titleColor: "text-[#059669]",
  },
  {
    title: "Doctor Grey",
    percentage: "10% of players",
    description:
      "Receives no disease information. Must deduce from others' discussions and survive using medical knowledge.",
    bg: "bg-[#F5F3FF]",
    border: "border-[#DDD6FE]",
    titleColor: "text-[#7C3AED]",
  },
] as const;

const PHASES = [
  {
    step: 1,
    title: "Lobby Phase",
    description:
      "Players join the room and wait for the host to start the game. Minimum 4 players required.",
    color: "#3B82F6",
  },
  {
    step: 2,
    title: "Role Assignment",
    description:
      "Players click cards to reveal their secret roles and diseases. Keep your role hidden from others!",
    color: "#10B981",
  },
  {
    step: 3,
    title: "Discussion Rounds",
    description:
      "Players share their diagnoses in chat, then vote to eliminate one player each round. Continue until 3 players remain.",
    color: "#7C3AED",
  },
  {
    step: 4,
    title: "Final Round",
    description:
      "Last 3 players submit treatment plans and medical innovations. Eliminated players vote for the winner.",
    color: "#F97316",
  },
] as const;

const TIPS = [
  {
    title: "For Main Diagnose",
    titleColor: "text-[#2563EB]",
    bg: "bg-[#EFF6FF]",
    border: "border-[#BFDBFE]",
    points: [
      "Provide accurate but not overly detailed diagnoses",
      "Watch for players giving similar answers",
      "Form alliances with other Main Diagnose players",
      "Be suspicious of vague or incorrect answers",
    ],
  },
  {
    title: "For Differential Diagnose",
    titleColor: "text-[#059669]",
    bg: "bg-[#ECFDF5]",
    border: "border-[#A7F3D0]",
    points: [
      "Give plausible alternative diagnoses",
      "Blend in with Main Diagnose players",
      "Don't be too obvious about your different disease",
      "Use medical knowledge to seem credible",
    ],
  },
  {
    title: "For Doctor Grey",
    titleColor: "text-[#7C3AED]",
    bg: "bg-[#F5F3FF]",
    border: "border-[#DDD6FE]",
    points: [
      "Listen carefully to others' diagnoses",
      "Provide general medical knowledge",
      "Avoid giving specific diagnoses early",
      "Higher rewards if you reach the final!",
    ],
  },
  {
    title: "General Tips",
    titleColor: "text-[#D97706]",
    bg: "bg-[#FFFBEB]",
    border: "border-[#FDE68A]",
    points: [
      "Pay attention to voting patterns",
      "Form temporary alliances",
      "Don't reveal your role too early",
      "Keep track of eliminated players' roles",
    ],
  },
] as const;

const IMPORTANT_NOTES = [
  "Keep your role and disease information secret from other players",
  "The game requires medical knowledge - study up on diseases and treatments!",
  "Eliminated players can still participate in the final voting round",
  "Real-time communication is key - stay active in discussions",
] as const;

function SectionHeader({
  icon,
  iconBg,
  iconColor,
  title,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}
      >
        <span className={iconColor}>{icon}</span>
      </div>
      <h2 className="font-bold text-base lg:text-lg text-foreground">{title}</h2>
    </div>
  );
}

export default function GuidebookScreen() {
  const { go } = useGame();

  return (
    <div
      className="flex flex-col min-h-screen lg:min-h-0"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="flex-1 overflow-y-auto px-4 lg:px-10 py-6 lg:py-10">
        <div className="lg:max-w-4xl lg:mx-auto space-y-6 lg:space-y-8">
          {/* Back & Header */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => go("home")}
              className="flex items-center gap-1.5 text-black text-sm font-medium hover:opacity-70 transition-opacity mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-[#ECFDF5] flex items-center justify-center flex-shrink-0 shadow-sm">
                <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-[#10B981]" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                Uncoverles Guidebook
              </h1>
            </div>
            <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
              Master the art of medical diagnosis in multiplayer battles
            </p>
          </motion.div>

          {/* Section 1: Game Overview */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="bg-card rounded-2xl p-5 lg:p-6 border border-border shadow-sm"
          >
            <SectionHeader
              icon={<Stethoscope className="w-4 h-4" />}
              iconBg="bg-[#EFF6FF]"
              iconColor="text-[#3B82F6]"
              title="Game Overview"
            />
            <p className="text-sm lg:text-base text-foreground/80 leading-relaxed">
              Uncoverles is a competitive multiplayer medical diagnosis game where players
              take on different medical roles, diagnose diseases, and compete to be the last
              one standing. The game combines medical knowledge, strategy, and social deduction
              in an exciting real-time format.
            </p>
            <span className="inline-block mt-4 text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
              Inspired from Undercover game / Werewolf
            </span>
          </motion.div>

          {/* Section 2: Player Roles */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="bg-card rounded-2xl p-5 lg:p-6 border border-border shadow-sm"
          >
            <SectionHeader
              icon={<Users className="w-4 h-4" />}
              iconBg="bg-[#ECFDF5]"
              iconColor="text-[#10B981]"
              title="Player Roles"
            />
            <motion.div
              variants={staggerList}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4"
            >
              {ROLES.map((role) => (
                <motion.div
                  key={role.title}
                  variants={fadeUp}
                  className={`rounded-xl p-4 lg:p-5 border shadow-sm ${role.bg} ${role.border}`}
                >
                  <h3 className={`font-bold text-sm lg:text-base mb-1 ${role.titleColor}`}>
                    {role.title}
                  </h3>
                  <p className="text-xs font-semibold text-muted-foreground mb-2.5">
                    {role.percentage}
                  </p>
                  <p className="text-xs lg:text-sm text-foreground/75 leading-relaxed">
                    {role.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Section 3: Game Phases */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="bg-card rounded-2xl p-5 lg:p-6 border border-border shadow-sm"
          >
            <SectionHeader
              icon={<Clock className="w-4 h-4" />}
              iconBg="bg-[#FFF7ED]"
              iconColor="text-[#F97316]"
              title="Game Phases"
            />
            <div className="space-y-4">
              {PHASES.map((phase) => (
                <div key={phase.step} className="flex gap-3.5 lg:gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: phase.color }}
                  >
                    {phase.step}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h3 className="font-semibold text-sm lg:text-base text-foreground mb-1">
                      {phase.title}
                    </h3>
                    <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
                      {phase.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 4: Tips & Strategy */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="bg-card rounded-2xl p-5 lg:p-6 border border-border shadow-sm"
          >
            <SectionHeader
              icon={<Target className="w-4 h-4" />}
              iconBg="bg-[#FEF2F2]"
              iconColor="text-[#DC2626]"
              title="Tips & Strategy"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              {TIPS.map((tip) => (
                <div
                  key={tip.title}
                  className={`rounded-xl p-4 lg:p-5 border shadow-sm ${tip.bg} ${tip.border}`}
                >
                  <h3 className={`font-bold text-sm lg:text-base mb-3 ${tip.titleColor}`}>
                    {tip.title}
                  </h3>
                  <div className="space-y-2 text-left">
                    {tip.points.map((point) => (
                      <p
                        key={point}
                        className="text-xs lg:text-sm text-foreground/75 leading-relaxed"
                      >
                        {point}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 5: Important Notes */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="bg-red-50 rounded-2xl p-5 lg:p-6 border border-red-200 shadow-sm"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <h2 className="font-bold text-base lg:text-lg text-red-800">Important Notes</h2>
            </div>
            <div className="space-y-2.5 text-left">
              {IMPORTANT_NOTES.map((note) => (
                <p
                  key={note}
                  className="text-sm lg:text-base text-red-900/80 leading-relaxed"
                >
                  {note}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Ready to Play */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="flex justify-center pt-2 pb-6 lg:pb-8"
          >
            <button
              onClick={() => go("home")}
              className="w-full max-w-sm bg-[#7C3AED] text-white text-base lg:text-lg font-bold py-3.5 lg:py-4 px-8 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-[#7C3AED]/25"
            >
              Ready to Play!
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
