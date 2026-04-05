"use client";

import {
  useAddEventMemberMutation,
  useGetEventByIdQuery,
} from "@/redux/features/event/eventSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

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

export default function InvitationCard() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id") || "";

  const [passedEvent, setPassedEvent] = useState<PassedEvent | null>(null);

  useEffect(() => {
    const storedEvent = sessionStorage.getItem("selectedEvent");
    if (storedEvent) {
      try {
        const parsedEvent = JSON.parse(storedEvent);
        setPassedEvent(parsedEvent);
        sessionStorage.removeItem("selectedEvent");
      } catch (error) {
        console.error("Error parsing stored event:", error);
      }
    }
  }, []);

  const { data: eventDetails, isLoading: eventLoading } = useGetEventByIdQuery(
    eventId,
    { skip: !eventId || !!passedEvent }
  );

  const [addEventMember, { isLoading: isSending }] = useAddEventMemberMutation();

  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [memberDetails, setMemberDetails] = useState<MemberDetails>({
    name: "",
    email: "",
  });
  const [generatedFile, setGeneratedFile] = useState<File | null>(null);

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
        date: "Date",
        time: "Time",
        location: "Location",
        hostName: "Host Name",
        title: "Title",
        description: "Description",
      };

  const handleMemberChange = (field: keyof MemberDetails, value: string) => {
    setMemberDetails((prev) => ({ ...prev, [field]: value }));
  };

  const generatePDF = async (): Promise<File | null> => {
    if (!cardRef.current) {
      toast.error("Card not found");
      return null;
    }

    try {
      const card = cardRef.current;
      const originalWidth = card.style.width;
      const originalHeight = card.style.height;

      card.style.width = "480px";
      card.style.height = "640px";

      await new Promise((r) => setTimeout(r, 150));

      const canvas = await html2canvas(card, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#fff7ed",
        width: 480,
        height: 640,
        windowWidth: 1200,
        windowHeight: 900,
        ignoreElements: (el) => el.classList.contains("animate-pulse"),
      });

      card.style.width = originalWidth;
      card.style.height = originalHeight;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      const pdfBlob = pdf.output("blob");
      const fileName = `invitation-${(eventData.eventName || "card")
        .replace(/\s+/g, "-")
        .toLowerCase()}.pdf`;

      const file = new File([pdfBlob], fileName, { type: "application/pdf" });
      console.log("✅ PDF generated:", fileName, `(${(pdfBlob.size / 1024).toFixed(2)} KB)`);
      return file;
    } catch (error: any) {
      console.error("❌ PDF generation failed:", error);
      toast.error("Failed to generate PDF: " + (error?.message || "Unknown error"));
      return null;
    }
  };

  const handleSendInvitation = async () => {
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
    let pdfFile: File | null = null;

    try {
      pdfFile = await generatePDF();

      if (!pdfFile) {
        toast.error("Failed to generate invitation card");
        return;
      }

      setGeneratedFile(pdfFile);

      const dataPayload = {
        event: eventId,
        memberDetails: {
          name: memberDetails.name,
          email: memberDetails.email,
        },
      };

      console.log("📦 data:", JSON.stringify(dataPayload, null, 2));
      console.log("📄 file:", pdfFile );

      const result = await addEventMember({
        eventId,
        memberDetails,
        file: pdfFile,
      }).unwrap();

      console.log("✅ Success:", result);
      toast.success("Invitation sent successfully!");
      setMemberDetails({ name: "", email: "" });
      setGeneratedFile(null);
    } catch (error: any) {
      console.error("❌ Failed:", error);
      toast.error(error?.data?.message || "Failed to send invitation");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const file = await generatePDF();
      if (file) {
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("PDF downloaded!");
      }
    } catch (error) {
      toast.error("Failed to download PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  if (eventLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fff7ed" }}>
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap");
      `}</style>

      <div className="min-h-screen py-8 px-4" style={{ background: "#fef3c7" }}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">

          {/* ── LEFT: Card Preview ── */}
          <div className="w-full lg:w-1/2 flex items-center justify-center lg:sticky lg:top-8">
            <div
              ref={cardRef}
              className="relative w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
              style={{
                height: "640px",
                // Plain hex only — no oklch/lab gradients that break html2canvas
                backgroundColor: "#fff7ed",
              }}
            >
              {/* Subtle radial warmth overlay — inline SVG, safe for canvas */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 480 640"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <radialGradient id="warmGlow" cx="50%" cy="50%" r="70%">
                    <stop offset="0%"   stopColor="#fde68a" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#fff7ed" stopOpacity="0"    />
                  </radialGradient>
                </defs>
                <rect width="480" height="640" fill="url(#warmGlow)" />
              </svg>

              {/* ── Corner Ornaments ── */}
              {/* Top Left */}
              <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none" style={{ color: "#fdba74" }}>
                <svg viewBox="0 0 200 200" className="w-full h-full" fill="currentColor">
                  <path d="M 0,0 Q 50,0 75,25 Q 100,50 125,25 Q 150,0 200,0 L 200,25 Q 175,25 150,50 Q 125,75 100,50 Q 75,25 50,25 L 50,75 Q 50,100 25,125 Q 0,150 0,200 L 0,0" />
                  <circle cx="60" cy="60" r="15" opacity="0.8" />
                  <circle cx="75" cy="45" r="8"  opacity="0.6" />
                  <circle cx="45" cy="75" r="8"  opacity="0.6" />
                  <circle cx="80" cy="65" r="6"  opacity="0.5" />
                  <circle cx="50" cy="50" r="6"  opacity="0.5" />
                </svg>
              </div>

              {/* Top Right */}
              <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none" style={{ color: "#fdba74", transform: "scaleX(-1)" }}>
                <svg viewBox="0 0 200 200" className="w-full h-full" fill="currentColor">
                  <path d="M 0,0 Q 50,0 75,25 Q 100,50 125,25 Q 150,0 200,0 L 200,25 Q 175,25 150,50 Q 125,75 100,50 Q 75,25 50,25 L 50,75 Q 50,100 25,125 Q 0,150 0,200 L 0,0" />
                  <circle cx="60" cy="60" r="15" opacity="0.8" />
                  <circle cx="75" cy="45" r="8"  opacity="0.6" />
                  <circle cx="45" cy="75" r="8"  opacity="0.6" />
                  <circle cx="80" cy="65" r="6"  opacity="0.5" />
                  <circle cx="50" cy="50" r="6"  opacity="0.5" />
                </svg>
              </div>

              {/* Bottom Left */}
              <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none" style={{ color: "#fdba74", transform: "scaleY(-1)" }}>
                <svg viewBox="0 0 200 200" className="w-full h-full" fill="currentColor">
                  <path d="M 0,0 Q 50,0 75,25 Q 100,50 125,25 Q 150,0 200,0 L 200,25 Q 175,25 150,50 Q 125,75 100,50 Q 75,25 50,25 L 50,75 Q 50,100 25,125 Q 0,150 0,200 L 0,0" />
                  <circle cx="60" cy="60" r="15" opacity="0.8" />
                  <circle cx="75" cy="45" r="8"  opacity="0.6" />
                  <circle cx="45" cy="75" r="8"  opacity="0.6" />
                  <circle cx="80" cy="65" r="6"  opacity="0.5" />
                  <circle cx="50" cy="50" r="6"  opacity="0.5" />
                </svg>
              </div>

              {/* Bottom Right */}
              <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none" style={{ color: "#fdba74", transform: "scale(-1)" }}>
                <svg viewBox="0 0 200 200" className="w-full h-full" fill="currentColor">
                  <path d="M 0,0 Q 50,0 75,25 Q 100,50 125,25 Q 150,0 200,0 L 200,25 Q 175,25 150,50 Q 125,75 100,50 Q 75,25 50,25 L 50,75 Q 50,100 25,125 Q 0,150 0,200 L 0,0" />
                  <circle cx="60" cy="60" r="15" opacity="0.8" />
                  <circle cx="75" cy="45" r="8"  opacity="0.6" />
                  <circle cx="45" cy="75" r="8"  opacity="0.6" />
                  <circle cx="80" cy="65" r="6"  opacity="0.5" />
                  <circle cx="50" cy="50" r="6"  opacity="0.5" />
                </svg>
              </div>

              {/* Center Bottom Ornament */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-28 h-16 pointer-events-none" style={{ color: "#f59e0b" }}>
                <svg viewBox="0 0 100 60" className="w-full h-full" fill="currentColor">
                  <path d="M 50,0 L 45,10 Q 40,15 35,15 Q 30,15 25,20 L 20,30 Q 15,35 10,35 L 0,40 L 10,45 Q 15,45 20,50 L 25,60 Q 30,55 35,55 Q 40,55 45,50 L 50,60 L 55,50 Q 60,55 65,55 Q 70,55 75,60 L 80,50 Q 85,45 90,45 L 100,40 L 90,35 Q 85,35 80,30 L 75,20 Q 70,15 65,15 Q 60,15 55,10 Z" opacity="0.8" />
                  <circle cx="50" cy="40" r="8" opacity="0.9" />
                  <circle cx="30" cy="42" r="4" opacity="0.7" />
                  <circle cx="70" cy="42" r="4" opacity="0.7" />
                </svg>
              </div>

              {/* Static sparkles — no animate-pulse (breaks html2canvas) */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full" style={{ backgroundColor: "#fcd34d", opacity: 0.4 }} />
                <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#fb923c", opacity: 0.35 }} />
                <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full" style={{ backgroundColor: "#fda4af", opacity: 0.3 }} />
                <div className="absolute top-1/2 right-1/4 w-1 h-1 rounded-full" style={{ backgroundColor: "#fbbf24", opacity: 0.5 }} />
              </div>

              {/* ── Card Content ── */}
              <div
                className="relative z-10 flex flex-col items-center justify-center h-full px-8 py-10 text-center"
              >
                {/* Title */}
                <h1
                  className="text-5xl italic mb-3 tracking-wide"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#92400e" }}
                >
                  Invitation
                </h1>

                {/* Divider — plain hex, no Tailwind gradient */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div style={{ width: "48px", height: "1px", backgroundColor: "#d97706" }} />
                  <svg style={{ width: "20px", height: "20px", color: "#d97706" }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" />
                  </svg>
                  <div style={{ width: "48px", height: "1px", backgroundColor: "#d97706" }} />
                </div>

                {/* Host Name */}
                {eventData.hostName && (
                  <p
                    className="text-2xl font-medium mb-3"
                    style={{ fontFamily: "'Playfair Display', serif", color: "#92400e" }}
                  >
                    {eventData.hostName}
                  </p>
                )}

                {/* Member name — personalised */}
                {memberDetails.name && (
                  <p
                    className="text-xl italic mb-3"
                    style={{ fontFamily: "'Playfair Display', serif", color: "#b45309" }}
                  >
                    Dear {memberDetails.name},
                  </p>
                )}

                {/* Invite copy */}
                <p
                  className="text-sm font-light mb-1"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "#78350f",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  You're Cordially Invited to
                </p>
                <p
                  className="text-lg font-semibold mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#92400e" }}
                >
                  {eventData.eventName}
                </p>
                <p
                  className="text-sm font-light mb-4"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "#78350f",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  Celebrate With Us
                </p>

                {/* Description */}
                {eventData.description && (
                  <p
                    className="text-xs italic leading-relaxed px-4 mb-4"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: "#92400e",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    &ldquo;{eventData.description}&rdquo;
                  </p>
                )}

                {/* Mini divider */}
                <div className="flex items-center justify-center gap-2 mb-5">
                  <div style={{ width: "32px", height: "1px", backgroundColor: "#d97706", opacity: 0.5 }} />
                  <svg style={{ width: "12px", height: "12px", color: "#d97706" }} viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <div style={{ width: "32px", height: "1px", backgroundColor: "#d97706", opacity: 0.5 }} />
                </div>

                {/* Date / Time / Location */}
                <div style={{ color: "#78350f" }} className="space-y-3">
                  <div className="flex items-center justify-center gap-4">
                    <p
                      className="text-base font-light"
                      style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.05em" }}
                    >
                      {eventData.date}
                    </p>
                    <div style={{ width: "1px", height: "20px", backgroundColor: "#fbbf24" }} />
                    <p
                      className="text-base font-light"
                      style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.05em" }}
                    >
                      {eventData.time}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <div style={{ width: "32px", height: "1px", backgroundColor: "#d97706", opacity: 0.5 }} />
                    <svg style={{ width: "12px", height: "12px", color: "#d97706" }} viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <div style={{ width: "32px", height: "1px", backgroundColor: "#d97706", opacity: 0.5 }} />
                  </div>

                  <p
                    className="text-base font-light"
                    style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.05em" }}
                  >
                    {eventData.location}
                  </p>
                </div>
              </div>

              {/* Inner border */}
              <div
                className="absolute inset-4 rounded-lg pointer-events-none"
                style={{ border: "1px solid rgba(217,119,6,0.2)" }}
              />
            </div>
          </div>

          {/* ── RIGHT: Form ── */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">
                Send Invitation
              </h2>

              {/* Member Details */}
              <div className="mb-6 p-4 rounded-lg border border-amber-200" style={{ backgroundColor: "#fffbeb" }}>
                <h3 className="text-lg font-semibold text-amber-900 mb-4">
                  Member Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">
                      Member Name *
                    </label>
                    <input
                      type="text"
                      value={memberDetails.name}
                      onChange={(e) => handleMemberChange("name", e.target.value)}
                      className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">
                      Member Email *
                    </label>
                    <input
                      type="email"
                      value={memberDetails.email}
                      onChange={(e) => handleMemberChange("email", e.target.value)}
                      className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Event Info */}
              {sourceEvent && (
                <div className="mb-6 p-4 rounded-lg border border-blue-200" style={{ backgroundColor: "#eff6ff" }}>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Event Information
                  </h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><span className="font-medium">Title:</span> {sourceEvent.title}</p>
                    <p><span className="font-medium">Date:</span> {eventData.date} at {eventData.time}</p>
                    <p><span className="font-medium">Location:</span> {eventData.location}</p>
                    <p><span className="font-medium">Event ID:</span> {sourceEvent._id}</p>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleDownload}
                  disabled={isGenerating || !sourceEvent}
                  className="w-full text-white py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#b45309" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#92400e")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#b45309")}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Download PDF"
                  )}
                </button>

                <button
                  onClick={handleSendInvitation}
                  disabled={isGenerating || isSending || !sourceEvent}
                  className="w-full text-white py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#78350f" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#451a03")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#78350f")}
                >
                  {isGenerating || isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Invitation"
                  )}
                </button>
              </div>

              {generatedFile && (
                <p className="mt-4 text-sm text-green-600 text-center font-medium">
                  ✅ {generatedFile.name} ready
                </p>
              )}

              {!sourceEvent && !eventLoading && (
                <p className="mt-4 text-sm text-red-500 text-center">
                  ⚠️ No event found. Please go back and select an event.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}