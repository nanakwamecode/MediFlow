"use client";

import { useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/common/Toast/ToastProvider";
import Modal from "@/components/common/Modal/Modal";
import { DISPLAY_NAME_MAX } from "@/lib/auth-api-helpers";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProfileModal({ open, onClose }: Props) {
  const user = useAuthStore((s) => s.user);
  const error = useAuthStore((s) => s.error);
  const updateDisplayName = useAuthStore((s) => s.updateDisplayName);
  const { showToast } = useToast();

  const [submitting, setSubmitting] = useState(false);
  const displayNameRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = displayNameRef.current?.value?.trim() ?? "";
    if (!next) return;
    if (next === user?.displayName) {
      showToast("Display name unchanged.", "◈");
      onClose();
      return;
    }

    setSubmitting(true);
    const ok = await updateDisplayName(next);
    setSubmitting(false);

    if (ok) {
      showToast("Profile updated.", "✓");
      onClose();
    }
  };

  if (!user) return null;

  const fieldClass = cn(
    "w-full rounded-lg border-[1.5px] border-border bg-bg-2 px-4 py-3",
    "font-mono text-sm text-ink outline-none",
    "transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,57,43,0.1)]",
    "disabled:opacity-50"
  );

  return (
    <Modal open={open} onClose={onClose} title="Your profile" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-status-high-border bg-status-high-bg px-3.5 py-2.5 text-xs text-status-high">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block font-mono text-[0.6rem] tracking-[0.18em] text-ink-3 uppercase">
            Username
          </label>
          <input
            type="text"
            value={user.username}
            readOnly
            className={cn(fieldClass, "cursor-not-allowed bg-bg-2/80 text-ink-3")}
            aria-readonly="true"
          />
          <p className="mt-1.5 font-mono text-[0.65rem] text-ink-3">
            Username cannot be changed.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-[0.6rem] tracking-[0.18em] text-ink-3 uppercase">
            Display name
          </label>
          <input
            type="text"
            key={`${user.id}-${open ? "open" : "closed"}`}
            ref={displayNameRef}
            defaultValue={user.displayName}
            maxLength={DISPLAY_NAME_MAX}
            autoComplete="name"
            disabled={submitting}
            placeholder="How you appear in the app"
            className={fieldClass}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className={cn(
              "cursor-pointer rounded-lg border border-border bg-transparent px-4 py-2.5",
              "font-sans text-sm font-medium text-ink",
              "transition-colors hover:bg-bg-2",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={cn(
              "cursor-pointer rounded-lg bg-accent px-4 py-2.5",
              "font-sans text-sm font-semibold text-white",
              "transition-all hover:bg-accent-hover",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
          >
            {submitting ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
