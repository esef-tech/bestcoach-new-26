"use client";

export function refreshUserNotifications() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("user-notifications:refresh"));
  }
}