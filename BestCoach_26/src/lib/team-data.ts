// Team data for Bestcoach Music — executives + hero gallery slides.

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  socials: { label: string; href: string }[];
};

export type HeroSlide = {
  image: string;
  badge: string;
  heading: string;
  sub: string;
  cta?: { label: string; href: string };
};

/* Auto-rotating hero gallery slides.*/
export const teamHeroSlides: HeroSlide[] = [
  {
    image: "https://bestcoach-front.vercel.app/static/media/24.cb44feb0337b0e1f0b46.jpg",
    badge: "The Bestcoach Family",
    heading: "Meet the team behind the music",
    sub: "Coaches, mentors and creatives dedicated to nurturing musicians across Ghana and beyond.",
    cta: { label: "Meet the team", href: "#team" },
  },
  {
    image: "https://bestcoach-front.vercel.app/static/media/Coach.9f8dc9ce950601b9cc93.webp",
    badge: "What we do",
    heading: "Real-time vocal coaching & mentorship",
    sub: "From your first chord to centre-stage confidence — our coaches walk every step with you.",
    cta: { label: "Our services", href: "/#home" },
  },
  {
    image: "https://bestcoach-front.vercel.app/static/media/9345.cc62baa0e2d8a0f3b408.webp",
    badge: "Join the movement",
    heading: "The Singers Sanctuary & Music Mentorship",
    sub: "Flagship events that bring our community together, season after season.",
    cta: { label: "See events", href: "/#events" },
  },
  {
    image: "https://bestcoach-front.vercel.app/static/media/playing.a2f59faf3b34c5c9aed4.webp",
    badge: "Bestcoach Music",
    heading: "Life is better with music 🎶",
    sub: "Enroll today and let the music flow. Standard, Exclusive & Flexi-Learn packages available.",
    cta: { label: "View packages", href: "/#programs" },
  },
];

/* Brand-level social links shown on every executive card.
   Personalise per-executive by overriding `socials` on a member. */
const executiveSocials: { label: string; href: string }[] = [
  { label: "WhatsApp", href: "https://wa.me/message/CJZ4XQCNRWWTB1" },
  { label: "Facebook", href: "https://facebook.com/bestcoachmusic" },
  { label: "Instagram", href: "https://www.instagram.com/bestcoachmusic" },
  { label: "TikTok", href: "https://vm.tiktok.com/ZMS68pSTC/" },
  { label: "YouTube", href: "https://youtube.com/@bestcoachmusic" },
];
export const teamMembers: TeamMember[] = [
  {
    id: "ameko",
    name: "Mr. Emmanuel Ameko",
    role: "Founder & CEO",
    bio: "Emmanuel sets the vision for Bestcoach Music and leads the academy’s growth. His focus is making music education more accessible while building a welcoming community where musicians can learn, create and thrive.",
    image: "https://bestcoach-front.vercel.app/static/media/3.5046414ecfe9d11edfb4.jpg",
    socials: executiveSocials,
  },
  {
    id: "jeffrey",
    name: "Mr. Jeffrey Addo",
    role: "Executive Director",
    bio: "Jeffrey guides the executive team and helps turn the academy’s vision into focused, collaborative leadership. Through his mentorship, he also encourages singers to develop their technique, confidence and own musical voice.",
    image: "https://bestcoach-front.vercel.app/static/media/Mr.Jeffrey-1_.8319baf391b2ea9eb556.webp",
    socials: executiveSocials,
  },
  {
    id: "emma",
    name: "Mr. Emmanuel Boadi",
    role: "Operations & Curriculum Lead",
    bio: "Emmanuel Boadi leads the development of practical, engaging learning pathways across instruments and music theory. He helps keep the curriculum clear, consistent and grounded in the joy of making music.",
    image: "https://bestcoach-front.vercel.app/static/media/7.d959c57ec04b02350809.webp",
    socials: executiveSocials,
  },
  {
    id: "ekow",
    name: "Mr.Ekow Spio Abaidoo",
    role: "Technology & Product Lead",
    bio: "Ekow shapes the technology and product experience behind Bestcoach Music. He works to make the platform intuitive and dependable, helping learners and coaches connect with the tools they need wherever they are.",
    image: "https://bestcoach-front.vercel.app/static/media/TECH.95cac61e2e195af7f163.webp",
    socials: executiveSocials,
  },
  {
    id: "precious",
    name: "Miss Precious Nkrumah",
    role: "Graphic Design & Events Lead",
    bio: "Precious brings Bestcoach Music’s visual identity and community events to life. From creative design to flagship gatherings such as TSS and TMME, she helps make every experience memorable and engaging.",
    image: "https://bestcoach-front.vercel.app/static/media/Precious.13186eb9aff5b2ee9310.webp",
    socials: executiveSocials,
  },
  {
    id: "tracy",
    name: "Miss Tracy Bonful",
    role: "Data Manager",
    bio: "Tracy brings care and clarity to the information that supports the academy. Her work helps the team understand its learners and keep decisions, services and day-to-day coordination informed by reliable data.",
    image: "https://bestcoach-front.vercel.app/static/media/6.1e01f3f5a1ffa39bac3a.webp",
    socials: executiveSocials,
  },
   {
    id: "gifty",
    name: "Mrs. Gifty Obeng",
    role: "Human Resources Lead",
    bio: "Gifty supports the people who make Bestcoach Music what it is. As Human Resources Lead, she helps foster a respectful, supportive environment where team members can contribute, collaborate and grow.",
    image: "https://bestcoach-front.vercel.app/static/media/2.549f179bfc4fe9934975.jpg",
    socials: executiveSocials,
  },
   {
    id: "nana",
    name: "Mr. Nana Sarfo",
    role: "Media & Communications Lead",
    bio: "Nana shapes how Bestcoach Music shares its stories and connects with the public. Through thoughtful media and communications, he helps keep learners, families and the wider music community informed and inspired.",
    image: "https://bestcoach-front.vercel.app/static/media/NANA-SARFO.1416a9c1883c8a8e0c13.webp",
    socials: executiveSocials,
  },
   {
    id: "mathias",
    name: "Mr. Mathias ",
    role: "Assistant Media & Communications Lead",
    bio: "Mathias supports the media and communications team by helping create and coordinate content for the Bestcoach community. He brings an extra pair of creative hands to the stories, updates and moments worth sharing.",
    image: "https://bestcoach-front.vercel.app/static/media/Mathias-4_.b79907a138ffd479bfb5.webp",
    socials: executiveSocials,
  },
   {
    id: "judith",
    name: "Mrs. Judith Appiah",
    role: "Music Team Lead ",
    bio: "Judith leads the Music Team, supporting the musicians and coaches who bring learning to life. She helps keep the team focused on musical growth, encouraging learners to build their skills and confidence one step at a time.",
    image: "https://bestcoach-front.vercel.app/static/media/Judith%20(1).6998eba6f3c04c38809e.jpeg",
    socials: executiveSocials,
  },

];

export const teamStats = [
  { value: "10", label: "Executives" },
  { value: "1,000+", label: "Members" },
  { value: "2+", label: "Flagship Events" },
  { value: "Accra, GH", label: "Headquartered" },
];