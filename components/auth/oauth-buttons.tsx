"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { startOAuth } from "@/lib/appwrite/oauth-actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { OAuthProviderId } from "@/lib/appwrite/oauth-providers";
import {
  AppleMark,
  FacebookMark,
  GoogleMark,
} from "@/components/auth/oauth-icons";

type OAuthButtonsProps = {
  from: "login" | "register";
  nextPath?: string;
  intent?: "seller";
  error?: string;
};

const PROVIDERS: Array<{
  id: OAuthProviderId;
  label: string;
  icon: ReactNode;
}> = [
  {
    id: "google",
    label: "Continue with Google",
    icon: <GoogleMark className="size-5" />,
  },
  {
    id: "apple",
    label: "Continue with Apple",
    icon: <AppleMark className="size-5" />,
  },
  {
    id: "facebook",
    label: "Continue with Facebook",
    icon: <FacebookMark className="size-5" />,
  },
];

function OAuthSubmitButton({
  provider,
  label,
  icon,
}: {
  provider: OAuthProviderId;
  label: string;
  icon: ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="outline"
      className="w-full"
      disabled={pending}
      data-testid={`oauth-${provider}`}
    >
      {icon}
      {pending ? "Redirecting…" : label}
    </Button>
  );
}

export function OAuthButtons({
  from,
  nextPath,
  intent,
  error,
}: OAuthButtonsProps) {
  return (
    <div className="space-y-3">
      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
        >
          {error}
        </p>
      ) : null}

      {PROVIDERS.map((provider) => (
        <form key={provider.id} action={startOAuth}>
          <input type="hidden" name="provider" value={provider.id} />
          <input type="hidden" name="from" value={from} />
          {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
          {intent ? <input type="hidden" name="intent" value={intent} /> : null}
          <OAuthSubmitButton
            provider={provider.id}
            label={provider.label}
            icon={provider.icon}
          />
        </form>
      ))}

      <div className="flex items-center gap-3 pt-1">
        <Separator className="flex-1" />
        <p className="text-xs text-muted-foreground">or continue with email</p>
        <Separator className="flex-1" />
      </div>
    </div>
  );
}
