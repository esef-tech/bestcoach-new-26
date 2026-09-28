"use client";

import { cloneElement, useState, type MouseEvent, type ReactElement } from "react";
import { useSession } from "next-auth/react";
import { AuthPromptDialog } from "@/components/bestcoach/auth-prompt";

export function useAuthenticationPrompt() {
  const { status } = useSession();
  const [promptOpen, setPromptOpen] = useState(false);

  const requireAuthentication = () => {
    if (status === "authenticated") return true;
    setPromptOpen(true);
    return false;
  };

  return {
    requireAuthentication,
    prompt: (
      <AuthPromptDialog
        open={promptOpen}
        onOpenChange={setPromptOpen}
        message="Sign in or create an account to continue."
      />
    ),
  };
}

export function RequireAuthentication({ children }: { children: ReactElement }) {
  const { requireAuthentication, prompt } = useAuthenticationPrompt();
  const originalOnClick = (
    children.props as { onClick?: (event: MouseEvent<HTMLElement>) => void }
  ).onClick;

  return (
    <>
      {cloneElement(children, {
        onClick: (event: MouseEvent<HTMLElement>) => {
          if (!requireAuthentication()) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          originalOnClick?.(event);
        },
      } as never)}
      {prompt}
    </>
  );
}