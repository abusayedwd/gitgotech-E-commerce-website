"use client";

import PrivateRoute from "@/components/shared/PrivateRoute";
import { markIntentionalLogout } from "@/hooks/useAuth";
import { getOrCreateDeviceId } from "@/lib/firebase";
import { apiSlice } from "@/redux/api/apiSlice";
import {
  type AccountApplication,
  useGetMyAccountApplicationQuery,
  useResubmitAccountApplicationMutation,
} from "@/redux/features/accountApplication/accountApplicationSlice";
import { useLogoutUserMutation } from "@/redux/features/auth/authSlice";
import { AlertCircle, CheckCircle2, Clock3, FileImage, LogOut, RefreshCw, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

function getErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") return "Something went wrong.";
  const candidate = error as {
    data?: { message?: string };
    message?: string;
  };
  return candidate.data?.message || candidate.message || "Something went wrong.";
}

function getRateLimitTime(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;
  const candidate = error as {
    status?: number | string;
    data?: {
      canResubmitAt?: string;
      nextAllowedAt?: string;
      data?: { canResubmitAt?: string; nextAllowedAt?: string };
    };
  };
  if (Number(candidate.status) !== 429) return null;
  return (
    candidate.data?.data?.canResubmitAt ||
    candidate.data?.data?.nextAllowedAt ||
    candidate.data?.canResubmitAt ||
    candidate.data?.nextAllowedAt ||
    null
  );
}

function remainingMilliseconds(value?: string | null): number {
  if (!value) return 0;
  const target = new Date(value).getTime();
  return Number.isFinite(target) ? Math.max(0, target - Date.now()) : 0;
}

function formatCountdown(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [
    days > 0 ? `${days}d` : null,
    `${String(hours).padStart(2, "0")}h`,
    `${String(minutes).padStart(2, "0")}m`,
    `${String(seconds).padStart(2, "0")}s`,
  ]
    .filter(Boolean)
    .join(" ");
}

function StatusContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetMyAccountApplicationQuery(undefined, {
    pollingInterval: 30_000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [resubmit, { isLoading: isSubmitting }] =
    useResubmitAccountApplicationMutation();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();
  const [application, setApplication] = useState<AccountApplication | null>(null);
  const [address, setAddress] = useState("");
  const [nidNo, setNidNo] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [nidFront, setNidFront] = useState<File | null>(null);
  const [nidBack, setNidBack] = useState<File | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [rateLimitTime, setRateLimitTime] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(0);
  const refreshedAtRef = useRef<string | null>(null);

  useEffect(() => {
    if (data?.data.application) {
      setApplication(data.data.application);
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const effectiveAccess =
          data.data.application.status === "APPROVED" ? "FULL" : data.data.access;
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            access: effectiveAccess,
            application: data.data.application,
          }),
        );
        window.dispatchEvent(new Event("authChanged"));
      } catch {
        // The live API response still controls this page when storage is unavailable.
      }
    }
    if (data?.data.access === "FULL" || data?.data.application?.status === "APPROVED") {
      router.replace("/vendor-dashboard");
    }
  }, [data, router]);

  const cooldownTime = rateLimitTime || application?.canResubmitAt || null;

  useEffect(() => {
    if (application?.canResubmit) setRateLimitTime(null);
  }, [application?.canResubmit]);

  useEffect(() => {
    if (!cooldownTime || application?.canResubmit) {
      setRemaining(0);
      return;
    }

    const updateCountdown = () => setRemaining(remainingMilliseconds(cooldownTime));
    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(interval);
  }, [cooldownTime, application?.canResubmit]);

  useEffect(() => {
    if (
      !cooldownTime ||
      application?.canResubmit ||
      remaining > 0 ||
      remainingMilliseconds(cooldownTime) > 0 ||
      refreshedAtRef.current === cooldownTime
    ) {
      return;
    }
    refreshedAtRef.current = cooldownTime;
    void refetch();
  }, [application?.canResubmit, cooldownTime, refetch, remaining]);

  useEffect(() => {
    if (refreshedAtRef.current && refreshedAtRef.current !== cooldownTime) {
      refreshedAtRef.current = null;
    }
  }, [cooldownTime]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!application?.canResubmit || remaining > 0) return;

    const textData: { address?: string; nidNo?: string } = {};
    const cleanAddress = address.trim();
    const cleanNidNo = nidNo.trim();
    if (cleanAddress) textData.address = cleanAddress;
    if (cleanNidNo) textData.nidNo = cleanNidNo;

    if (!cleanAddress && !cleanNidNo && !profileImage && !nidFront && !nidBack) {
      toast.error("Add at least one replacement field or image.");
      return;
    }

    const body = new FormData();
    body.append("data", JSON.stringify(textData));
    if (profileImage) body.append("image", profileImage);
    if (nidFront) body.append("nidFront", nidFront);
    if (nidBack) body.append("nidBack", nidBack);

    try {
      const response = await resubmit(body).unwrap();
      setApplication(response.data);
      setAddress("");
      setNidNo("");
      setProfileImage(null);
      setNidFront(null);
      setNidBack(null);
      setFormKey((value) => value + 1);
      setRateLimitTime(null);
      toast.success(response.message || "Application resubmitted successfully");
    } catch (submitError) {
      const nextAllowedAt = getRateLimitTime(submitError);
      if (nextAllowedAt) {
        setRateLimitTime(nextAllowedAt);
        refreshedAtRef.current = null;
        void refetch();
      }
      toast.error(getErrorMessage(submitError));
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser({ deviceId: getOrCreateDeviceId() }).unwrap();
    } catch (logoutError) {
      console.error("Logout request failed:", logoutError);
    }

    markIntentionalLogout();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("deviceId");
    localStorage.removeItem("fcmToken");
    localStorage.removeItem("fcmTokenSynced");
    dispatch(apiSlice.util.resetApiState());
    window.dispatchEvent(new Event("authChanged"));
    toast.success("Logged out successfully");
    router.replace("/auth/login");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <RefreshCw className="size-9 animate-spin text-purple-400" aria-label="Loading application status" />
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4">
        <div className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <AlertCircle className="mx-auto size-10 text-red-400" aria-hidden="true" />
          <h1 className="mt-3 text-xl font-semibold">Could not load your application</h1>
          <p className="mt-2 text-sm text-white/65 light:text-gray-600">{getErrorMessage(error)}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-5 rounded-lg bg-purple-600 px-5 py-2.5 font-medium text-white hover:bg-purple-500"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const isRejected = application.status === "REJECTED";
  const canSubmit = isRejected && application.canResubmit && remaining === 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#120b29] to-black px-4 pb-16 pt-32 text-white light:from-white light:via-purple-50 light:to-white light:text-gray-900 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-purple-300 light:text-purple-700">Vendor application</p>
            <h1 className="mt-1 text-3xl font-semibold">Application status</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching || isLoggingOut}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-60 light:border-gray-300 light:hover:bg-gray-100"
            >
              <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
              Refresh status
            </button>
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={isLoggingOut}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-red-400/30 px-4 py-2 text-sm text-red-200 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60 light:text-red-700"
            >
              {isLoggingOut ? (
                <RefreshCw className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <LogOut className="size-4" aria-hidden="true" />
              )}
              {isLoggingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur sm:p-8 light:border-gray-200 light:bg-white">
          {application.status === "SUBMITTED" && (
            <div className="text-center">
              <Clock3 className="mx-auto size-14 text-amber-400" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-semibold">Application under review.</h2>
              <p className="mt-2 text-white/65 light:text-gray-600">
                We will update this page after an administrator reviews your application.
              </p>
            </div>
          )}

          {application.status === "APPROVED" && (
            <div className="text-center">
              <CheckCircle2 className="mx-auto size-14 text-emerald-400" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-semibold">Application approved</h2>
              <p className="mt-2 text-white/65 light:text-gray-600">Opening your vendor dashboard…</p>
            </div>
          )}

          {isRejected && (
            <>
              <div className="rounded-xl border border-red-400/25 bg-red-500/10 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 size-6 shrink-0 text-red-400" aria-hidden="true" />
                  <div>
                    <h2 className="text-lg font-semibold text-red-200 light:text-red-800">Changes required</h2>
                    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-red-100/80 light:text-red-700">
                      {application.rejectionReason || "Your application needs updated information."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 p-4 light:border-gray-200 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">Submit replacement information</h3>
                    <p className="mt-1 text-sm text-white/60 light:text-gray-600">
                      Every field is optional, but you must replace at least one item.
                    </p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 light:bg-gray-100 light:text-gray-700">
                    Attempt {application.attemptNumber}
                  </span>
                </div>

                {!application.canResubmit && cooldownTime && (
                  <div className="mt-5 rounded-lg border border-amber-400/25 bg-amber-400/10 p-4 text-sm">
                    <p className="font-medium text-amber-200 light:text-amber-800">Resubmission cooldown</p>
                    <p className="mt-1 text-amber-100/75 light:text-amber-700">
                      {remaining > 0
                        ? `You can try again in ${formatCountdown(remaining)}.`
                        : "Cooldown finished. Checking with the server…"}
                    </p>
                  </div>
                )}

                <form key={formKey} onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <label htmlFor="address" className="mb-2 block text-sm font-medium">New address</label>
                    <textarea
                      id="address"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      rows={3}
                      className="w-full resize-y rounded-lg border border-white/15 bg-black/25 px-4 py-3 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 light:border-gray-300 light:bg-white"
                      placeholder="Enter replacement address"
                    />
                  </div>

                  <div>
                    <label htmlFor="nidNo" className="mb-2 block text-sm font-medium">New NID number</label>
                    <input
                      id="nidNo"
                      value={nidNo}
                      onChange={(event) => setNidNo(event.target.value)}
                      className="w-full rounded-lg border border-white/15 bg-black/25 px-4 py-3 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 light:border-gray-300 light:bg-white"
                      placeholder="Enter replacement NID number"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <label className="cursor-pointer rounded-xl border border-dashed border-white/20 p-4 hover:border-purple-400 light:border-gray-300">
                      <span className="flex items-center gap-2 font-medium"><FileImage className="size-5 text-purple-400" />Profile image</span>
                      <span className="mt-2 block truncate text-sm text-white/55 light:text-gray-600">{profileImage?.name || "Choose a replacement image"}</span>
                      <input type="file" accept="image/*" className="sr-only" onChange={(event) => setProfileImage(event.target.files?.[0] || null)} />
                    </label>
                    <label className="cursor-pointer rounded-xl border border-dashed border-white/20 p-4 hover:border-purple-400 light:border-gray-300">
                      <span className="flex items-center gap-2 font-medium"><FileImage className="size-5 text-purple-400" />NID front</span>
                      <span className="mt-2 block truncate text-sm text-white/55 light:text-gray-600">{nidFront?.name || "Choose a replacement image"}</span>
                      <input type="file" accept="image/*" className="sr-only" onChange={(event) => setNidFront(event.target.files?.[0] || null)} />
                    </label>
                    <label className="cursor-pointer rounded-xl border border-dashed border-white/20 p-4 hover:border-purple-400 light:border-gray-300">
                      <span className="flex items-center gap-2 font-medium"><FileImage className="size-5 text-purple-400" />NID back</span>
                      <span className="mt-2 block truncate text-sm text-white/55 light:text-gray-600">{nidBack?.name || "Choose an optional replacement"}</span>
                      <input type="file" accept="image/*" className="sr-only" onChange={(event) => setNidBack(event.target.files?.[0] || null)} />
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-500 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:opacity-60"
                  >
                    {isSubmitting ? <RefreshCw className="size-5 animate-spin" /> : <Send className="size-5" />}
                    {isSubmitting ? "Resubmitting…" : "Resubmit application"}
                  </button>
                </form>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default function AccountApplicationStatus() {
  return (
    <PrivateRoute>
      <StatusContent />
    </PrivateRoute>
  );
}
