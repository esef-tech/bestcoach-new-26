"use client";

import Link from "next/link";
import { LogIn, UserPlus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function AuthPromptDialog({
  open,
  onOpenChange,
  message,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  message?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm text-center">
        <ShieldCheck className="mx-auto size-14 text-[#00394f]" />
        <DialogHeader>
          <DialogTitle>Login required</DialogTitle>
          <DialogDescription>
            {message ??
              "You need to be logged in to add items to your cart and make purchases."}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-2">
          <Button
            asChild
            className="h-11 rounded-full bg-[#00394f] font-bold hover:bg-[#00293a]"
          >
            <Link href="/signin">
              <LogIn className="size-4" /> Log in
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-full">
            <Link href="/signup">
              <UserPlus className="size-4" /> Sign up
            </Link>
          </Button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          It only takes a minute. 🎵
        </p>
      </DialogContent>
    </Dialog>
  );
}