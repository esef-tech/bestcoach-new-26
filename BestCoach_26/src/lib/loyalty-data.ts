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

export type Testimonial = {
  quote: string;
  who: string;
  role: string;
  image: string;
};

/* Hero — with background video */
export const hero = {
  brand: "Bestcoach",
  brandSub: "Music",
  line1: "THE",
  line2: "Loyalty Project",
  tagline: "Transform. Grow. Inspire.",
  ctaPrimary: "Explore the Project",
  ctaSecondary: "Watch Trailer",
  scrollHint: "Scroll to explore",
  videoUrl:
    "https://player.vimeo.com/progressive_redirect/playback/1069332461/rendition/540p/file.mp4?loc=external&signature=091de529f5ff88f52584a0b882c23a6cb692594dc08bb5e4fa8393f94ccbded3",
};

/* Team moments masonry (5 images, real URLs) */
export const moments: Moment[] = [
  {
    caption: "Bestcoach team and the loyalty moment 2",
    image: "https://bestcoach-front.vercel.app/static/media/Coach.9f8dc9ce950601b9cc93.webp",
  },
  {
    caption: "Bestcoach team and the loyalty moment 3",
    image: "https://bestcoach-front.vercel.app/static/media/8.53ee105175f6e66eaa9a.webp",
  },
  {
    caption: "Bestcoach team and the loyalty moment 4",
    image: "https://d21q7xesnoiieh.cloudfront.net/fit-in/670x0/filters:quality(95)/marketing/musora/lead-gen/careers/careers-images-09.webp",
  },
  {
    caption: "Bestcoach team and the loyalty moment 5",
    image: "https://d21q7xesnoiieh.cloudfront.net/fit-in/670x0/filters:quality(95)/marketing/musora/lead-gen/careers/careers-images-06.webp",
  },
  {
    caption: "Bestcoach team and the loyalty moment 6",
    image: "https://bestcoach-front.vercel.app/static/media/9345.cc62baa0e2d8a0f3b408.webp"
  },
];

/* Why section — three paragraphs verbatim */
export const whyHeading = "Why the Loyalty Project";
export const whyParagraphs: string[] = [
  "We believe music has the power to change the world. Picking up an instrument gives someone a voice, and that voice helps them express who they truly are.",
  "When we build our music lesson communities, we put relationships first, always before technology. We're here to help students grow and stay inspired.",
  "Joining The Loyalty Project means more than a job. It's a mission. You'll care about the details, and we'll care about you. From the tools you use to the team you're on, we're in it together.",
];

/* Fill section — 6 images */
export const fillEyebrow = "If you resonate with these then...";
export const fillHeading = "LET'S FILL THE WORLD WITH MUSIC!";
export const fillCards: Moment[] = [
  {
    caption: "Bestcoach Music Loyalty moment 1",
    image: "https://d21q7xesnoiieh.cloudfront.net/fit-in/670x0/filters:quality(95)/marketing/musora/lead-gen/careers/careers-images-07.webp",
  },
  {
    caption: "Bestcoach Music Loyalty moment 2",
    image: "https://d21q7xesnoiieh.cloudfront.net/fit-in/670x0/filters:quality(95)/marketing/musora/lead-gen/careers/careers-images-06.webp",
  },
  {
    caption: "Bestcoach Music Loyalty moment 3",
    image: "https://d21q7xesnoiieh.cloudfront.net/fit-in/710x0/filters:quality(95)/marketing/musora/lead-gen/careers/careers-images-04.webp",
  },
  {
    caption: "Bestcoach Music Loyalty moment 4",
    image: "https://bestcoach-front.vercel.app/static/media/6.1e01f3f5a1ffa39bac3a.webp",
  },
  {
    caption: "Bestcoach Music Loyalty moment 5",
    image: "https://bestcoach-front.vercel.app/static/media/NANA-SARFO.1416a9c1883c8a8e0c13.webp",
  },
  {
    caption: "Bestcoach Music Loyalty moment 6",
    image: "https://bestcoach-front.vercel.app/static/media/Precious.13186eb9aff5b2ee9310.webp",
  },
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

/* Testimonials — 3 rotating */
export const testimonials: Testimonial[] = [
  {
    quote:
      "At Bestcoach Music, creativity and care for people are so perfectly balanced. Bestcoach Music doesn't just talk about community — we live it every day.",
    who: "Nana Sarfo",
    role: "Media Lead, Bestcoach Music",
    image: "https://bestcoach-front.vercel.app/static/media/NANA-SARFO.1416a9c1883c8a8e0c13.webp",
  },
  {
    quote:
      "At Bestcoach Music, talent and humility go hand in hand. People are focused, good at what they do, and genuinely want to collaborate. No ego, just shared goals. That kind of openness is rare, and it's something I deeply value.",
    who: "Tracy Bonful",
    role: "Data Engineering Lead, Bestcoach Music",
    image: "https://bestcoach-front.vercel.app/static/media/6.1e01f3f5a1ffa39bac3a.webp",
  },
  {
    quote:
      "Being part of Bestcoach Music feels like being part of a band. Everyone listens, everyone contributes, and the result is music that moves people. The culture is truly special.",
    who: "Precious Nkrumah",
    role: "Graphics, Creativity & Reliability Lead, Bestcoach Music",
    image: "https://bestcoach-front.vercel.app/static/media/Precious.13186eb9aff5b2ee9310.webp",
  },
];