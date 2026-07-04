"use client";

import {
  useAddEventMemberMutation,
  useGetEventByIdQuery,
} from "@/redux/features/event/eventSlice";
import jsPDF from "jspdf";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

interface EventData {
  eventName: string;
  date: string;
  time: string;
  location: string;
  hostName: string;
  title: string;
  description: string;
}

interface MemberDetails {
  name: string;
  email: string;
}

interface PassedEvent {
  _id: string;
  title: string;
  description: string;
  eventDate: string;
  address: string;
  purchaseOption: string;
  hostName?: string;
  eventName?: string;
}

// Single invitation card template — no categories.
const INVITATION_CARD_IMAGE = "/images/invitecard.png";
const CARD_EXPORT_WIDTH = 1200;

const INVITE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap";

async function ensureInviteFonts(): Promise<void> {
  if (typeof document === "undefined") return;

  if (!document.getElementById("invite-card-fonts")) {
    const link = document.createElement("link");
    link.id = "invite-card-fonts";
    link.rel = "stylesheet";
    link.href = INVITE_FONTS_URL;
    document.head.appendChild(link);
  }

  await document.fonts.ready;
  await Promise.all([
    document.fonts.load('600 32px "Cinzel"'),
    document.fonts.load('700 48px "Cinzel"'),
    document.fonts.load('400 28px "Cormorant Garamond"'),
    document.fonts.load('italic 400 28px "Cormorant Garamond"'),
  ]);
}

function wrapCanvasLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const lines: string[] = [];
  let line = words[0];

  for (let i = 1; i < words.length; i += 1) {
    const testLine = `${line} ${words[i]}`;
    if (ctx.measureText(testLine).width > maxWidth) {
      lines.push(line);
      line = words[i];
    } else {
      line = testLine;
    }
  }

  lines.push(line);
  return lines;
}

// ─── Generate high-quality invitation card image for email ───────────────────
async function generateCardWithOverlay(
  cardImage: string,
  eventData: EventData,
  memberName: string,
): Promise<{ imageFile: File; pdfFile: File }> {
  await ensureInviteFonts();

  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      const scale = CARD_EXPORT_WIDTH / img.naturalWidth;
      const width = CARD_EXPORT_WIDTH;
      const height = Math.round(img.naturalHeight * scale);

      canvas.width = width;
      canvas.height = height;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(img, 0, 0, width, height);

      // Subtle gradient on lower half only — keeps template header clean
      const textGradient = ctx.createLinearGradient(0, height * 0.42, 0, height);
      textGradient.addColorStop(0, "rgba(8, 12, 28, 0)");
      textGradient.addColorStop(0.35, "rgba(8, 12, 28, 0.18)");
      textGradient.addColorStop(1, "rgba(8, 12, 28, 0.42)");
      ctx.fillStyle = textGradient;
      ctx.fillRect(0, height * 0.42, width, height * 0.58);

      const centerX = width / 2;
      const maxTextWidth = width * 0.78;

      const drawText = (
        text: string,
        x: number,
        y: number,
        font: string,
        color: string,
        withShadow = true,
      ) => {
        ctx.save();
        ctx.font = font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (withShadow) {
          ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
          ctx.shadowBlur = 6;
          ctx.shadowOffsetY = 2;
        }
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        ctx.restore();
      };

      const drawWrapped = (
        text: string,
        startY: number,
        font: string,
        color: string,
        fontSize: number,
        lineGap: number,
      ) => {
        ctx.font = font;
        const lines = wrapCanvasLines(ctx, text, maxTextWidth);
        let y = startY;
        lines.forEach((line) => {
          drawText(line, centerX, y, font, color);
          y += fontSize * lineGap;
        });
        return y;
      };

      const fs = (ratio: number) => Math.round(width * ratio);
      let y = height * 0.44;

      if (memberName.trim()) {
        drawText(
          `Dear ${memberName.trim()},`,
          centerX,
          y,
          `italic 400 ${fs(0.028)}px "Cormorant Garamond", serif`,
          "rgba(232, 223, 192, 0.95)",
        );
        y += height * 0.08;
      } else {
        y += height * 0.04;
      }

      // Event name sits below template's "PLEASE JOIN US FOR" text
      drawText(
        eventData.eventName || eventData.title,
        centerX,
        y + height * 0.04,
        `700 ${fs(0.038)}px "Cinzel", serif`,
        "#e8dfc0",
      );
      y += height * 0.11;

      if (eventData.description?.trim()) {
        y = drawWrapped(
          eventData.description.trim(),
          y,
          `italic 400 ${fs(0.026)}px "Cormorant Garamond", serif`,
          "rgba(220, 200, 160, 0.92)",
          fs(0.026),
          1.35,
        );
        y += height * 0.03;
      }

      drawText(
        eventData.date,
        centerX,
        y,
        `600 ${fs(0.028)}px "Cinzel", serif`,
        "#d4b96a",
      );
      y += height * 0.05;

      drawText(
        eventData.time,
        centerX,
        y,
        `600 ${fs(0.026)}px "Cinzel", serif`,
        "#e8dfc0",
      );
      y += height * 0.05;

      drawText(
        eventData.location,
        centerX,
        y,
        `italic 400 ${fs(0.028)}px "Cormorant Garamond", serif`,
        "rgba(220, 200, 160, 0.9)",
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to generate image"));
            return;
          }

          const imageFile = new File([blob], `invitation-${Date.now()}.png`, {
            type: "image/png",
          });

          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: width > height ? "landscape" : "portrait",
            unit: "mm",
            format: "a4",
          });

          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgRatio = width / height;
          const pdfRatio = pdfWidth / pdfHeight;

          let finalWidth = pdfWidth;
          let finalHeight = pdfHeight;

          if (imgRatio > pdfRatio) {
            finalHeight = pdfWidth / imgRatio;
          } else {
            finalWidth = pdfHeight * imgRatio;
          }

          const x = (pdfWidth - finalWidth) / 2;
          const pdfY = (pdfHeight - finalHeight) / 2;

          pdf.addImage(imgData, "PNG", x, pdfY, finalWidth, finalHeight);
          const pdfBlob = pdf.output("blob");
          const pdfFile = new File([pdfBlob], `invitation-${Date.now()}.pdf`, {
            type: "application/pdf",
          });

          resolve({ imageFile, pdfFile });
        },
        "image/png",
        1,
      );
    };

    img.onerror = () => {
      reject(new Error("Failed to load card image"));
    };

    img.src = cardImage;
  });
}

function getInviteErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "Failed to send invitation";
  }

  const err = error as {
    message?: string;
    data?: {
      message?: string;
      data?: { message?: string };
    };
  };

  return (
    err.data?.message ||
    err.data?.data?.message ||
    err.message ||
    "Failed to send invitation"
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function InvitationCard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = searchParams.get("id") || "";

  const [passedEvent, setPassedEvent] = useState<PassedEvent | null>(null);
  const [memberDetails, setMemberDetails] = useState<MemberDetails>({
    name: "",
    email: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedEvent");
    if (stored) {
      try {
        setPassedEvent(JSON.parse(stored));
        sessionStorage.removeItem("selectedEvent");
      } catch {}
    }
  }, []);

  const { data: eventDetails, isLoading: eventLoading } =
    useGetEventByIdQuery(eventId, {
      skip: !eventId || !!passedEvent,
    });

  const [addEventMember, { isLoading: isSending }] =
    useAddEventMemberMutation();

  const sourceEvent = passedEvent || eventDetails?.data;

  const eventData: EventData = sourceEvent
    ? {
        eventName: sourceEvent.title || sourceEvent.eventName || "",
        date: sourceEvent.eventDate
          ? new Date(sourceEvent.eventDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "",
        time: sourceEvent.eventDate
          ? new Date(sourceEvent.eventDate).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        location: sourceEvent.address || "",
        hostName: sourceEvent.hostName || "",
        title: sourceEvent.title || "",
        description: sourceEvent.description || "",
      }
    : {
        eventName: "Event Name",
        date: "Date TBD",
        time: "00:00 AM",
        location: "Location",
        hostName: "Host",
        title: "Title",
        description: "",
      };

  const handleMemberChange = (field: keyof MemberDetails, value: string) => {
    setInviteError(null);
    setMemberDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendInvitation = async () => {
    // Validation
    if (!memberDetails.name.trim()) {
      toast.error("Please enter member name");
      return;
    }
    if (!memberDetails.email.trim()) {
      toast.error("Please enter member email");
      return;
    }
    if (!eventId) {
      toast.error("Event ID not found");
      return;
    }

    setIsGenerating(true);
    setInviteError(null);

    try {
      // Step 1: Generate files
      toast.loading("Generating invitation card...", { id: "generating" });

      const { imageFile } = await generateCardWithOverlay(
        INVITATION_CARD_IMAGE,
        eventData,
        memberDetails.name
      );

      toast.success("Card generated successfully!", { id: "generating" });

      // Step 2: Send invitation with generated card image
      toast.loading("Sending invitation...", { id: "sending" });

      await addEventMember({
        eventId,
        memberDetails,
        file: imageFile,
      }).unwrap();

      toast.success("Invitation sent successfully!", { id: "sending" });

      // Reset form
      setMemberDetails({ name: "", email: "" });
      setInviteError(null);

    } catch (error: unknown) {
      console.error("Failed to send invitation:", error);
      toast.dismiss("generating");
      toast.dismiss("sending");

      const errorMessage = getInviteErrorMessage(error);
      setInviteError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    const toastId = toast.loading("Generating files...");

    try {
      const { imageFile, pdfFile } = await generateCardWithOverlay(
        INVITATION_CARD_IMAGE,
        eventData,
        memberDetails.name
      );

      // Download image
      const imgUrl = URL.createObjectURL(imageFile);
      const imgLink = document.createElement("a");
      imgLink.href = imgUrl;
      imgLink.download = imageFile.name;
      document.body.appendChild(imgLink);
      imgLink.click();
      document.body.removeChild(imgLink);
      URL.revokeObjectURL(imgUrl);

      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 100));

      // Download PDF
      const pdfUrl = URL.createObjectURL(pdfFile);
      const pdfLink = document.createElement("a");
      pdfLink.href = pdfUrl;
      pdfLink.download = pdfFile.name;
      document.body.appendChild(pdfLink);
      pdfLink.click();
      document.body.removeChild(pdfLink);
      URL.revokeObjectURL(pdfUrl);

      toast.success("Files downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Failed to download:", error);
      toast.error("Failed to download files", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  if (eventLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-[#0f0924] to-black">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-r from-black via-[#0f0924] to-black">
      <div className="max-w-7xl md:mt-24 mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-medium">Back</span>
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 font-cormorant">
          Send Event Invitation
        </h1>

        {/* Preview and Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Preview */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Card Preview
            </h3>
            <div className="relative w-full max-w-md aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-4 border-purple-500/30">
                <Image
                  src={INVITATION_CARD_IMAGE}
                  alt="Invitation card"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 top-[42%] bg-gradient-to-b from-transparent via-[#080c1c]/20 to-[#080c1c]/45 pointer-events-none" />

                {/* Text overlay — lower section only, matches exported card */}
                <div className="absolute inset-x-0 bottom-0 top-[44%] flex flex-col items-center justify-start text-center px-6 pt-2 pb-8 gap-1.5">
                  {memberDetails.name && (
                    <p className="italic text-[#e8dfc0]/95 text-sm md:text-base font-cormorant">
                      Dear {memberDetails.name},
                    </p>
                  )}
                  <p className="text-[#e8dfc0] text-lg md:text-xl font-semibold tracking-wide font-cormorant">
                    {eventData.eventName || eventData.title}
                  </p>
                  {eventData.description && (
                    <p className="text-[rgba(220,200,160,0.92)] text-xs md:text-sm italic max-w-[85%] font-cormorant leading-snug">
                      {eventData.description}
                    </p>
                  )}
                  <p className="text-[#d4b96a] text-sm md:text-base font-medium tracking-wide font-cormorant mt-1">
                    {eventData.date}
                  </p>
                  <p className="text-[#e8dfc0] text-sm md:text-base font-cormorant">
                    {eventData.time}
                  </p>
                  <p className="text-[rgba(220,200,160,0.9)] text-sm md:text-base italic font-cormorant">
                    {eventData.location}
                  </p>
                </div>
              </div>
          </div>

          {/* Right: Form */}
          <div className="bg-gradient-to-br from-[#2C233E] to-[#1a1525] border-2 border-purple-500/30 rounded-xl p-6 shadow-2xl">
            <h3 className="text-2xl font-semibold text-purple-400 mb-6 font-cormorant flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Invitation Details
            </h3>

            {/* Member Details */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Member Name *
                </label>
                <input
                  type="text"
                  value={memberDetails.name}
                  onChange={(e) => handleMemberChange("name", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/80 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter member name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Member Email *
                </label>
                <input
                  type="email"
                  value={memberDetails.email}
                  onChange={(e) => handleMemberChange("email", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/80 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter member email"
                />
              </div>
            </div>

            {/* Event Info */}
            {sourceEvent && (
              <div className="mb-6 p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-lg border border-purple-500/20">
                <h4 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Event Information
                </h4>
                <div className="text-sm text-gray-300 space-y-2">
                  <p className="flex items-start gap-2">
                    <span className="font-semibold text-purple-300 min-w-[70px]">Title:</span>
                    <span className="flex-1">{sourceEvent.title}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-semibold text-purple-300 min-w-[70px]">Date:</span>
                    <span className="flex-1">{eventData.date} at {eventData.time}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-semibold text-purple-300 min-w-[70px]">Location:</span>
                    <span className="flex-1">{eventData.location}</span>
                  </p>
                </div>
              </div>
            )}

            {inviteError && (
              <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-300">
                    Could not send invitation
                  </p>
                  <p className="text-sm text-red-200 mt-1">{inviteError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setInviteError(null)}
                  className="text-red-300 hover:text-red-100 transition-colors"
                  aria-label="Dismiss error"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleDownload}
                disabled={isGenerating || !sourceEvent}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </>
                )}
              </button>

              <button
                onClick={handleSendInvitation}
                disabled={
                  isGenerating || isSending || !sourceEvent
                }
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isGenerating || isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Send Invitation
                  </>
                )}
              </button>
            </div>

            {!sourceEvent && !eventLoading && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-sm text-red-300">
                  No event found. Please go back and select an event.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
