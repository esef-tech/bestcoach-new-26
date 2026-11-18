// The Loyalty Project (TLP) — content matching the provided design exactly.
// Dark navy (#001a26 / #04121e) + orange (#f59e0b) palette.

export type TimelineStep = {
  num: string;
  icon: string; // lucide icon name
  title: string;
  desc: string;
};

export type Perk = {
  icon: string; // lucide icon name
  title: string;
  desc?: string;
};

export type Moment = {
  caption: string;
  image?: string;
};

export type Testimonial = {
  quote: string;
  who: string;
  role: string;
  image: string;
};

export type PartnerCard = {
  icon: string;
  title: string;
  desc: string;
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

/* Team moments masonry (5 images) */
export const moments: Moment[] = [
  { caption: "Bestcoach team and the loyalty moment 2", image: "https://bestcoach-front.vercel.app/static/media/Coach.9f8dc9ce950601b9cc93.webp" },
  { caption: "Bestcoach team and the loyalty moment 3", image: "https://bestcoach-front.vercel.app/static/media/8.53ee105175f6e66eaa9a.webp" },
  { caption: "Bestcoach team and the loyalty moment 4", image: "https://d21q7xesnoiieh.cloudfront.net/fit-in/670x0/filters:quality(95)/marketing/musora/lead-gen/careers/careers-images-09.webp" },
  { caption: "Bestcoach team and the loyalty moment 5", image: "https://d21q7xesnoiieh.cloudfront.net/fit-in/670x0/filters:quality(95)/marketing/musora/lead-gen/careers/careers-images-06.webp" },
  { caption: "Bestcoach team and the loyalty moment 6", image: "https://bestcoach-front.vercel.app/static/media/9345.cc62baa0e2d8a0f3b408.webp" },
];

/* Why section */
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
  { caption: "Bestcoach Music Loyalty moment 1", image: "https://d21q7xesnoiieh.cloudfront.net/fit-in/670x0/filters:quality(95)/marketing/musora/lead-gen/careers/careers-images-07.webp" },
  { caption: "Bestcoach Music Loyalty moment 2", image: "https://d21q7xesnoiieh.cloudfront.net/fit-in/670x0/filters:quality(95)/marketing/musora/lead-gen/careers/careers-images-06.webp" },
  { caption: "Bestcoach Music Loyalty moment 3", image: "https://d21q7xesnoiieh.cloudfront.net/fit-in/710x0/filters:quality(95)/marketing/musora/lead-gen/careers/careers-images-04.webp" },
  { caption: "Bestcoach Music Loyalty moment 4", image: "https://bestcoach-front.vercel.app/static/media/6.1e01f3f5a1ffa39bac3a.webp" },
  { caption: "Bestcoach Music Loyalty moment 5", image: "https://bestcoach-front.vercel.app/static/media/NANA-SARFO.1416a9c1883c8a8e0c13.webp" },
  { caption: "Bestcoach Music Loyalty moment 6", image: "https://bestcoach-front.vercel.app/static/media/Precious.13186eb9aff5b2ee9310.webp" },
];

/* What to Expect When You Enrol — 8-step church enrollment timeline */
export const expectHeading = "What to Expect When You Enrol";
export const expectHeadingAccent = "When You Enrol";
export const timeline: TimelineStep[] = [
  { num: "1", icon: "Church", title: "Your Church Joins", desc: "A church registers as a TLP partner." },
  { num: "2", icon: "UserPlus", title: "Member Enrolment", desc: "The church coordinator adds participating choir members and confirms their details." },
  { num: "3", icon: "HandHeart", title: "Welcome & Orientation", desc: "Members receive access instructions and guidance on using the learning platform." },
  { num: "4", icon: "ClipboardCheck", title: "Skills Assessment", desc: "Members identify their current level and development goals." },
  { num: "5", icon: "Route", title: "Your Learning Path", desc: "Members are guided into the appropriate music level and spiritual formation modules." },
  { num: "6", icon: "PlayCircle", title: "Learn, Practise & Participate", desc: "Members watch lessons, complete exercises and apply what they learn in rehearsals and ministry." },
  { num: "7", icon: "LineChart", title: "Feedback & Progress", desc: "Members receive guidance and their church coordinator monitors participation and progress." },
  { num: "8", icon: "Sprout", title: "Grow Together", desc: "Members participate in masterclasses, mentorship opportunities and ongoing development." },
];

/* Perks & Benefits — 12 title-only cards */
export const perksHeading = "Perks & Benefits";
export const perks: Perk[] = [
  { icon: "Music", title: "Structured Music Training" },
  { icon: "Church", title: "Spiritual Formation" },
  { icon: "Mic2", title: "Practical Vocal & Musical Development" },
  { icon: "GraduationCap", title: "Expert Instructor Guidance" },
  { icon: "Video", title: "Monthly Live Masterclasses" },
  { icon: "TrendingUp", title: "Personal Learning Progress" },
  { icon: "LayoutDashboard", title: "Church Progress Dashboard" },
  { icon: "Users", title: "Mentorship & Feedback" },
  { icon: "UsersRound", title: "Learning Community" },
  { icon: "ShieldCheck", title: "Ministry Readiness" },
  { icon: "Award", title: "Recognition for Partner Churches" },
  { icon: "Infinity", title: "Continued Growth Opportunities" },
];
export const perksTagline = "TOGETHER, WE RAISE A HIGHER STANDARD IN WORSHIP.";

/* Benefits for Partner Churches — new section */
export const partner = {
  headingLine1: "Benefits for",
  headingLine2: "Partner Churches",
  intro:
    "When your church partners with The Loyalty Project, you're investing in your music ministry and the people who serve through it.",
  cards: [
    { icon: "Users", title: "Stronger Music Departments", desc: "Develop more knowledgeable, skilled and disciplined music teams." },
    { icon: "BarChart3", title: "Leadership Oversight", desc: "Monitor the development and participation of your members." },
    { icon: "Settings", title: "Reduced Training Burden", desc: "Access structured learning resources without reinventing your own programmes." },
    { icon: "Trophy", title: "Improved Ministry Standards", desc: "Strengthen musical competence and spiritual commitment." },
    { icon: "Star", title: "Access to Experts", desc: "Benefit from experienced instructors and industry professionals." },
    { icon: "ShieldCheck", title: "Founding Church Recognition", desc: "Be recognised for being among the churches investing in the next generation." },
  ] as PartnerCard[],
  ctaLine1: "Your Gift Deserves Development.",
  ctaLine2: "Your Ministry Deserves Investment.",
  ctaTagline: "Let's Build Better Musicians. Let's Raise Better Ministers.",
  ctaParagraph:
    "Join a growing community of churches and musicians committed to excellence, spiritual growth and the future of gospel music.",
  pills: [
    { label: "For Churches", icon: "Church" },
    { label: "For Musicians", icon: "Music" },
    { label: "For Music Leaders", icon: "Users" },
  ],
  ctaButton: "Become Part of The Loyalty Project.",
};

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