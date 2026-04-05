 
// "use client";

// import {
//   useAddEventMemberMutation,
//   useGetEventByIdQuery,
// } from "@/redux/features/event/eventSlice";
// import jsPDF from "jspdf";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import toast from "react-hot-toast";

// interface EventData {
//   eventName: string;
//   date: string;
//   time: string;
//   location: string;
//   hostName: string;
//   title: string;
//   description: string;
// }

// interface MemberDetails {
//   name: string;
//   email: string;
// }

// interface PassedEvent {
//   _id: string;
//   title: string;
//   description: string;
//   eventDate: string;
//   address: string;
//   purchaseOption: string;
//   hostName?: string;
//   eventName?: string;
// }

// // ─── Draw the invitation card onto a Canvas 2D context ───────────────────────
// // No DOM, no CSS parsing — zero oklab issues.
// function drawInvitationCard(
//   ctx: CanvasRenderingContext2D,
//   W: number,
//   H: number,
//   eventData: EventData,
//   memberName: string,
// ) {
//   // ── Background ──
//   const bg = ctx.createLinearGradient(0, 0, W, H);
//   bg.addColorStop(0,    "#0a1628");
//   bg.addColorStop(0.25, "#1a365d");
//   bg.addColorStop(0.5,  "#0d1f3c");
//   bg.addColorStop(0.75, "#1e3a5f");
//   bg.addColorStop(1,    "#0a1628");
//   ctx.fillStyle = bg;
//   ctx.fillRect(0, 0, W, H);

//   // ── Subtle radial glow center ──
//   const glow = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W * 0.7);
//   glow.addColorStop(0,   "rgba(212,175,55,0.08)");
//   glow.addColorStop(1,   "rgba(0,0,0,0)");
//   ctx.fillStyle = glow;
//   ctx.fillRect(0, 0, W, H);

//   // ── Stars / sparkles ──
//   const stars = [
//     [0.15,0.10],[0.80,0.20],[0.10,0.35],[0.85,0.50],
//     [0.20,0.65],[0.90,0.75],[0.25,0.85],[0.70,0.15],
//     [0.08,0.55],[0.92,0.40],[0.30,0.70],[0.75,0.90],
//   ];
//   stars.forEach(([x, y]) => {
//     ctx.beginPath();
//     ctx.arc(x * W, y * H, 2, 0, Math.PI * 2);
//     ctx.fillStyle = "rgba(250,204,21,0.7)";
//     ctx.fill();
//   });

//   // ── Outer border ──
//   const pad = 16;
//   ctx.strokeStyle = "rgba(202,138,4,0.45)";
//   ctx.lineWidth = 1;
//   ctx.strokeRect(pad, pad, W - pad*2, H - pad*2);

//   // ── Corner accents ──
//   const cornerSize = 24;
//   const corners = [
//     [pad, pad, 1, 1], [W-pad, pad, -1, 1],
//     [pad, H-pad, 1, -1], [W-pad, H-pad, -1, -1],
//   ] as [number, number, number, number][];

//   corners.forEach(([cx, cy, dx, dy]) => {
//     ctx.strokeStyle = "#eab308";
//     ctx.lineWidth = 1.5;
//     ctx.beginPath();
//     ctx.moveTo(cx + dx * cornerSize, cy);
//     ctx.lineTo(cx, cy);
//     ctx.lineTo(cx, cy + dy * cornerSize);
//     ctx.stroke();
//     // Corner dot
//     ctx.beginPath();
//     ctx.arc(cx, cy, 3, 0, Math.PI * 2);
//     ctx.fillStyle = "#eab308";
//     ctx.fill();
//   });

//   // ── Mid-border dots ──
//   [[W/2, pad], [W/2, H-pad], [pad, H/2], [W-pad, H/2]].forEach(([x, y]) => {
//     ctx.beginPath();
//     ctx.arc(x, y, 2.5, 0, Math.PI * 2);
//     ctx.fillStyle = "#eab308";
//     ctx.fill();
//   });

//   // ── Helper: centered text with gold gradient ──
//   const goldText = (
//     text: string,
//     y: number,
//     fontSize: number,
//     fontStyle = "normal",
//     alpha = 1,
//   ) => {
//     ctx.save();
//     ctx.globalAlpha = alpha;
//     ctx.font = `${fontStyle} ${fontSize}px 'Georgia', serif`;
//     ctx.textAlign = "center";
//     const grad = ctx.createLinearGradient(0, y - fontSize, 0, y + 4);
//     grad.addColorStop(0, "#fbbf24");
//     grad.addColorStop(0.5, "#f59e0b");
//     grad.addColorStop(1, "#d97706");
//     ctx.fillStyle = grad;
//     ctx.fillText(text, W / 2, y);
//     ctx.restore();
//   };

//   // ── Helper: centered plain text ──
//   const plainText = (
//     text: string,
//     y: number,
//     fontSize: number,
//     color: string,
//     fontStyle = "normal",
//     alpha = 1,
//   ) => {
//     ctx.save();
//     ctx.globalAlpha = alpha;
//     ctx.font = `${fontStyle} ${fontSize}px 'Georgia', serif`;
//     ctx.textAlign = "center";
//     ctx.fillStyle = color;
//     ctx.fillText(text, W / 2, y);
//     ctx.restore();
//   };

//   // ── Helper: divider line with dot ──
//   const divider = (y: number, lineW = 64, alpha = 0.6) => {
//     ctx.save();
//     ctx.globalAlpha = alpha;
//     // Left line
//     const g1 = ctx.createLinearGradient(W/2 - lineW - 8, y, W/2 - 8, y);
//     g1.addColorStop(0, "transparent");
//     g1.addColorStop(1, "#eab308");
//     ctx.strokeStyle = g1;
//     ctx.lineWidth = 1;
//     ctx.beginPath();
//     ctx.moveTo(W/2 - lineW - 8, y);
//     ctx.lineTo(W/2 - 8, y);
//     ctx.stroke();
//     // Right line
//     const g2 = ctx.createLinearGradient(W/2 + 8, y, W/2 + lineW + 8, y);
//     g2.addColorStop(0, "#eab308");
//     g2.addColorStop(1, "transparent");
//     ctx.strokeStyle = g2;
//     ctx.beginPath();
//     ctx.moveTo(W/2 + 8, y);
//     ctx.lineTo(W/2 + lineW + 8, y);
//     ctx.stroke();
//     // Center dot
//     ctx.beginPath();
//     ctx.arc(W/2, y, 2.5, 0, Math.PI * 2);
//     ctx.fillStyle = "#eab308";
//     ctx.fill();
//     ctx.restore();
//   };

//   // ── Helper: wrap text ──
//   const wrapText = (
//     text: string,
//     y: number,
//     maxW: number,
//     fontSize: number,
//     color: string,
//     lineH: number,
//     alpha = 1,
//   ) => {
//     ctx.save();
//     ctx.globalAlpha = alpha;
//     ctx.font = `italic ${fontSize}px 'Georgia', serif`;
//     ctx.textAlign = "center";
//     ctx.fillStyle = color;
//     const words = text.split(" ");
//     let line = "";
//     let curY = y;
//     words.forEach((word) => {
//       const test = line ? line + " " + word : word;
//       if (ctx.measureText(test).width > maxW && line) {
//         ctx.fillText(line, W / 2, curY);
//         line = word;
//         curY += lineH;
//       } else {
//         line = test;
//       }
//     });
//     if (line) ctx.fillText(line, W / 2, curY);
//     ctx.restore();
//     return curY;
//   };

//   // ── Layout ──
//   let y = 80;

//   // "You're Invited"
//   goldText("You're Invited", y, 42, "italic");
//   y += 14;

//   divider(y + 10, 64, 0.7);
//   y += 36;

//   // "Please Join Us For"
//   plainText("PLEASE JOIN US FOR", y, 15, "#fef08a", "normal", 0.75);
//   y += 28;

//   // Member name
//   if (memberName.trim()) {
//     plainText(`Dear ${memberName},`, y, 20, "#fde047", "italic", 0.9);
//     y += 28;
//   }

//   // Event name
//   goldText(eventData.eventName || "Event Name", y, 22, "bold");
//   y += 14;

//   divider(y + 8, 40, 0.5);
//   y += 30;

//   // Description
//   if (eventData.description) {
//     const descText = `"${eventData.description}"`;
//     const lastY = wrapText(descText, y, W - 100, 12, "#fef08a", 18, 0.65);
//     y = lastY + 26;
//   } else {
//     y += 10;
//   }

//   // Date & Time
//   ctx.save();
//   ctx.font = "13px 'Georgia', serif";
//   ctx.textAlign = "center";
//   ctx.fillStyle = "#fde047";
//   ctx.globalAlpha = 0.9;
//   const dateStr  = eventData.date  || "Date";
//   const timeStr  = eventData.time  || "Time";
//   const dateW    = ctx.measureText(dateStr).width;
//   const timeW    = ctx.measureText(timeStr).width;
//   const gap      = 20;
//   const totalW   = dateW + gap + timeW;
//   const startX   = W / 2 - totalW / 2;
//   ctx.fillText(dateStr, startX + dateW / 2, y);
//   // Separator
//   ctx.globalAlpha = 0.4;
//   ctx.fillStyle = "#eab308";
//   ctx.fillRect(startX + dateW + gap / 2 - 0.5, y - 12, 1, 16);
//   ctx.globalAlpha = 0.9;
//   ctx.fillStyle = "#fde047";
//   ctx.fillText(timeStr, startX + dateW + gap + timeW / 2, y);
//   ctx.restore();
//   y += 10;

//   divider(y + 8, 40, 0.45);
//   y += 28;

//   // Location
//   plainText(eventData.location || "Location", y, 13, "#fef08a", "italic", 0.8);
//   y += 28;

//   // Bottom divider
//   divider(H - 44, 48, 0.4);
// }

// // ─── Generate canvas → returns { pdfFile, imageFile } ───────────────────────
// async function generateFiles(
//   eventData: EventData,
//   memberName: string,
//   baseName: string,
// ): Promise<{ pdfFile: File; imageFile: File }> {
//   const W = 480, H = 640;
//   const canvas = document.createElement("canvas");
//   canvas.width  = W * 2;   // @2x for sharpness
//   canvas.height = H * 2;
//   const ctx = canvas.getContext("2d")!;
//   ctx.scale(2, 2);

//   drawInvitationCard(ctx, W, H, eventData, memberName);

//   // ── PNG / Image file ──
//   const imageBlob = await new Promise<Blob>((res, rej) =>
//     canvas.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/png"),
//   );
//   const imageFile = new File([imageBlob], `invitation-${baseName}.png`, {
//     type: "image/png",
//   });

//   // ── PDF file ──
//   const imgData = canvas.toDataURL("image/png");
//   const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
//   const imgW = 210;
//   const imgH = (canvas.height * imgW) / canvas.width;
//   pdf.addImage(imgData, "PNG", 0, 0, imgW, imgH);
//   const pdfBlob = pdf.output("blob");
//   const pdfFile = new File([pdfBlob], `invitation-${baseName}.pdf`, {
//     type: "application/pdf",
//   });

//   return { pdfFile, imageFile };
// }

// // ─── Component ───────────────────────────────────────────────────────────────
// export default function InvitationCard() {
//   const searchParams = useSearchParams();
//   const eventId = searchParams.get("id") || "";

//   const [passedEvent, setPassedEvent] = useState<PassedEvent | null>(null);

//   useEffect(() => {
//     const stored = sessionStorage.getItem("selectedEvent");
//     if (stored) {
//       try {
//         setPassedEvent(JSON.parse(stored));
//         sessionStorage.removeItem("selectedEvent");
//       } catch {}
//     }
//   }, []);

//   const { data: eventDetails, isLoading: eventLoading } = useGetEventByIdQuery(
//     eventId,
//     { skip: !eventId || !!passedEvent },
//   );

//   const [addEventMember, { isLoading: isSending }] = useAddEventMemberMutation();

//   const [isGenerating, setIsGenerating] = useState(false);
//   const [memberDetails, setMemberDetails] = useState<MemberDetails>({ name: "", email: "" });
//   const [generatedPdf,   setGeneratedPdf]   = useState<File | null>(null);
//   const [generatedImage, setGeneratedImage] = useState<File | null>(null);

//   // Live preview canvas
//   const previewRef = useRef<HTMLCanvasElement>(null);

//   const sourceEvent = passedEvent || eventDetails?.data;

//   const eventData: EventData = sourceEvent
//     ? {
//         eventName:   sourceEvent.title || sourceEvent.eventName || "",
//         date: sourceEvent.eventDate
//           ? new Date(sourceEvent.eventDate).toLocaleDateString("en-US", {
//               weekday: "long", year: "numeric", month: "long", day: "numeric",
//             })
//           : "",
//         time: sourceEvent.eventDate
//           ? new Date(sourceEvent.eventDate).toLocaleTimeString("en-US", {
//               hour: "2-digit", minute: "2-digit",
//             })
//           : "",
//         location:    sourceEvent.address || "",
//         hostName:    sourceEvent.hostName || "",
//         title:       sourceEvent.title || "",
//         description: sourceEvent.description || "",
//       }
//     : {
//         eventName: "Event Name", date: "Date TBD", time: "00:00 AM",
//         location: "Location",   hostName: "Host",
//         title: "Title",         description: "",
//       };

//   // Redraw preview whenever member name or event data changes
//   useEffect(() => {
//     const canvas = previewRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     drawInvitationCard(ctx, canvas.width, canvas.height, eventData, memberDetails.name);
//   }, [memberDetails.name, eventData]);

//   const baseName = (eventData.eventName || "card").replace(/\s+/g, "-").toLowerCase();

//   const handleMemberChange = (field: keyof MemberDetails, value: string) =>
//     setMemberDetails((p) => ({ ...p, [field]: value }));

//   // ── Send ──
//   const handleSendInvitation = async () => {
//     if (!memberDetails.name.trim())  { toast.error("Please enter member name");  return; }
//     if (!memberDetails.email.trim()) { toast.error("Please enter member email"); return; }
//     if (!eventId)                    { toast.error("Event ID not found");         return; }

//     setIsGenerating(true);
//     let pdfFile:   File | null = null;
//     let imageFile: File | null = null;

//     try {
//       ({ pdfFile, imageFile } = await generateFiles(eventData, memberDetails.name, baseName));
//       setGeneratedPdf(pdfFile);
//       setGeneratedImage(imageFile);

//       const dataPayload = {
//         event: eventId,
//         memberDetails: { name: memberDetails.name, email: memberDetails.email },
//       };

//       console.log("📦 data:",  JSON.stringify(dataPayload, null, 2));
//       console.log("📄 PDF:",   pdfFile.name,   `(${(pdfFile.size   / 1024).toFixed(1)} KB)`);
//       console.log("🖼️  Image:", imageFile.name, `(${(imageFile.size / 1024).toFixed(1)} KB)`);

//       const result = await addEventMember({
//         eventId,
//         memberDetails,
//         pdfFile,
//         imageFile,
//       }).unwrap();

//       console.log("✅ Success:", result);
//       toast.success("Invitation sent successfully!");
//       setMemberDetails({ name: "", email: "" });
//       setGeneratedPdf(null);
//       setGeneratedImage(null);
//     } catch (error: any) {
//       console.error("❌ Failed:", error);
//       toast.error(error?.data?.message || "Failed to send invitation");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // ── Download both ──
//   const handleDownload = async () => {
//     setIsGenerating(true);
//     try {
//       const { pdfFile, imageFile } = await generateFiles(eventData, memberDetails.name, baseName);
//       [pdfFile, imageFile].forEach((file) => {
//         const url = URL.createObjectURL(file);
//         const a   = Object.assign(document.createElement("a"), { href: url, download: file.name });
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//       });
//       toast.success("PDF & Image downloaded!");
//     } catch {
//       toast.error("Failed to download");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   if (eventLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-900">
//         <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <>
//       <style jsx global>{`
//         @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap");
//       `}</style>

//       <div className="min-h-screen py-8 px-4" style={{ backgroundColor: "#0a1628" }}>
//         <div className="max-w-7xl md:mt-24 mx-auto flex flex-col lg:flex-row gap-8 items-start">

//           {/* ── LEFT: Live Canvas Preview ── */}
//           <div className="w-full lg:w-1/2 flex flex-col items-center gap-4 lg:sticky lg:top-8">
//             <p className="text-yellow-400 text-sm font-medium tracking-wider uppercase opacity-70">
//               Live Preview
//             </p>
//             <canvas
//               ref={previewRef}
//               width={480}
//               height={540}
//               className="rounded-xl shadow-2xl"
//               style={{
//                 maxWidth: "100%",
//                 boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(212,175,55,0.1)",
//               }}
//             />
//             <p className="text-yellow-600 text-xs opacity-60">
//               Card updates live as you type
//             </p>
//           </div>

//           {/* ── RIGHT: Form ── */}
//           <div className="w-full lg:w-1/2">
//             <div
//               className="rounded-xl p-6 sticky top-8"
//               style={{
//                 backgroundColor: "#0f2040",
//                 border: "1px solid rgba(202,138,4,0.3)",
//                 boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
//               }}
//             >
//               <h2
//                 className="text-2xl font-bold mb-6 text-center"
//                 style={{ color: "#fbbf24", fontFamily: "'Playfair Display', serif" }}
//               >
//                 Send Invitation
//               </h2>

//               {/* Member Details */}
//               <div
//                 className="mb-6 p-4 rounded-lg"
//                 style={{ backgroundColor: "#0a1628", border: "1px solid rgba(202,138,4,0.2)" }}
//               >
//                 <h3 className="text-base font-semibold mb-4" style={{ color: "#fde047" }}>
//                   Member Details
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-medium mb-2" style={{ color: "#fbbf24", opacity: 0.8 }}>
//                       Member Name *
//                     </label>
//                     <input
//                       type="text"
//                       value={memberDetails.name}
//                       onChange={(e) => handleMemberChange("name", e.target.value)}
//                       className="w-full px-4 py-2 rounded-lg outline-none text-white text-sm"
//                       style={{
//                         backgroundColor: "#1a365d",
//                         border: "1px solid rgba(202,138,4,0.4)",
//                         color: "#fff",
//                       }}
//                       placeholder="John Doe"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium mb-2" style={{ color: "#fbbf24", opacity: 0.8 }}>
//                       Member Email *
//                     </label>
//                     <input
//                       type="email"
//                       value={memberDetails.email}
//                       onChange={(e) => handleMemberChange("email", e.target.value)}
//                       className="w-full px-4 py-2 rounded-lg outline-none text-sm"
//                       style={{
//                         backgroundColor: "#1a365d",
//                         border: "1px solid rgba(202,138,4,0.4)",
//                         color: "#fff",
//                       }}
//                       placeholder="john@example.com"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Event Info */}
//               {sourceEvent && (
//                 <div
//                   className="mb-6 p-4 rounded-lg"
//                   style={{ backgroundColor: "#0a1628", border: "1px solid rgba(202,138,4,0.2)" }}
//                 >
//                   <h3 className="text-base font-semibold mb-2" style={{ color: "#fde047" }}>
//                     Event Information
//                   </h3>
//                   <div className="text-sm space-y-1" style={{ color: "#fbbf24", opacity: 0.8 }}>
//                     <p><span className="font-medium">Title:</span> {sourceEvent.title}</p>
//                     <p><span className="font-medium">Date:</span> {eventData.date} at {eventData.time}</p>
//                     <p><span className="font-medium">Location:</span> {eventData.location}</p>
//                     <p><span className="font-medium">Event ID:</span> {sourceEvent._id}</p>
//                   </div>
//                 </div>
//               )}

//               {/* Generated files status */}
//               {(generatedPdf || generatedImage) && (
//                 <div
//                   className="mb-4 p-3 rounded-lg"
//                   style={{ backgroundColor: "#052e16", border: "1px solid #166534" }}
//                 >
//                   <p className="text-xs font-medium text-green-400 mb-1">Generated files:</p>
//                   {generatedPdf   && <p className="text-xs text-green-500">📄 {generatedPdf.name} ({(generatedPdf.size / 1024).toFixed(1)} KB)</p>}
//                   {generatedImage && <p className="text-xs text-green-500">🖼️ {generatedImage.name} ({(generatedImage.size / 1024).toFixed(1)} KB)</p>}
//                 </div>
//               )}

//               {/* Buttons */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <button
//                   onClick={handleDownload}
//                   disabled={isGenerating || !sourceEvent}
//                   className="w-full py-3 rounded-lg font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
//                   style={{
//                     background: "linear-gradient(135deg, #b45309, #92400e)",
//                     color: "#fef3c7",
//                     border: "1px solid rgba(202,138,4,0.4)",
//                   }}
//                 >
//                   {isGenerating ? (
//                     <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
//                   ) : "⬇ Download PDF + Image"}
//                 </button>

//                 <button
//                   onClick={handleSendInvitation}
//                   disabled={isGenerating || isSending || !sourceEvent}
//                   className="w-full py-3 rounded-lg font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
//                   style={{
//                     background: "linear-gradient(135deg, #eab308, #ca8a04)",
//                     color: "#1a1a00",
//                     border: "1px solid rgba(202,138,4,0.6)",
//                   }}
//                 >
//                   {isGenerating || isSending ? (
//                     <><div className="w-4 h-4 border-2 border-yellow-900 border-t-transparent rounded-full animate-spin" /> Sending...</>
//                   ) : "✉ Send Invitation"}
//                 </button>
//               </div>

//               {!sourceEvent && !eventLoading && (
//                 <p className="mt-4 text-sm text-red-400 text-center">
//                   ⚠️ No event found. Please go back and select an event.
//                 </p>
//               )}
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }


"use client";

import {
  useAddEventMemberMutation,
  useGetEventByIdQuery,
} from "@/redux/features/event/eventSlice";
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

// ─── Canvas Card Renderer ────────────────────────────────────────────────────
function drawInvitationCard(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  eventData: EventData,
  memberName: string,
) {
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0,    "#0a1628");
  bg.addColorStop(0.25, "#1a365d");
  bg.addColorStop(0.5,  "#0d1f3c");
  bg.addColorStop(0.75, "#1e3a5f");
  bg.addColorStop(1,    "#0a1628");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W * 0.7);
  glow.addColorStop(0, "rgba(212,175,55,0.08)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  const stars = [
    [0.15,0.10],[0.80,0.20],[0.10,0.35],[0.85,0.50],
    [0.20,0.65],[0.90,0.75],[0.25,0.85],[0.70,0.15],
    [0.08,0.55],[0.92,0.40],[0.30,0.70],[0.75,0.90],
  ];
  stars.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x * W, y * H, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(250,204,21,0.7)";
    ctx.fill();
  });

  const pad = 16;
  ctx.strokeStyle = "rgba(202,138,4,0.45)";
  ctx.lineWidth = 1;
  ctx.strokeRect(pad, pad, W - pad*2, H - pad*2);

  const cs = 24;
  ([
    [pad, pad, 1, 1], [W-pad, pad, -1, 1],
    [pad, H-pad, 1, -1], [W-pad, H-pad, -1, -1],
  ] as [number,number,number,number][]).forEach(([cx,cy,dx,dy]) => {
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + dx*cs, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + dy*cs);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI*2);
    ctx.fillStyle = "#eab308";
    ctx.fill();
  });

  [[W/2,pad],[W/2,H-pad],[pad,H/2],[W-pad,H/2]].forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI*2);
    ctx.fillStyle = "#eab308";
    ctx.fill();
  });

  const goldText = (text: string, y: number, size: number, style="normal", alpha=1) => {
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.font = `${style} ${size}px Georgia, serif`;
    ctx.textAlign = "center";
    const g = ctx.createLinearGradient(0, y-size, 0, y+4);
    g.addColorStop(0, "#fbbf24"); g.addColorStop(0.5, "#f59e0b"); g.addColorStop(1, "#d97706");
    ctx.fillStyle = g;
    ctx.fillText(text, W/2, y);
    ctx.restore();
  };

  const plainText = (text: string, y: number, size: number, color: string, style="normal", alpha=1) => {
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.font = `${style} ${size}px Georgia, serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = color;
    ctx.fillText(text, W/2, y);
    ctx.restore();
  };

  const divider = (y: number, lw=64, alpha=0.6) => {
    ctx.save(); ctx.globalAlpha = alpha;
    const g1 = ctx.createLinearGradient(W/2-lw-8, y, W/2-8, y);
    g1.addColorStop(0, "transparent"); g1.addColorStop(1, "#eab308");
    ctx.strokeStyle = g1; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(W/2-lw-8, y); ctx.lineTo(W/2-8, y); ctx.stroke();
    const g2 = ctx.createLinearGradient(W/2+8, y, W/2+lw+8, y);
    g2.addColorStop(0, "#eab308"); g2.addColorStop(1, "transparent");
    ctx.strokeStyle = g2;
    ctx.beginPath(); ctx.moveTo(W/2+8, y); ctx.lineTo(W/2+lw+8, y); ctx.stroke();
    ctx.beginPath(); ctx.arc(W/2, y, 2.5, 0, Math.PI*2);
    ctx.fillStyle = "#eab308"; ctx.fill();
    ctx.restore();
  };

  const wrapText = (text: string, y: number, maxW: number, size: number, color: string, lineH: number, alpha=1) => {
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.font = `italic ${size}px Georgia, serif`;
    ctx.textAlign = "center"; ctx.fillStyle = color;
    const words = text.split(" ");
    let line = "", curY = y;
    words.forEach(w => {
      const t = line ? line+" "+w : w;
      if (ctx.measureText(t).width > maxW && line) {
        ctx.fillText(line, W/2, curY); line = w; curY += lineH;
      } else line = t;
    });
    if (line) ctx.fillText(line, W/2, curY);
    ctx.restore();
    return curY;
  };

  let y = 80;
  goldText("You're Invited", y, 42, "italic");
  y += 14; divider(y+10, 64, 0.7); y += 36;
  plainText("PLEASE JOIN US FOR", y, 11, "#fef08a", "normal", 0.75);
  y += 28;
  if (memberName.trim()) {
    plainText(`Dear ${memberName},`, y, 16, "#fde047", "italic", 0.9);
    y += 28;
  }
  goldText(eventData.eventName || "Event Name", y, 22, "bold");
  y += 14; divider(y+8, 40, 0.5); y += 30;
  if (eventData.description) {
    const lastY = wrapText(`"${eventData.description}"`, y, W-100, 16, "#fef08a", 18, 0.65);
    y = lastY + 26;
  } else y += 10;

  ctx.save();
  ctx.font = "13px Georgia, serif"; ctx.textAlign = "center";
  ctx.fillStyle = "#fde047"; ctx.globalAlpha = 0.9;
  const dW = ctx.measureText(eventData.date||"Date").width;
  const tW = ctx.measureText(eventData.time||"Time").width;
  const gap = 20, total = dW + gap + tW;
  const sx = W/2 - total/2;
  ctx.fillText(eventData.date||"Date", sx + dW/2, y);
  ctx.globalAlpha = 0.4; ctx.fillStyle = "#eab308";
  ctx.fillRect(sx + dW + gap/2 - 0.5, y-12, 1, 16);
  ctx.globalAlpha = 0.9; ctx.fillStyle = "#fde047";
  ctx.fillText(eventData.time||"Time", sx + dW + gap + tW/2, y);
  ctx.restore();
  y += 10; divider(y+8, 40, 0.45); y += 28;
  plainText(eventData.location||"Location", y, 13, "#fef08a", "italic", 0.8);
  divider(H-44, 48, 0.4);
}

// ─── Generate both files ─────────────────────────────────────────────────────
async function generateFiles(
  eventData: EventData,
  memberName: string,
  baseName: string,
): Promise<{ pdfFile: File; imageFile: File }> {
  const W = 480, H = 640;
  const canvas = document.createElement("canvas");
  canvas.width = W * 2; canvas.height = H * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(2, 2);
  drawInvitationCard(ctx, W, H, eventData, memberName);

  const imageBlob = await new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error("toBlob failed")), "image/png")
  );
  const imageFile = new File([imageBlob], `invitation-${baseName}.png`, { type: "image/png" });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
  const pdfBlob = pdf.output("blob");
  const pdfFile = new File([pdfBlob], `invitation-${baseName}.pdf`, { type: "application/pdf" });

  return { pdfFile, imageFile };
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function InvitationCard() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id") || "";

  const [passedEvent, setPassedEvent] = useState<PassedEvent | null>(null);
  useEffect(() => {
    const stored = sessionStorage.getItem("selectedEvent");
    if (stored) {
      try { setPassedEvent(JSON.parse(stored)); sessionStorage.removeItem("selectedEvent"); }
      catch {}
    }
  }, []);

  const { data: eventDetails, isLoading: eventLoading } = useGetEventByIdQuery(
    eventId, { skip: !eventId || !!passedEvent }
  );
  const [addEventMember, { isLoading: isSending }] = useAddEventMemberMutation();

  const previewRef                              = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating]         = useState(false);
  const [sendingType,  setSendingType]          = useState<"pdf"|"image"|null>(null);
  const [memberDetails, setMemberDetails]       = useState<MemberDetails>({ name: "", email: "" });
  const [generatedPdf,   setGeneratedPdf]       = useState<File | null>(null);
  const [generatedImage, setGeneratedImage]     = useState<File | null>(null);
  const [filesReady, setFilesReady]             = useState(false);

  const sourceEvent = passedEvent || eventDetails?.data;
  const eventData: EventData = sourceEvent
    ? {
        eventName:   sourceEvent.title || sourceEvent.eventName || "",
        date: sourceEvent.eventDate
          ? new Date(sourceEvent.eventDate).toLocaleDateString("en-US",
              { weekday:"long", year:"numeric", month:"long", day:"numeric" })
          : "",
        time: sourceEvent.eventDate
          ? new Date(sourceEvent.eventDate).toLocaleTimeString("en-US",
              { hour:"2-digit", minute:"2-digit" })
          : "",
        location:    sourceEvent.address || "",
        hostName:    sourceEvent.hostName || "",
        title:       sourceEvent.title || "",
        description: sourceEvent.description || "",
      }
    : { eventName:"Event Name", date:"Date TBD", time:"00:00 AM",
        location:"Location", hostName:"Host", title:"Title", description:"" };

  const baseName = (eventData.eventName || "card").replace(/\s+/g,"-").toLowerCase();

  // Live preview
  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawInvitationCard(ctx, canvas.width, canvas.height, eventData, memberDetails.name);
    setFilesReady(false);
    setGeneratedPdf(null);
    setGeneratedImage(null);
  }, [memberDetails.name, JSON.stringify(eventData)]);

  const handleMemberChange = (field: keyof MemberDetails, value: string) =>
    setMemberDetails(p => ({ ...p, [field]: value }));

  // Validate inputs
  const validate = () => {
    if (!memberDetails.name.trim())  { toast.error("Please enter member name");  return false; }
    if (!memberDetails.email.trim()) { toast.error("Please enter member email"); return false; }
    if (!eventId)                    { toast.error("Event ID not found");         return false; }
    return true;
  };

  // ── Generate both files ──
  const handleGenerate = async () => {
    if (!validate()) return;
    setIsGenerating(true);
    try {
      const { pdfFile, imageFile } = await generateFiles(eventData, memberDetails.name, baseName);
      setGeneratedPdf(pdfFile);
      setGeneratedImage(imageFile);
      setFilesReady(true);
      toast.success("Files ready! Choose how to send.");
    } catch (err: any) {
      toast.error("Failed to generate files");
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Core send function ──
  const sendFile = async (type: "pdf" | "image") => {
    if (!filesReady) { toast.error("Generate files first"); return; }
    const file = type === "pdf" ? generatedPdf : generatedImage;
    if (!file) { toast.error("File not found"); return; }

    setSendingType(type);

    const dataPayload = {
      event: eventId,
      memberDetails: { name: memberDetails.name, email: memberDetails.email },
    };

    console.log("\n========== SENDING INVITATION ==========");
    console.log("📦 data:", JSON.stringify(dataPayload, null, 2));
    console.log(`📎 file (${type.toUpperCase()}):`, file.name, `(${(file.size/1024).toFixed(1)} KB)`);
    console.log("========================================\n");

    try {
      const result = await addEventMember({
        eventId,
        memberDetails,
        file,
      }).unwrap();

      console.log("✅ Success:", result);
      toast.success(
        type === "pdf"
          ? "PDF link sent to member!"
          : "Image invitation sent to member!"
      );
      setMemberDetails({ name: "", email: "" });
      setGeneratedPdf(null);
      setGeneratedImage(null);
      setFilesReady(false);
    } catch (error: any) {
      console.error("❌ Failed:", error);
      toast.error(error?.data?.message || "Failed to send invitation");
    } finally {
      setSendingType(null);
    }
  };

  // ── Download ──
  const downloadFile = (type: "pdf" | "image") => {
    const file = type === "pdf" ? generatedPdf : generatedImage;
    if (!file) { toast.error("Generate files first"); return; }
    const url = URL.createObjectURL(file);
    const a = Object.assign(document.createElement("a"), { href: url, download: file.name });
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    toast.success(`${type.toUpperCase()} downloaded!`);
  };

  if (eventLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0a1628" }}>
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isBusy = isGenerating || !!sendingType || isSending;

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap");
      `}</style>

      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: "#0a1628" }}>
        <div className="max-w-7xl md:mt-20 mt-14 mx-auto flex flex-col lg:flex-row gap-8 items-start">

          {/* ── LEFT: Live Preview ── */}
          <div className="w-full lg:w-1/2 flex flex-col items-center gap-3 lg:sticky lg:top-8">
            <p className="text-xs font-medium tracking-widest uppercase" style={{ color: "#eab308", opacity: 0.6 }}>
              Live Preview
            </p>
            <canvas
              ref={previewRef}
              width={480}
              height={540}
              className="rounded-xl"
              style={{
                maxWidth: "100%",
                boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(212,175,55,0.12)",
              }}
            />
            <p className="text-xs" style={{ color: "#eab308", opacity: 0.4 }}>
              Updates live as you type
            </p>
          </div>

          {/* ── RIGHT: Form ── */}
          <div className="w-full lg:w-1/2">
            <div
              className="rounded-xl p-6 sticky top-8 space-y-5"
              style={{ backgroundColor: "#0f2040", border: "1px solid rgba(202,138,4,0.3)" }}
            >
              <h2
                className="text-2xl font-bold text-center"
                style={{ color: "#fbbf24", fontFamily: "'Playfair Display', serif" }}
              >
                Send Invitation
              </h2>

              {/* Member inputs */}
              <div className="p-4 rounded-lg space-y-3" style={{ backgroundColor: "#0a1628", border: "1px solid rgba(202,138,4,0.2)" }}>
                <h3 className="text-sm font-semibold" style={{ color: "#fde047" }}>Member Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: "#fbbf24", opacity: 0.75 }}>Name *</label>
                    <input
                      type="text"
                      value={memberDetails.name}
                      onChange={e => handleMemberChange("name", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ backgroundColor: "#1a365d", border: "1px solid rgba(202,138,4,0.35)", color: "#fff" }}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: "#fbbf24", opacity: 0.75 }}>Email *</label>
                    <input
                      type="email"
                      value={memberDetails.email}
                      onChange={e => handleMemberChange("email", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ backgroundColor: "#1a365d", border: "1px solid rgba(202,138,4,0.35)", color: "#fff" }}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Event info */}
              {sourceEvent && (
                <div className="p-4 rounded-lg space-y-1" style={{ backgroundColor: "#0a1628", border: "1px solid rgba(202,138,4,0.2)" }}>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: "#fde047" }}>Event Info</h3>
                  <div className="text-xs space-y-1" style={{ color: "#fbbf24", opacity: 0.75 }}>
                    <p><span style={{ opacity: 1, fontWeight: 600 }}>Title:</span> {sourceEvent.title}</p>
                    <p><span style={{ opacity: 1, fontWeight: 600 }}>Date:</span> {eventData.date} at {eventData.time}</p>
                    <p><span style={{ opacity: 1, fontWeight: 600 }}>Location:</span> {eventData.location}</p>
                    <p><span style={{ opacity: 1, fontWeight: 600 }}>ID:</span> {sourceEvent._id}</p>
                  </div>
                </div>
              )}

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={isBusy || !sourceEvent}
                className="w-full py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: filesReady
                    ? "linear-gradient(135deg, #14532d, #166534)"
                    : "linear-gradient(135deg, #1e3a5f, #1a365d)",
                  color: filesReady ? "#86efac" : "#fbbf24",
                  border: `1px solid ${filesReady ? "rgba(74,222,128,0.3)" : "rgba(202,138,4,0.4)"}`,
                }}
              >
                {isGenerating ? (
                  <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Generating...</>
                ) : filesReady
                  ? "✅ Generated — Click below to send"
                  : "⚙ Generate PDF & Image"}
              </button>

              {/* ── TWO SEND BUTTONS ── */}
              {filesReady && generatedPdf && generatedImage && (
                <div className="space-y-3">
                  <p className="text-xs text-center" style={{ color: "#94a3b8" }}>
                    Choose how to deliver the invitation:
                  </p>

                  <div className="grid grid-cols-2 gap-3">

                    {/* Send as Image */}
                    <div
                      className="rounded-xl overflow-hidden"
                      style={{ border: "1px solid rgba(202,138,4,0.25)" }}
                    >
                      {/* Card header */}
                      <div
                        className="px-4 py-3 flex items-center gap-2"
                        style={{ backgroundColor: "#0a1628" }}
                      >
                        {/* Image icon */}
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold" style={{ color: "#93c5fd" }}>Image File</p>
                          <p className="text-xs truncate" style={{ color: "#475569" }}>{generatedImage.name}</p>
                          <p className="text-xs" style={{ color: "#475569" }}>{(generatedImage.size/1024).toFixed(1)} KB · PNG</p>
                        </div>
                      </div>

                      {/* Download strip */}
                      <button
                        onClick={() => downloadFile("image")}
                        disabled={isBusy}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs transition-all disabled:opacity-40"
                        style={{ backgroundColor: "rgba(59,130,246,0.08)", color: "#60a5fa", borderTop: "1px solid rgba(59,130,246,0.15)" }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download PNG
                      </button>

                      {/* Send button */}
                      <button
                        onClick={() => sendFile("image")}
                        disabled={isBusy}
                        className="w-full py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
                          color: "#eff6ff",
                          borderTop: "1px solid rgba(59,130,246,0.3)",
                        }}
                      >
                        {sendingType === "image" ? (
                          <><div className="w-4 h-4 border-2 border-blue-200 border-t-transparent rounded-full animate-spin" /> Sending...</>
                        ) : (
                          <>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                              <polyline points="21 15 16 10 5 21"/>
                            </svg>
                            Send Image
                          </>
                        )}
                      </button>
                    </div>

                    {/* Send PDF Link */}
                    <div
                      className="rounded-xl overflow-hidden"
                      style={{ border: "1px solid rgba(202,138,4,0.25)" }}
                    >
                      {/* Card header */}
                      <div
                        className="px-4 py-3 flex items-center gap-2"
                        style={{ backgroundColor: "#0a1628" }}
                      >
                        {/* PDF icon */}
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold" style={{ color: "#fca5a5" }}>PDF Link</p>
                          <p className="text-xs truncate" style={{ color: "#475569" }}>{generatedPdf.name}</p>
                          <p className="text-xs" style={{ color: "#475569" }}>{(generatedPdf.size/1024).toFixed(1)} KB · PDF</p>
                        </div>
                      </div>

                      {/* Download strip */}
                      <button
                        onClick={() => downloadFile("pdf")}
                        disabled={isBusy}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs transition-all disabled:opacity-40"
                        style={{ backgroundColor: "rgba(239,68,68,0.06)", color: "#f87171", borderTop: "1px solid rgba(239,68,68,0.12)" }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download PDF
                      </button>

                      {/* Send button */}
                      <button
                        onClick={() => sendFile("pdf")}
                        disabled={isBusy}
                        className="w-full py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: "linear-gradient(135deg, #b91c1c, #991b1b)",
                          color: "#fef2f2",
                          borderTop: "1px solid rgba(239,68,68,0.25)",
                        }}
                      >
                        {sendingType === "pdf" ? (
                          <><div className="w-4 h-4 border-2 border-red-200 border-t-transparent rounded-full animate-spin" /> Sending...</>
                        ) : (
                          <>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                            </svg>
                            Send PDF Link
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                  {/* Info note */}
                  <p className="text-xs text-center" style={{ color: "#475569" }}>
                    Image sends the PNG directly · PDF Link sends the PDF file for download
                  </p>
                </div>
              )}

              {!sourceEvent && !eventLoading && (
                <p className="text-sm text-red-400 text-center">
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