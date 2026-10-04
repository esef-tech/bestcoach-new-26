/* Seed open job positions. Run with: bun run scripts/seed-jobs.ts */
import { db } from "../src/lib/db";

const jobs = [
  {
    title: "Vocal Coach",
    department: "Vocal Studies",
    location: "Accra, Ghana (On-site)",
    type: "Full-time",
    description:
      "Lead individual and group vocal sessions across genres. Mentor singers on The Singers Sanctuary and help them find their authentic voice and stage confidence.",
    requirements:
      "Proven vocal coaching experience; strong ear; ability to teach across genres; patient and inspiring. Certification in voice or music education a plus.",
  },
  {
    title: "Guitar & Strings Instructor",
    department: "Instrumentation",
    location: "Accra, Ghana (Hybrid)",
    type: "Part-time",
    description:
      "Teach guitar, ukulele and string ensemble to learners from beginner to performance-ready on The Music Mentorship Experience (TMME).",
    requirements:
      "5+ years playing; teaching experience; comfortable with both acoustic and electric. Theory fundamentals a plus.",
  },
  {
    title: "Piano & Theory Tutor",
    department: "Instrumentation",
    location: "Accra, Ghana (On-site)",
    type: "Part-time",
    description:
      "Deliver piano method lessons and music theory to adult beginners and intermediate learners. Build personalised progression plans.",
    requirements:
      "Grade 8 / diploma in piano or equivalent; theory fluency; teaching experience with adults preferred.",
  },
  {
    title: "Sound Engineer",
    department: "Production",
    location: "Accra, Ghana (On-site)",
    type: "Contract",
    description:
      "Run live sound for events (TSS, TMME) and studio sessions. Maintain the recording setup and mentor learners on basic production.",
    requirements:
      "Live + studio sound experience; DAW fluency (Logic/Pro Tools/Ableton); calm under pressure.",
  },
  {
    title: "Community & Events Lead",
    department: "Community",
    location: "Accra, Ghana (Hybrid)",
    type: "Full-time",
    description:
      "Plan and run flagship events, grow the Bestcoach community across socials, and coordinate partnerships with schools and churches.",
    requirements:
      "Event management experience; strong social-media fluency; organised and people-first. Music background a plus.",
  },
  {
    title: "Operations Coordinator",
    department: "Operations",
    location: "Accra, Ghana (On-site)",
    type: "Full-time",
    description:
      "Own enrolments, instrument rentals, scheduling and the day-to-day that keeps great coaching possible.",
    requirements:
      "Operations/admin experience; detail-obsessed; comfortable with spreadsheets and CRMs; calm and proactive.",
  },
];

async function main() {
  console.log("Seeding jobs...");
  await db.job.deleteMany({});
  for (const j of jobs) {
    await db.job.create({ data: j });
  }
  const count = await db.job.count();
  console.log(`✅ Seeded ${count} open positions.`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });