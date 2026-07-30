"use client";

import React from "react";
import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutSwitchButton() {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut({ redirectUrl: "/sign-in?redirect_url=/select-role" });
  };

  return (
    <Button
      type="button"
      onClick={handleSignOut}
      variant="outline"
      size="sm"
      className="border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900 text-xs flex items-center gap-1.5"
    >
      <LogOut className="size-3.5 text-slate-400" />
      <span>Sign In / Sign Up as Different User</span>
    </Button>
  );
}
