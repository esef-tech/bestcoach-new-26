"use client";

import Link from "next/link";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useUserNotifications } from "@/components/notification-provider";

export function NotificationBell() {
  const {
    notifications,
    unreadCount,
    loading,
    markNotificationRead,
    markAllNotificationsRead,
  } = useUserNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 rounded-full"
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold">Notifications</h2>
            <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={() => void markAllNotificationsRead()}>
              <CheckCheck className="size-4" /> Read all
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {loading && notifications.length === 0 ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              You’re all caught up.
            </p>
          ) : (
            notifications.slice(0, 8).map((notification) => (
              <div
                key={notification.id}
                className={`border-b px-4 py-3 last:border-0 ${notification.readAt ? "" : "bg-accent/20"}`}
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-1.5 size-2 shrink-0 rounded-full ${notification.readAt ? "bg-transparent" : "bg-rose-600"}`} />
                  <Link
                    href={notification.href}
                    onClick={() => {
                      if (!notification.readAt) void markNotificationRead(notification.id);
                    }}
                    className="min-w-0 flex-1"
                  >
                    <p className="text-sm font-semibold">{notification.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{notification.message}</p>
                    <time className="mt-1 block text-[11px] text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </time>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="border-t p-2">
          <Button variant="ghost" asChild className="w-full">
            <Link href="/profile#notifications">View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}