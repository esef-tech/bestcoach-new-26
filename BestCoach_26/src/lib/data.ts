// Shared content data for Bestcoach Music (consolidated from the original React app)

export type Package = {
  title: string
  desc: string
  img: string
  alt: string
  age: string
  price: string
  duration: string
  schedule: string
  featured?: boolean
}

export const packages: Package[] = [
  {
    title: "Standard Package",
    desc: "At BestCoach, we inspire creativity and self-expression. Enroll in our vibrant music program to cultivate rhythm, musicality, and confidence.",
    img: "https://www.communitymusicschool.com/wp-content/uploads/2024/10/Joyful-Voices-2024-1-scaled-e1729108515794-2400x1480.jpg",
    alt: "Bestcoach Music standard package",
    age: "For everyone",
    price: "GH₵500.00 per month",
    duration: "1 hour per session",
    schedule: "Twice a week",
  },
  {
    title: "Exclusive Service Package",
    desc: "Enhance life with inspiring music. Unlock your potential through expert instruction. Enroll in our music program today!",
    img: "https://www.washingtonperformingarts.org/wp-content/uploads/2023/12/about-the-choir-RS89401_2023LivingTheDream_FEB5_00758-lpr.webp",
    alt: "Bestcoach Music exclusive service package",
    age: "For everyone",
    price: "GH₵1,200.00 per month",
    duration: "2 hours per session",
    schedule: "On Demand",
    featured: true,
  },
  {
    title: "Flexi-Learn Package",
    desc: "Whether you're a beginner or looking to refine your skills, BestCoach is designed just for you!",
    img: "https://images.squarespace-cdn.com/content/v1/6213f6b6150312039937363e/4bd42772-e43d-4891-97b2-2f7cc06d9e47/20231217__A7C1741.jpg",
    alt: "Bestcoach Music flexi-learn package",
    age: "For everyone",
    price: "GH₵200.00 per month",
    duration: "1 hour per session",
    schedule: "4-times a month",
  },
]

export const services: { name: string; icon: string }[] = [
  { name: "Piano Lessons", icon: "piano" },
  { name: "Drum Lessons", icon: "drum" },
  { name: "Lead & Acoustic Guitar Lessons", icon: "guitar" },
  { name: "Trumpet Lessons", icon: "trumpet" },
  { name: "Clarinet Lessons", icon: "clarinet" },
  { name: "Music Theory", icon: "theory" },
  { name: "Sound Engineering Services", icon: "sound" },
  { name: "Sound Production for events", icon: "production" },
  { name: "Musical Instruments Rentals", icon: "rental" },
  { name: "Musical Instruments Repairs", icon: "repair" },
  { name: "Musical Instruments Purchase", icon: "purchase" },
  { name: "Workshops", icon: "workshop" },
  { name: "Instrumentation Services", icon: "instrumentation" },
]

export const faqs: { question: string; answer: string }[] = [
  {
    question: "What different types of memberships are available?",
    answer:
      "We offer free trials, monthly, and annual memberships for individuals, schools, and churches.",
  },
  {
    question: "Do you have a specific lesson curriculum?",
    answer:
      "Yes, our curriculum covers beginner to advanced levels for various instruments.",
  },
  {
    question: "I ordered a product from you, how can I track my shipment?",
    answer:
      "Use the tracking link sent to your email or contact support with your order ID.",
  },
  {
    question: "What's the difference between free and paid content?",
    answer:
      "Free content includes basic tips; paid unlocks full lessons and resources.",
  },
  {
    question: "What are the terms for your refund guarantee?",
    answer: "Refunds within 30 days for unused services.",
  },
  {
    question: "Does Bestcoach cover customs fees?",
    answer: "No, customs fees are the responsibility of the customer.",
  },
]

export const timeline: { year: string; desc: string }[] = [
  { year: "2003", desc: "BreakSticks.com launched." },
  {
    year: "2008",
    desc: "Acquired PianoLessons.com, launched The Piano System, first YouTube video.",
  },
  { year: "2016", desc: "Lisa Witt joins the team." },
  { year: "2019", desc: "Viral lesson released." },
  { year: "2020", desc: "Reached 10,000+ members." },
  { year: "2021", desc: "App launched." },
  { year: "2022", desc: "Coaches program introduced." },
]

export const metrics: { value: string; label: string }[] = [
  { value: "1,000+", label: "Members" },
  { value: "100+", label: "Pageviews" },
  { value: "100+", label: "Instagram" },
  { value: "100+", label: "Facebook" },
  { value: "9+", label: "Executives" },
  { value: "2+", label: "Events" },
]

export const contactInfo = {
  address: "Dansoman Control-down, World Temple AG, Accra, Ghana",
  email: "bestcoachmusic@gmail.com",
  phones: ["+233 5930 88047", "+233 2085 02819"],
  hours: "Monday - Friday, 8AM - 5PM",
  whatsapp: "https://wa.me/message/CJZ4XQCNRWWTB1",
  telegram: "https://t.me/bestcoachmusic",
  socials: {
    whatsapp: "https://wa.me/message/CJZ4XQCNRWWTB1",
    facebook: "https://facebook.com/bestcoachmusic",
    tiktok: "https://vm.tiktok.com/ZMS68pSTC/",
    instagram:
      "https://www.instagram.com/bestcoachmusic?igsh=YWhpbHMwc3UzNWth",
  },
  linktree: "https://linktr.ee/bestcoach_music",
  enrollForm: "https://form.jotform.com/252515722619559",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.1421523060635!2d-0.2754977242975032!3d5.545931633749404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9790ccb546c7%3A0xc3c829323923c9f8!2sWord%20Temple%2C%20Assemblies%20of%20God%20Church!5e0!3m2!1sen!2sgh!4v1769994147843!5m2!1sen!2sgh",
}

export const events = [
  {
    id: "tss",
    title: "The Singers Sanctuary",
    short: "TSS",
    desc: "A dedicated gathering for vocalists — real-time vocal coaching, harmony practice and performance in a supportive community.",
    img: "https://bestcoachmusic.netlify.app/IMAGES/bestcoach-pictures/9345.jpg",
  },
  {
    id: "tmme",
    title: "The Music Mentorship Experience",
    short: "TMME",
    desc: "An ongoing mentorship program pairing learners with experienced coaches across instruments to accelerate musical growth.",
    img: "https://mcmusicschool.org/wp-content/uploads/2024/07/PGH51821-1536x1024.jpeg",
  },
]
