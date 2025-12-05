"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function ForgotPasswordDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  async function submit() {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Failed to send reset email");
      return;
    }

    toast.success("Password reset link sent to your email");
    setOpen(false);
    setEmail("");
  }

  return (
    <>
      <Button
        variant="ghost"
        className="text-sm text-muted-foreground underline-offset-4 hover:underline hover:bg-transparent px-0"
        onClick={() => setOpen(true)}
      >
        Forgot password?
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button onClick={submit}>Send Reset Link</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
