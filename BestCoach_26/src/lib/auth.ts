import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";

type FirebaseAccount = {
  localId: string;
  email?: string;
  displayName?: string;
  photoUrl?: string;
};

async function verifyFirebaseToken(idToken: string): Promise<FirebaseAccount | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
    }
  );
  if (!response.ok) return null;

  const data = (await response.json()) as { users?: FirebaseAccount[] };
  return data.users?.[0] ?? null;
}

function usernameFromAccount(account: FirebaseAccount) {
  const fallback = account.email?.split("@")[0] || "Bestcoach User";
  return (account.displayName || fallback).trim().slice(0, 40) || "Bestcoach User";
}

function sessionImage(image: unknown): string | null {
  if (typeof image !== "string" || image.startsWith("data:image/")) return null;
  return image.length <= 2048 ? image : null;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) return null;

        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          image: user.image ?? undefined,
        };
      },
    }),
    CredentialsProvider({
      id: "firebase",
      name: "Firebase",
      credentials: {
        idToken: { label: "Firebase ID token", type: "text" },
      },
      async authorize(credentials) {
        const idToken = credentials?.idToken;
        if (!idToken) return null;

        const account = await verifyFirebaseToken(idToken);
        const email = account?.email?.trim().toLowerCase();
        if (!account?.localId || !email) return null;

        const existing = await db.user.findUnique({ where: { email } });
        const user = existing ?? (await db.user.create({
          data: {
            email,
            username: usernameFromAccount(account),
            passwordHash: await bcrypt.hash(randomUUID(), 10),
            image: account.photoUrl ?? null,
          },
        }));

        if (existing && account.photoUrl && !existing.image) {
          await db.user.update({
            where: { id: existing.id },
            data: { image: account.photoUrl },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          image: user.image ?? account.photoUrl ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Initial sign-in: populate from the user object returned by authorize()
      if (user) {
        token.id = user.id;
        token.username = user.name ?? "";
        token.image = sessionImage(user.image);
      }
      // When the client calls useSession().update(), re-sync from the DB
      // so username + picture changes are reflected in the session/JWT.
      if (trigger === "update" && token.id) {
        const fresh = await db.user.findUnique({
          where: { id: token.id as string },
          select: { username: true, image: true },
        });
        if (fresh) {
          token.username = fresh.username;
          token.image = sessionImage(fresh.image);
        }
      }
      token.image = sessionImage(token.image);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { username?: string }).username =
          (token.username as string) ?? "";
        session.user.image = sessionImage(token.image);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};