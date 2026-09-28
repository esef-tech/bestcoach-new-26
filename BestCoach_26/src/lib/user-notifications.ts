import { db } from "@/lib/db";

export async function createUserNotification({
  userId,
  eventKey,
  type,
  title,
  message,
  href,
}: {
  userId: string | null | undefined;
  eventKey: string;
  type: string;
  title: string;
  message: string;
  href: string;
}) {
  if (!userId) return;

  try {
    await db.notification.upsert({
      where: { eventKey },
      create: { userId, eventKey, type, title, message, href },
      update: {},
    });
  } catch (error) {
    console.error("[notifications] Could not create notification:", error);
  }
}