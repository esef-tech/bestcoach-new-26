"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSession } from "next-auth/react";

export type UserNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  href: string;
  readAt: string | null;
  createdAt: string;
};

type NotificationContextValue = {
  notifications: UserNotification[];
  unreadCount: number;
  hasMore: boolean;
  loading: boolean;
  refreshNotifications: () => Promise<void>;
  loadMoreNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [dataUserId, setDataUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const userId = session?.user?.id;

  const refreshNotifications = useCallback(async () => {
    if (status !== "authenticated" || !userId) return;
    setLoading(true);
    try {
      const response = await fetch("/api/notifications?limit=20", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as {
        notifications?: UserNotification[];
        unreadCount?: number;
        nextCursor?: string | null;
      };
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
      setNextCursor(data.nextCursor ?? null);
      setDataUserId(userId);
    } catch (error) {
      console.error("[notifications] Could not refresh:", error);
    } finally {
      setLoading(false);
    }
  }, [status, userId]);

  const loadMoreNotifications = useCallback(async () => {
    if (!nextCursor || status !== "authenticated") return;
    try {
      const response = await fetch(
        `/api/notifications?limit=20&cursor=${encodeURIComponent(nextCursor)}`,
        { cache: "no-store" }
      );
      if (!response.ok) return;
      const data = (await response.json()) as {
        notifications?: UserNotification[];
        unreadCount?: number;
        nextCursor?: string | null;
      };
      setNotifications((current) => [...current, ...(data.notifications ?? [])]);
      setUnreadCount(data.unreadCount ?? 0);
      setNextCursor(data.nextCursor ?? null);
      setDataUserId(userId ?? null);
    } catch (error) {
      console.error("[notifications] Could not load history:", error);
    }
  }, [nextCursor, status]);

  const markNotificationRead = useCallback(async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await refreshNotifications();
  }, [refreshNotifications]);

  const markAllNotificationsRead = useCallback(async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ readAll: true }),
    });
    await refreshNotifications();
  }, [refreshNotifications]);

  useEffect(() => {
    if (status !== "authenticated" || !userId) {
      return;
    }

    const refresh = () => void refreshNotifications();
    const initialRefresh = window.setTimeout(refresh, 0);
    const interval = window.setInterval(refresh, 15_000);
    window.addEventListener("focus", refresh);
    window.addEventListener("user-notifications:refresh", refresh);
    return () => {
      window.clearTimeout(initialRefresh);
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("user-notifications:refresh", refresh);
    };
  }, [refreshNotifications, status, userId]);

  const isCurrentUserData = status === "authenticated" && dataUserId === userId;

  return (
    <NotificationContext.Provider
      value={{
        notifications: isCurrentUserData ? notifications : [],
        unreadCount: isCurrentUserData ? unreadCount : 0,
        hasMore: isCurrentUserData && nextCursor !== null,
        loading,
        refreshNotifications,
        loadMoreNotifications,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useUserNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useUserNotifications must be used within NotificationProvider");
  }
  return context;
}