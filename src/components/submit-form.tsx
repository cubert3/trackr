"use client";

import { useState } from "react";
import { CATEGORIES, FORMATS, BANGALORE_LOCALITIES } from "@/lib/constants";
import { Loader2, Send, ShieldCheck } from "lucide-react";

interface College {
  slug: string;
  shortName: string | null;
  name: string;
}

interface SubmitFormProps {
  colleges: College[];
}

export function SubmitForm({ colleges }: SubmitFormProps) {
  const [step, setStep] = useState<"contact" | "form">("contact");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startsAt: "",
    registrationDeadline: "",
    format: "IN_PERSON",
    category: "HACKATHON",
    venue: "",
    locality: "",
    collegeSlug: "",
    registrationUrl: "",
    prizePool: "",
    tags: "",
  });

  async function sendOtp() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setMessage({ type: "ok", text: data.message });
      } else {
        setMessage({ type: "err", text: data.message });
      }
    } catch {
      setMessage({ type: "err", text: "Failed to send OTP" });
    }
    setLoading(false);
  }

  async function verifyOtpCode() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, otp }),
      });
      const data = await res.json();
      if (data.verified) {
        setVerified(true);
        setStep("form");
        setMessage({ type: "ok", text: "Verified! Fill in the event details." });
      } else {
        setMessage({ type: "err", text: data.message });
      }
    } catch {
      setMessage({ type: "err", text: "Verification failed" });
    }
    setLoading(false);
  }

  async function submitEvent(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const startsAt = new Date(form.startsAt).toISOString();

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          startsAt,
          contact,
          otp,
          registrationDeadline: form.registrationDeadline
            ? new Date(form.registrationDeadline).toISOString()
            : undefined,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          collegeSlug: form.collegeSlug || undefined,
          registrationUrl: form.registrationUrl || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "ok",
          text: "Event submitted! It goes to moderation before going live.",
        });
        setForm({
          title: "",
          description: "",
          startsAt: "",
          registrationDeadline: "",
          format: "IN_PERSON",
          category: "HACKATHON",
          venue: "",
          locality: "",
          collegeSlug: "",
          registrationUrl: "",
          prizePool: "",
          tags: "",
        });
      } else {
        setMessage({ type: "err", text: data.error ?? "Submission failed" });
      }
    } catch {
      setMessage({ type: "err", text: "Submission failed" });
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            message.type === "ok"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {step === "contact" && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
          <div className="flex items-center gap-2 text-violet-300">
            <ShieldCheck className="h-5 w-5" />
            <span className="font-medium">Verify to submit</span>
          </div>
          <p className="text-sm text-zinc-400">
            No login needed to browse. We ask for email or phone OTP only when
            you add an event — keeps spam out without being a wall.
          </p>

          <input
            type="text"
            placeholder="Email or phone (+91...)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none"
          />

          {otpSent && (
            <input
              type="text"
              placeholder="6-digit OTP"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none"
            />
          )}

          <div className="flex gap-3">
            {!otpSent ? (
              <button
                onClick={sendOtp}
                disabled={loading || contact.length < 5}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
              </button>
            ) : (
              <button
                onClick={verifyOtpCode}
                disabled={loading || otp.length !== 6}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & continue"}
              </button>
            )}
          </div>
        </div>
      )}

      {(step === "form" || verified) && (
        <form onSubmit={submitEvent} className="space-y-4">
          <input
            required
            placeholder="Event name *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none"
          />

          <textarea
            placeholder="Description (what, who should attend, tracks...)"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none resize-none"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              type="datetime-local"
              value={form.startsAt}
              onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500/50 focus:outline-none"
            />

            <input
              type="datetime-local"
              value={form.registrationDeadline}
              onChange={(e) =>
                setForm({ ...form, registrationDeadline: e.target.value })
              }
              placeholder="Registration deadline"
              title="Registration deadline"
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500/50 focus:outline-none"
            />

            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500/50 focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={form.format}
              onChange={(e) => setForm({ ...form, format: e.target.value })}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500/50 focus:outline-none"
            >
              {FORMATS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            <select
              value={form.locality}
              onChange={(e) => setForm({ ...form, locality: e.target.value })}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500/50 focus:outline-none"
            >
              <option value="">Area / locality</option>
              {BANGALORE_LOCALITIES.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <input
            placeholder="Venue (building name, or 'Online')"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none"
          />

          <select
            value={form.collegeSlug}
            onChange={(e) => setForm({ ...form, collegeSlug: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500/50 focus:outline-none"
          >
            <option value="">College / community (optional)</option>
            {colleges.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.shortName ?? c.name}
              </option>
            ))}
          </select>

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="url"
              placeholder="Registration link"
              value={form.registrationUrl}
              onChange={(e) => setForm({ ...form, registrationUrl: e.target.value })}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none"
            />
            <input
              placeholder="Prize pool (optional)"
              value={form.prizePool}
              onChange={(e) => setForm({ ...form, prizePool: e.target.value })}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none"
            />
          </div>

          <input
            placeholder="Tags (comma-separated: ai-ml, campus, fintech)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Submit for review
          </button>
        </form>
      )}
    </div>
  );
}
