import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  CAREER_ALLOWED_FILE_TYPES,
  CAREER_UPLOAD_FIELDS,
  CAREER_UPLOAD_MAX_FILE_BYTES,
  CAREER_UPLOAD_MAX_TOTAL_BYTES,
  type CareerUploadField,
} from "@/lib/career-uploads";

// Prisma / Neon Postgres — the source of truth for job applications.
// The Firestore mirror happens on the CLIENT (src/app/careers/page.tsx) using
// the project's existing firebase.ts `db` export, so this route stays
// backend-only and doesn't touch Firebase server-side.

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, message: "Sign in or create an account before applying." },
        { status: 401 }
      );
    }

    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (contentLength > CAREER_UPLOAD_MAX_TOTAL_BYTES + 1024 * 1024) {
      return NextResponse.json(
        { ok: false, message: "Application uploads cannot exceed 20 MB." },
        { status: 413 }
      );
    }

    const body = await req.formData();
    const getText = (key: string) =>
      String(body.get(key) ?? "").trim();
    const applicationId = getText("applicationId");
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(applicationId)) {
      return NextResponse.json(
        { ok: false, message: "Invalid application submission." },
        { status: 400 }
      );
    }
    const name = getText("name");
    const email = getText("email").toLowerCase();
    const phone = getText("phone");
    const position = getText("position");
    const portfolio = getText("portfolio") || null;
    const message = getText("message");
    const resumeUrl = getText("resumeUrl") || null;
    const jobId = getText("jobId") || null;

    if (!name || !email || !phone || !position || !message) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Please fill in name, email, phone, position and a short message.",
        },
        { status: 400 }
      );
    }
    if (
      name.length > 200 ||
      email.length > 320 ||
      phone.length > 80 ||
      position.length > 200 ||
      message.length > 10_000 ||
      (portfolio?.length ?? 0) > 2_000 ||
      (resumeUrl?.length ?? 0) > 2_000
    ) {
      return NextResponse.json(
        { ok: false, message: "One or more application fields are too long." },
        { status: 400 }
      );
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return NextResponse.json(
        { ok: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const attachments: {
      kind: CareerUploadField;
      fileName: string;
      mimeType: string;
      fileSize: number;
      data: Uint8Array<ArrayBuffer>;
    }[] = [];
    let totalFileBytes = 0;
    for (const { key } of CAREER_UPLOAD_FIELDS) {
      const value = body.get(key);
      if (value === null) continue;
      if (typeof value === "string" || value.size === 0) {
        return NextResponse.json(
          { ok: false, message: `The ${key} attachment is invalid.` },
          { status: 400 }
        );
      }
      if (value.size > CAREER_UPLOAD_MAX_FILE_BYTES) {
        return NextResponse.json(
          { ok: false, message: `Each attachment must be no larger than 5 MB.` },
          { status: 413 }
        );
      }
      totalFileBytes += value.size;
      if (totalFileBytes > CAREER_UPLOAD_MAX_TOTAL_BYTES) {
        return NextResponse.json(
          { ok: false, message: "Application uploads cannot exceed 20 MB total." },
          { status: 413 }
        );
      }

      const extension = `.${value.name.split(".").pop()?.toLowerCase() ?? ""}`;
      const expectedMimeType = CAREER_ALLOWED_FILE_TYPES[extension];
      if (!expectedMimeType || (value.type && value.type !== expectedMimeType)) {
        return NextResponse.json(
          { ok: false, message: `${value.name} must be a PDF, PNG, JPG, or DOCX file.` },
          { status: 400 }
        );
      }

      const sourceData = new Uint8Array(await value.arrayBuffer());
      const data = new Uint8Array(value.size);
      data.set(sourceData);
      const hasValidSignature =
        (extension === ".pdf" &&
          data[0] === 0x25 &&
          data[1] === 0x50 &&
          data[2] === 0x44 &&
          data[3] === 0x46) ||
        (extension === ".png" &&
          data.length >= 8 &&
          data[0] === 0x89 &&
          data[1] === 0x50 &&
          data[2] === 0x4e &&
          data[3] === 0x47 &&
          data[4] === 0x0d &&
          data[5] === 0x0a &&
          data[6] === 0x1a &&
          data[7] === 0x0a) ||
        ((extension === ".jpg" || extension === ".jpeg") &&
          data[0] === 0xff &&
          data[1] === 0xd8 &&
          data[2] === 0xff) ||
        (extension === ".docx" &&
          data[0] === 0x50 &&
          data[1] === 0x4b &&
          data[2] === 0x03 &&
          data[3] === 0x04);
      if (!hasValidSignature) {
        return NextResponse.json(
          { ok: false, message: `${value.name} is not a valid ${extension.slice(1).toUpperCase()} file.` },
          { status: 400 }
        );
      }

      attachments.push({
        kind: key,
        fileName: value.name.replace(/[\\/\0\r\n]/g, "_").slice(0, 255),
        mimeType: expectedMimeType,
        fileSize: value.size,
        data,
      });
    }

    const application = await db.jobApplication.create({
      include: {
        attachments: {
          select: {
            kind: true,
            fileName: true,
            mimeType: true,
            fileSize: true,
          },
        },
      },
      data: {
        id: applicationId,
        jobId,
        name,
        email,
        phone,
        position,
        portfolio,
        message,
        resumeUrl,
        status: "submitted",
        attachments: {
          create: attachments,
        },
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Application received! We'll be in touch soon. 🎉",
      applicationId: application.id,
      record: {
        applicationId: application.id,
        jobId,
        name,
        email,
        phone,
        position,
        portfolio,
        message,
        resumeUrl,
        attachments: application.attachments,
        status: "submitted",
      },
    });
  } catch (err) {
    console.error("[careers/apply] error:", err);
    return NextResponse.json(
      { ok: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}