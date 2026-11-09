// The Loyalty Project (TLP) — content matching the provided design exactly.
// Dark navy (#001a26 / #04121e) + orange (#f59e0b) palette.

export type TimelineStep = {
  num: string;
  emoji: string;
  title: string;
  desc: string;
  note?: string;
  list?: string[];
};

export type Perk = {
  emoji: string;
  title: string;
  desc: string;
};

export type Moment = {
  caption: string;
  image?: string; // optional photo
};

/* Hero */
export const hero = {
  brand: "Bestcoach",
  brandSub: "Music",
  line1: "THE",
  line2: "Loyalty Project",
  tagline: "Transform. Grow. Inspire.",
  ctaPrimary: "Explore the Project",
  ctaSecondary: "Watch Trailer",
  scrollHint: "Scroll to explore",
};

/* Team moments masonry (captions exactly as in the design) */
export const moments: Moment[] = [
  {
    caption: "Bestcoach team and the loyalty moment 2",
    image: "https://picsum.photos/seed/bc-tlp-moment-1/600/660",
  },
  { caption: "Bestcoach team and the loyalty moment 3" },
  { caption: "Bestcoach team and the loyalty moment 4" },
  { caption: "Bestcoach team and the loyalty moment 5" },
  { caption: "Bestcoach team and the loyalty moment 6" },
];

/* Why section — three paragraphs verbatim */
export const whyHeading = "Why the Loyalty Project";
export const whyParagraphs: string[] = [
  "We believe music has the power to change the world. Picking up an instrument gives someone a voice, and that voice helps them express who they truly are.",
  "When we build our music lesson communities, we put relationships first, always before technology. We're here to help students grow and stay inspired.",
  "Joining The Loyalty Project means more than a job. It's a mission. You'll care about the details, and we'll care about you. From the tools you use to the team you're on, we're in it together.",
];

/* Fill section */
export const fillEyebrow = "If you resonate with these then...";
export const fillHeading = "LET'S FILL THE WORLD WITH MUSIC!";
export const fillCards: Moment[] = [
  { caption: "Bestcoach Music Loyalty moment 1" },
  { caption: "Bestcoach Music Loyalty moment 2" },
  { caption: "Bestcoach Music Loyalty moment 3" },
  { caption: "Bestcoach Music Loyalty moment 4" },
  { caption: "Bestcoach Music Loyalty moment 5" },
  { caption: "Bestcoach Music Loyalty moment 6" },
];

/* What to expect — 8-step timeline */
export const expectHeading = "What to Expect When You Enroll";
export const timeline: TimelineStep[] = [
  {
    num: "1",
    emoji: "📨",
    title: "You Enrolled!",
    desc: "After you apply for a role, you'll receive an automatic confirmation that we've got your application.",
    note: "Heads up: Sometimes our emails land in spam — give it a quick check so you don't miss us!",
  },
  {
    num: "2",
    emoji: "📝",
    title: "A Small Challenge",
    desc: "Some roles may include a short assignment or test. Depending on the role, this step may shift the order of the hiring process.",
  },
  {
    num: "3",
    emoji: "💬",
    title: "Let's Chat",
    desc: "If selected, our Talent Acquisition Team will reach out to schedule a quick 15-minute phone or video chat.",
    list: [
      "How would others describe you in three words?",
      "Which of our core values resonates most with you, and why?",
    ],
  },
  {
    num: "4",
    emoji: "👔",
    title: "Meet the Hiring Manager",
    desc: "You'll then have a 30–60 minute interview with the hiring manager. We recommend reviewing the job description beforehand to reflect on how your experience aligns.",
  },
  {
    num: "5",
    emoji: "🔍",
    title: "Reference Check",
    desc: "We'll request three professional references, including at least one former manager. Reference checks are completed before we extend an offer.",
  },
  {
    num: "6",
    emoji: "🤝",
    title: "Final Touchpoint",
    desc: "For some roles, there may be an additional interview with our CEO/COO or another team member.",
  },
  {
    num: "7",
    emoji: "🚀",
    title: "Offer Incoming!",
    desc: "If you make it to the final stage, our Talent team will get in touch to let you know we're moving forward with an offer and confirm your start date.",
  },
  {
    num: "8",
    emoji: "📄",
    title: "Make It Official",
    desc: "A formal written offer will be sent your way for review and signature!",
  },
];

/* Perks & benefits — 12 items */
export const perksHeading = "Perks & Benefits";
export const perks: Perk[] = [
  { emoji: "❤️", title: "Comprehensive Health Coverage", desc: "Health, dental, and vision benefits that prioritize your well-being, because you matter." },
  { emoji: "⏰", title: "Flexible Work Hours", desc: "Work hard, then work when it works for you. We trust you to manage your time well." },
  { emoji: "🏋️", title: "Onsite Gym Access", desc: "Stay energized with a fully equipped gym, weights, cardio, and room to move." },
  { emoji: "💡", title: "Personal Growth Support", desc: "We've got your back with resources to help you stay sharp and grow your skills." },
  { emoji: "🔧", title: "Tools That Work for You", desc: "We'll set you up with the right tools and gear so you can do your best work, friction-free." },
  { emoji: "🏠", title: "Hybrid Work Options", desc: "Many roles offer the best of both worlds, remote flexibility and in-office connection." },
  { emoji: "🧠", title: "Mental Wellness Support", desc: "Up to $2,000/year for counseling services, plus access to our Employee Assistance Program." },
  { emoji: "🍎", title: "Snacks, Drinks & Good Vibes", desc: "Fresh fruit, snacks, espresso, and a fridge stocked with soda, kombucha, and beer." },
  { emoji: "🎵", title: "Free Music Lessons", desc: "Our world-class music education is free for you, and for your friends and family too." },
  { emoji: "🫂", title: "Collaborative Culture", desc: "Your ideas matter. We learn from each other and build across teams, together." },
  { emoji: "🎉", title: "Legendary Team Events", desc: "Golf tournaments, jam nights, and a holiday party you'll talk about all year." },
  { emoji: "🌱", title: "Room to Grow", desc: "Wherever your journey takes you up, across, or somewhere new, we're here to support it." },
];

/* CTA */
export const cta = {
  heading: "Ready to Join The Loyalty Project?",
  paragraphs: [
    "We believe the world needs more music — and more people like you. Whether you're applying, exploring, or just curious, we'd love to hear from you.",
  ],
  motto: "Let's make something meaningful together.",
  button: "Enroll Now!",
};

/* Testimonial */
export const testimonial = {
  quote:
    "At Bestcoach Music, creativity and care for people are so perfectly balanced. Bestcoach Music doesn't just talk about community — we live it every day.",
  who: "Nana Sarfo",
  role: "Media Lead, Bestcoach Music",
  readMore: "Read more",
};