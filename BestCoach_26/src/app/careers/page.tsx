"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Briefcase,
  MapPin,
  Clock,
  Send,
  Heart,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Loader2,
  Music,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TopBar } from "@/components/bestcoach/topbar";
import { Navbar } from "@/components/bestcoach/navbar";
import { Footer } from "@/components/bestcoach/footer";
import { AuthPromptDialog } from "@/components/bestcoach/auth-prompt";
import {
  auth as firebaseAuth,
  db as firestoreDb,
  firebaseConfigured,
  storage,
} from "@/lib/firebase";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { deleteObject, ref as storageRef, uploadBytes } from "firebase/storage";
import {
  CAREER_ALLOWED_FILE_TYPES,
  CAREER_UPLOAD_ACCEPT,
  CAREER_UPLOAD_FIELDS,
  CAREER_UPLOAD_MAX_FILE_BYTES,
  CAREER_UPLOAD_MAX_TOTAL_BYTES,
  type CareerUploadField,
} from "@/lib/career-uploads";

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
};

const PERKS = [
  {
    icon: GraduationCap,
    title: "Grow with us",
    desc: "Mentorship, training and a clear progression path — your craft keeps levelling up.",
  },
  {
    icon: Heart,
    title: "Make an impact",
    desc: "Shape musicians' lives every day, from first chord to centre-stage confidence.",
  },
  {
    icon: Clock,
    title: "Flexible & hybrid",
    desc: "Roles with on-site, hybrid and part-time options. We trust you to do great work.",
  },
  {
    icon: Users,
    title: "Belong to a community",
    desc: "Join a vibrant, supportive family of coaches, learners and creatives across Ghana.",
  },
];

const HEADER_IMAGE = "https://bestcoach-front.vercel.app/static/media/8.53ee105175f6e66eaa9a.webp";

const CAREER_PAGE_SECTIONS = [
  {
    title: "Careers at Bestcoach",
    text: "Build your career in music. Turn your passion for music into purpose and help nurture Ghana's next generation of musicians: coaches, engineers, creatives and operators.",
    href: "#careers-home",
  },
  {
    title: "Why Bestcoach",
    text: PERKS.map((perk) => `${perk.title} ${perk.desc}`).join(" "),
    href: "#benefits",
  },
  {
    title: "Open positions",
    text: "Find your role. Browse open positions and job opportunities. Don't see a fit? Send your CV and we keep great people on file.",
    href: "#roles",
  },
  {
    title: "Application process",
    text: "Submit your application, full name, email, phone, position, portfolio, LinkedIn, resume, CV link, and tell us why we should hire you. We review every application personally and respond within 5 working days.",
    href: "#apply",
  },
  {
    title: "Join our team",
    text: "Come build the future of music education with us. Life is better with music.",
    href: "#join",
  },
];

export default function CareersPage() {
  const { status } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    portfolio: "",
    message: "",
    resumeUrl: "",
  });
  const [uploads, setUploads] = useState<Partial<Record<CareerUploadField, File>>>({});
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const authenticated = status === "authenticated";
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredJobs = jobs.filter((job) =>
    [
      job.title,
      job.department,
      job.location,
      job.type,
      job.description,
      job.requirements,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch)
  );
  const matchingSections = normalizedSearch
    ? CAREER_PAGE_SECTIONS.filter((section) =>
        `${section.title} ${section.text}`.toLowerCase().includes(normalizedSearch)
      )
    : [];

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/careers/jobs");
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.message || "Could not load open positions.");
        }
        setJobs(data.jobs);
      } catch (err) {
        console.error(err);
        setJobsError("Could not load open positions. Please try again shortly.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const applyFor = (job: Job) => {
    if (!authenticated) {
      setAuthPromptOpen(true);
      return;
    }
    setSelectedJobId(job.id);
    setForm((f) => ({ ...f, position: job.title }));
    document
      .getElementById("apply")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticated) {
      setAuthPromptOpen(true);
      return;
    }
    if (!form.name || !form.email || !form.phone || !form.position || !form.message) {
      toast.error("Please fill in name, email, phone, position and a short message.");
      return;
    }
    const selectedFiles = CAREER_UPLOAD_FIELDS.flatMap(({ key }) => {
      const file = uploads[key];
      return file ? [{ key, file }] : [];
    });
    const totalBytes = selectedFiles.reduce((total, { file }) => total + file.size, 0);
    if (totalBytes > CAREER_UPLOAD_MAX_TOTAL_BYTES) {
      toast.error("Your attachments exceed the 20 MB total upload limit.");
      return;
    }
    for (const { key, file } of selectedFiles) {
      const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
      const allowedType = CAREER_ALLOWED_FILE_TYPES[extension];
      if (
        !allowedType ||
        (file.type && file.type !== allowedType) ||
        file.size > CAREER_UPLOAD_MAX_FILE_BYTES
      ) {
        toast.error(
          `${CAREER_UPLOAD_FIELDS.find((field) => field.key === key)?.label} must be a PDF, PNG, JPG, or DOCX file no larger than 5 MB.`
        );
        return;
      }
    }
    if (!firebaseConfigured || !firestoreDb || !storage || !firebaseAuth) {
      toast.error("File storage is not configured. Please contact support.");
      return;
    }
    const firebaseUser = firebaseAuth.currentUser;
    if (!firebaseUser) {
      toast.error(
        "Use Google or Microsoft sign-in to upload application files. Your account must be signed in with Firebase."
      );
      return;
    }

    const firebaseStorage = storage;
    const firebaseFirestore = firestoreDb;
    setSubmitting(true);
    const applicationId = crypto.randomUUID();
    const uploadedStoragePaths: string[] = [];
    let firestoreRecordCreated = false;
    try {
      const attachmentMetadata: {
        kind: CareerUploadField;
        fileName: string;
        mimeType: string;
        fileSize: number;
        storagePath: string;
      }[] = [];
      for (const { key, file } of selectedFiles) {
        const path = `careerApplications/${firebaseUser.uid}/${applicationId}/${key}`;
        const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
        const mimeType = file.type || CAREER_ALLOWED_FILE_TYPES[extension];
        const fileRef = storageRef(firebaseStorage, path);
        await uploadBytes(fileRef, file, {
          contentType: mimeType,
        });
        uploadedStoragePaths.push(path);
        attachmentMetadata.push({
          kind: key,
          fileName: file.name,
          mimeType,
          fileSize: file.size,
          storagePath: path,
        });
      }

      const applicationRecord = {
        applicationId,
        ownerUid: firebaseUser.uid,
        jobId: selectedJobId || null,
        ...form,
        attachments: attachmentMetadata,
        status: "submitted",
        timestamp: serverTimestamp(),
      };
      await setDoc(
        doc(firebaseFirestore, "careerApplications", applicationId),
        applicationRecord
      );
      firestoreRecordCreated = true;

      const body = new FormData();
      body.set("applicationId", applicationId);
      body.set("jobId", selectedJobId);
      for (const [key, value] of Object.entries(form)) {
        body.set(key, value);
      }
      for (const { key, file } of selectedFiles) {
        body.set(key, file);
      }

      const res = await fetch("/api/careers/apply", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (res.status === 401) {
        setAuthPromptOpen(true);
        throw new Error("Sign in again to submit your application.");
      }
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Could not submit application.");
      }

      toast.success(data.message);
      setForm({
        name: "",
        email: "",
        phone: "",
        position: "",
        portfolio: "",
        message: "",
        resumeUrl: "",
      });
      setSelectedJobId("");
      setUploads({});
      for (const field of CAREER_UPLOAD_FIELDS) {
        const input = document.getElementById(
          `c-upload-${field.key}`
        ) as HTMLInputElement | null;
        if (input) input.value = "";
      }
    } catch (error) {
      console.error("[careers] application upload failed:", error);
      if (firestoreRecordCreated) {
        try {
          await deleteDoc(doc(firebaseFirestore, "careerApplications", applicationId));
        } catch (cleanupError) {
          console.error("[careers] Firestore cleanup failed:", cleanupError);
        }
      }
      await Promise.all(
        uploadedStoragePaths.map(async (path) => {
          try {
            await deleteObject(storageRef(firebaseStorage, path));
          } catch (cleanupError) {
            console.error(`[careers] Storage cleanup failed for ${path}:`, cleanupError);
          }
        })
      );
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not securely submit your application and attachments."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        {/* Header with music-careers image + CTA */}
        <section id="careers-home" className="relative h-[60vh] min-h-[420px] w-full overflow-hidden bg-[#00394f]">
          <img
            src={HEADER_IMAGE}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full scale-105 object-cover blur-sm"
          />
          <img
            src={HEADER_IMAGE}
            alt="Careers in music at Bestcoach"
            className="relative z-10 size-full object-contain"
            fetchPriority="high"
          />
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#001f2e]/55 via-[#00394f]/10 to-transparent" />
          <div className="absolute inset-0 z-30 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-6">
              <div className="max-w-2xl">
                <Badge className="mb-4 bg-amber-500/90 text-[#001f2e] hover:bg-amber-500">
                  <Sparkles className="mr-1 size-3.5" /> Careers at Bestcoach
                </Badge>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg sm:text-4xl md:text-5xl">
                  Build your career in music
                </h1>
                <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">
                  Turn your passion for music into purpose. Join the team
                  nurturing Ghana&apos;s next generation of musicians — coaches,
                  engineers, creatives and operators.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    asChild
                    className="h-12 rounded-full bg-amber-500 px-7 text-base font-bold text-[#001f2e] hover:bg-amber-400"
                  >
                    <a href="#roles">
                      View open roles <ArrowRight className="ml-1 size-4" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 rounded-full border-white/40 bg-transparent px-7 text-base font-bold text-white hover:bg-white/10"
                  >
                    <a href="#apply">
                      <Send className="mr-1 size-4" /> Submit your CV
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why join us */}
        <section id="benefits" className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 text-center">
              <Badge className="mb-3 bg-accent/20 text-accent-foreground">
                Why Bestcoach
              </Badge>
              <h2 className="text-3xl font-bold text-[#00394f] md:text-4xl">
                More than a job — a calling
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PERKS.map((p) => (
                <div
                  key={p.title}
                  className="rounded-3xl border bg-card p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-amber-500/15 text-amber-600">
                    <p.icon className="size-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#00394f]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open roles */}
        <section id="roles" className="bg-muted/30 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 text-center">
              <Badge className="mb-3 bg-accent/20 text-accent-foreground">
                Open positions
              </Badge>
              <h2 className="text-3xl font-bold text-[#00394f] md:text-4xl">
                Find your role
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Don&apos;t see a fit?{" "}
                <a href="#apply" className="font-medium text-amber-600 hover:underline">
                  Send your CV
                </a>{" "}
                — we keep great people on file.
              </p>
            </div>

            <div className="mx-auto mb-8 max-w-2xl">
              <Label htmlFor="careers-search" className="sr-only">
                Search jobs and careers page content
              </Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="careers-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search jobs, benefits, and application information"
                  className="h-12 rounded-full bg-background pl-12 pr-5"
                />
              </div>
              {normalizedSearch && (
                <div className="mt-3 text-sm text-muted-foreground" aria-live="polite">
                  {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} found
                  {matchingSections.length > 0 &&
                    ` · ${matchingSections.length} page ${matchingSections.length === 1 ? "section" : "sections"} match`}
                  {matchingSections.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {matchingSections.map((section) => (
                        <a
                          key={section.title}
                          href={section.href}
                          className="rounded-full border px-3 py-1 text-xs font-medium text-[#00394f] hover:bg-accent/30"
                        >
                          {section.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : jobsError ? (
              <p className="text-center text-destructive">{jobsError}</p>
            ) : jobs.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No open positions right now — check back soon.
              </p>
            ) : filteredJobs.length === 0 ? (
              <p className="text-center text-muted-foreground">
                {matchingSections.length > 0
                  ? `No open roles match “${searchQuery}”. See the matching page sections above.`
                  : `No jobs or page sections match “${searchQuery}”. Try another search.`}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {filteredJobs.map((job) => (
                  <article
                    key={job.id}
                    className="flex flex-col rounded-3xl border bg-card p-6 shadow-sm transition hover:shadow-md"
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold text-[#00394f]">
                        {job.title}
                      </h3>
                      <Badge variant="secondary" className="bg-amber-500/15 text-amber-700">
                        {job.department}
                      </Badge>
                    </div>
                    <div className="mb-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="size-4" /> {job.type}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-4" /> {job.location}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{job.description}</p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">You bring:</span>{" "}
                      {job.requirements}
                    </p>
                    <Button
                      type="button"
                      onClick={() => applyFor(job)}
                      disabled={status === "loading"}
                      className="mt-5 h-11 w-full rounded-full bg-[#00394f] font-bold text-white hover:bg-[#00293a]"
                    >
                      Apply for {job.title} <ArrowRight className="ml-1 size-4" />
                    </Button>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Application form */}
        <section id="apply" className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-2xl px-6">
            <div className="mb-8 text-center">
              <Badge className="mb-3 bg-accent/20 text-accent-foreground">
                Apply now
              </Badge>
              <h2 className="text-3xl font-bold text-[#00394f] md:text-4xl">
                Submit your application
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Tell us about yourself. We review every application personally.
              </p>
            </div>

            {authenticated ? (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="c-name">Full name</Label>
                  <Input
                    id="c-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-email">Email</Label>
                  <Input
                    id="c-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-phone">Phone</Label>
                  <Input
                    id="c-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-position">Position</Label>
                  <Select
                    value={form.position}
                    onValueChange={(v) => {
                      setForm({ ...form, position: v });
                      const job = jobs.find((j) => j.title === v);
                      setSelectedJobId(job?.id ?? "");
                    }}
                  >
                    <SelectTrigger id="c-position">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((j) => (
                        <SelectItem key={j.id} value={j.title}>
                          {j.title}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other (specify in message)">
                        Other (specify in message)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="c-portfolio">Portfolio / LinkedIn (optional)</Label>
                  <Input
                    id="c-portfolio"
                    type="url"
                    placeholder="https://"
                    value={form.portfolio}
                    onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="c-resume">Resume / CV link (optional)</Label>
                  <Input
                    id="c-resume"
                    type="url"
                    placeholder="https://drive.google.com/…"
                    value={form.resumeUrl}
                    onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
                  />
                </div>
                {CAREER_UPLOAD_FIELDS.map(({ key, label }) => (
                  <div key={key} className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor={`c-upload-${key}`}>{label} file (optional)</Label>
                    <Input
                      id={`c-upload-${key}`}
                      type="file"
                      accept={CAREER_UPLOAD_ACCEPT}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        setUploads((current) => ({
                          ...current,
                          [key]: file,
                        }));
                      }}
                      className="h-auto min-h-10 cursor-pointer py-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      PDF, PNG, JPG, or DOCX; up to 5 MB per file.
                      {uploads[key] && ` Selected: ${uploads[key].name}`}
                    </p>
                  </div>
                ))}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="c-message">Why should we hire you?</Label>
                  <Textarea
                    id="c-message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="mt-6 h-12 w-full rounded-full bg-[#00394f] text-base font-bold text-white hover:bg-[#00293a] disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="size-4" /> Submit application
                  </>
                )}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                We&apos;ll get back to you within 5 working days.
              </p>
            </form>
            ) : (
              <div className="rounded-3xl border bg-card p-8 text-center shadow-sm">
                <Briefcase className="mx-auto mb-4 size-10 text-[#00394f]" />
                <h3 className="text-xl font-semibold text-[#00394f]">
                  Sign in to apply
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Create an account or sign in to submit an application. You can
                  complete the application form after you sign in.
                </p>
                <Button
                  type="button"
                  onClick={() => setAuthPromptOpen(true)}
                  disabled={status === "loading"}
                  className="mt-5 h-11 rounded-full bg-[#00394f] px-6 font-bold text-white hover:bg-[#00293a]"
                >
                  {status === "loading" ? "Checking sign-in..." : "Sign in or sign up"}
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Footer CTA */}
        <section id="join" className="bg-gradient-to-b from-[#00394f] to-[#001f2e] py-14 text-center text-white">
          <div className="mx-auto max-w-3xl px-6">
            <Music className="mx-auto mb-3 size-8 text-amber-500" />
            <h2 className="text-2xl font-bold md:text-3xl">
              Life is better with music
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-white/80">
              Come build the future of music education with us.
            </p>
            <Button
              asChild
              className="mt-5 h-11 rounded-full bg-amber-500 px-7 font-bold text-[#001f2e] hover:bg-amber-400"
            >
              <Link href="/team">Meet the team</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <AuthPromptDialog
        open={authPromptOpen}
        onOpenChange={setAuthPromptOpen}
        message="Sign in or create an account before applying for a job."
      />
    </div>
  );
}