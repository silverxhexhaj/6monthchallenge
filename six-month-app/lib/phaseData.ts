export type PhaseColor = "phase1" | "phase2" | "phase3" | "phase4" | "phase5";

export interface ActionCard {
  icon: string;
  title: string;
  description: string;
}

export interface PhaseData {
  id: number;
  number: string;
  title: string;
  timeline: string;
  description: string;
  color: PhaseColor;
  actions: ActionCard[];
}

export const phases: PhaseData[] = [
  {
    id: 1,
    number: "01",
    title: "Master Your Time",
    timeline: "Month 1 — Foundation",
    description:
      "Without controlling your time, nothing else works. Every single moment must serve your mission. Your schedule becomes your weapon.",
    color: "phase1",
    actions: [
      {
        icon: "⏰",
        title: "Wake Up With a Plan",
        description:
          "Set a fixed wake time. Structure your mornings to maximize energy. Never start a day reacting to the world — start on your terms.",
      },
      {
        icon: "⛔",
        title: "Eliminate Distractions",
        description:
          "Audit your time ruthlessly. Track every hour for one week. Remove everything that doesn't serve your mission — social media, idle browsing, aimless conversations.",
      },
      {
        icon: "📍",
        title: "Block Your Time",
        description:
          "Dedicate blocks to deep work, training, and growth. Protect those blocks like your life depends on it. No exceptions, no negotiations.",
      },
      {
        icon: "⚡",
        title: "Set Hard Boundaries",
        description:
          "Every action either moves you forward or pulls you back — there is no neutral. Refuse to engage in anything that doesn't serve your vision.",
      },
    ],
  },
  {
    id: 2,
    number: "02",
    title: "Build Unbreakable Discipline",
    timeline: "Month 2 — The Hardest Month",
    description:
      "Discipline is the bridge between goals and results. Not talent, not luck, not intelligence — just the relentless ability to show up and do what needs to be done.",
    color: "phase2",
    actions: [
      {
        icon: "💪",
        title: "Remove Emotion From Action",
        description:
          'Stop asking "do I feel like it?" Your feelings don\'t matter — your actions do. Motion creates emotion, not the other way around.',
      },
      {
        icon: "🔥",
        title: "Push Through Resistance",
        description:
          "The first 30 days will be the hardest. Your old habits will fight back. This is the moment that separates the successful from the ones who fail.",
      },
      {
        icon: "🔒",
        title: "Make Actions Non-Negotiable",
        description:
          'Decide in advance that your commitments are absolute. No snooze button. No skipped sessions. No "just this once."',
      },
      {
        icon: "🔗",
        title: "Build Trust in Yourself",
        description:
          "Every time you do what you said you would, you build self-trust. Every time you push through when it's easier to quit, you create unstoppable momentum.",
      },
    ],
  },
  {
    id: 3,
    number: "03",
    title: "Raise Your Standards",
    timeline: "Month 3–4 — Level Up",
    description:
      "What you tolerate becomes your reality. If you tolerate mediocrity, you stay average. Demand excellence from yourself in everything you do.",
    color: "phase3",
    actions: [
      {
        icon: "📈",
        title: "Demand More Every Day",
        description:
          "If you used to stop at 10 reps, go to 12. If you worked for an hour, push to 90 minutes. Small goals become massive ones. Growth happens under pressure.",
      },
      {
        icon: "🎯",
        title: "Chase Discomfort",
        description:
          "Comfort is the enemy of progress. Seek out challenges. Force yourself to grow. If you're not uncomfortable, you're not evolving.",
      },
      {
        icon: "🔍",
        title: "Evaluate Yourself Daily",
        description:
          "Ask every night: Did I give my absolute best? Did I push further than yesterday? Did I hold myself to the highest standard? If not, fix it immediately.",
      },
      {
        icon: "✂",
        title: "Eliminate Weak Points",
        description:
          "No gaps in your discipline. No areas where you accept mediocrity. If something isn't at the highest level, you fix it. No exceptions.",
      },
    ],
  },
  {
    id: 4,
    number: "04",
    title: "Develop an Unshakable Mindset",
    timeline: "Month 4–5 — Mental Fortress",
    description:
      "Build a mind so strong that nothing can break you. One that doesn't give in to doubt, doesn't surrender to fear, and doesn't get shaken by obstacles.",
    color: "phase4",
    actions: [
      {
        icon: "🧠",
        title: "Control Your Thoughts",
        description:
          'Your mind controls your reality. Be intentional about what enters your head. Remove negative thoughts the second they appear. Think only in absolutes: "I will succeed."',
      },
      {
        icon: "💨",
        title: "Use Thought Replacement",
        description:
          'Don\'t resist negativity — replace it. "I\'m not good enough" becomes "I\'m capable, I\'m strong, I\'m worthy." The mind can only hold one thought at a time.',
      },
      {
        icon: "🌍",
        title: "Protect Your Environment",
        description:
          "Eliminate negativity. If people around you are pulling you back, create distance. If your environment keeps you from operating at your highest level, change it.",
      },
      {
        icon: "💪",
        title: "Seek Struggle on Purpose",
        description:
          "Put yourself in difficult situations deliberately. Do things that scare you. The only way to build a strong mind is through resistance. Chase difficulty daily.",
      },
    ],
  },
  {
    id: 5,
    number: "05",
    title: "Relentless Execution",
    timeline: "Month 5–6 — Full Acceleration",
    description:
      "All the discipline in the world means nothing without consistent action at the highest level. Stop overthinking. Become a machine of execution.",
    color: "phase5",
    actions: [
      {
        icon: "🚀",
        title: "Operate With Urgency",
        description:
          "No procrastination, no delays. If something needs to be done, do it immediately. If an opportunity appears, seize it without hesitation.",
      },
      {
        icon: "⏱",
        title: "Move Faster Than Everyone",
        description:
          "Speed matters. The faster you move, the more opportunities you create. While others are still debating, you're already 10 steps ahead building momentum.",
      },
      {
        icon: "✨",
        title: "Action Kills Fear",
        description:
          "Confidence doesn't come from thinking — it comes from doing. The more you act, the more you push yourself into the unknown, the stronger you become.",
      },
      {
        icon: "⛳",
        title: "Never Stop Accelerating",
        description:
          "Don't slow down when you see results. Keep pushing. Winners don't take breaks once momentum builds. They keep accelerating until success becomes inevitable.",
      },
    ],
  },
];
