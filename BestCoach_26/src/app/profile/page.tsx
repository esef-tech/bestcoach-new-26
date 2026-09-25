"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/* Resize an uploaded image to a square data URL (cover-crop, JPEG q85). */
function fileToResizedDataUrl(file: File, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

type ProfileResponse = {
  ok?: boolean;
  message?: string;
  user?: { username?: string; image?: string | null };
};

async function readProfileResponse(response: Response): Promise<ProfileResponse> {
  const text = await response.text();
  if (!text.trim()) {
    return { ok: false, message: "The server returned an empty response." };
  }

  try {
    return JSON.parse(text) as ProfileResponse;
  } catch {
    return { ok: false, message: "The server returned an invalid response." };
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await readProfileResponse(res);
        if (!active) return;
        if (data.ok && data.user) {
          setUsername(data.user.username ?? "");
          setImage(data.user.image ?? null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [status]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    try {
      const dataUrl = await fileToResizedDataUrl(file, 256);
      setImage(dataUrl);
      toast.success("Picture ready — click Save to apply.");
    } catch (err) {
      console.error(err);
      toast.error("Could not process that image.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Username cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, image: image ?? "" }),
      });
      const data = await readProfileResponse(res);
      if (!res.ok || !data.ok) {
        toast.error(data.message || "Could not save profile.");
        return;
      }
      window.dispatchEvent(
        new CustomEvent("profile-updated", {
          detail: { username: data.user?.username ?? username, image: data.user?.image ?? null },
        })
      );
      // Refresh the session so the navbar avatar/username updates live
      await update({});
      toast.success("Profile updated! 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const initials = (username || session?.user?.email || "U")
    .slice(0, 2)
    .toUpperCase();

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#00394f] to-[#001f2e]">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (status !== "authenticated") return null;

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-[#00394f] to-[#001f2e] px-4 py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-10 text-white"
        aria-hidden="true"
      >
        <span className="absolute left-[8%] top-[18%] text-4xl">♪</span>
        <span className="absolute right-[12%] top-[28%] text-5xl">♫</span>
        <span className="absolute left-[20%] bottom-[16%] text-3xl">♬</span>
      </div>

      <Card className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border-0 bg-white/92 shadow-2xl backdrop-blur-xl">
        <CardContent className="p-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-[#00394f]">
            Your Profile
          </h2>

          {/* Avatar with upload */}
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-[#00394f] text-2xl font-bold text-white">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-white shadow-md transition hover:bg-amber-600"
                aria-label="Upload profile picture"
              >
                <Upload className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
            </div>
            {image && (
              <button
                type="button"
                onClick={() => setImage(null)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500"
              >
                <X className="h-3 w-3" /> Remove picture
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-lg font-bold text-[#00394f]">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                maxLength={40}
                className="text-lg font-bold text-[#00394f]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-bold text-[#00394f]">Email</Label>
              <Input
                type="email"
                value={session.user?.email ?? ""}
                disabled
                className="bg-muted/50 text-lg font-bold text-[#00394f] opacity-100"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed.
              </p>
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="mt-2 h-12 w-full rounded-full bg-[#00394f] text-base font-bold text-white transition-transform duration-300 hover:scale-[1.03] hover:bg-[#00293a] disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>

          <Link
            href="/"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}