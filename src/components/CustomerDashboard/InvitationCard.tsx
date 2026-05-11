"use client";

import {
  useAddEventMemberMutation,
  useGetEventByIdQuery,
} from "@/redux/features/event/eventSlice";
import jsPDF from "jspdf";
import { useSearchParams } from "next/navigation";
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

interface CardCategory {
  id: string;
  name: string;
  image: string;
}

// Card categories with images
const CARD_CATEGORIES: CardCategory[] = [
  { id: "celebration", name: "Celebration", image: "/images/celebration.png" },
  { id: "relationship", name: "Relationship", image: "/images/relationship.png" },
  { id: "corporate", name: "Corporate", image: "/images/corporat.png" },
  { id: "religious", name: "Religious", image: "/images/religious.png" },
  { id: "social", name: "Social", image: "/images/social.png" },
];

// Helper function to wrap text
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  words.forEach((word, index) => {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && index > 0) {
      ctx.fillText(line, x, currentY);
      line = word + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line, x, currentY);
}

// ─── Generate image with text overlay (IMPROVED TEXT CLARITY) ────────────────
async function generateCardWithOverlay(
  cardImage: string,
  eventData: EventData,
  memberName: string,
): Promise<{ imageFile: File; pdfFile: File }> {
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

      // Optimize canvas size - limit to reasonable dimensions
      const maxWidth = 1200;
      const maxHeight = 1600;
      let width = img.width;
      let height = img.height;

      // Scale down if too large
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw the background image
      ctx.drawImage(img, 0, 0, width, height);

      // Add semi-transparent overlay for better text visibility
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(0, 0, width, height);

      // Add text overlay
      const W = canvas.width;
      const H = canvas.height;

      // Helper function to draw text with strong outline and shadow
      const drawTextWithOutline = (
        text: string,
        x: number,
        y: number,
        fontSize: number,
        fillColor: string,
        outlineColor: string = "#000000",
        outlineWidth: number = 4
      ) => {
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Strong shadow for depth
        ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        
        // Draw outline
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = outlineWidth;
        ctx.lineJoin = "round";
        ctx.strokeText(text, x, y);
        
        // Draw fill
        ctx.fillStyle = fillColor;
        ctx.fillText(text, x, y);
        
        // Reset shadow
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      };

      // Helper function for wrapped text with outline
      const drawWrappedTextWithOutline = (
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        fontSize: number,
        lineHeight: number,
        fillColor: string
      ) => {
        ctx.font = `italic ${fontSize}px Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        const words = text.split(" ");
        let line = "";
        let currentY = y;

        words.forEach((word, index) => {
          const testLine = line + word + " ";
          const metrics = ctx.measureText(testLine);

          if (metrics.width > maxWidth && index > 0) {
            // Draw the line with outline
            ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
            ctx.shadowBlur = 12;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 3;
            ctx.strokeText(line, x, currentY);
            
            ctx.fillStyle = fillColor;
            ctx.fillText(line, x, currentY);
            
            line = word + " ";
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        });
        
        // Draw last line
        if (line) {
          ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
          ctx.shadowBlur = 12;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 3;
          ctx.strokeText(line, x, currentY);
          
          ctx.fillStyle = fillColor;
          ctx.fillText(line, x, currentY);
        }
        
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      };

      let currentY = H * 0.25;

      // Member name - Large and clear
      if (memberName.trim()) {
        drawTextWithOutline(
          `Dear ${memberName},`,
          W / 2,
          currentY,
          Math.floor(W * 0.055),
          "#FFFFFF",
          "#000000",
          5
        );
        currentY += H * 0.08;
      }

      // Event name - Bold and prominent
      drawTextWithOutline(
        eventData.eventName || eventData.title,
        W / 2,
        currentY,
        Math.floor(W * 0.07),
        "#FFD700",
        "#000000",
        6
      );
      currentY += H * 0.1;

      // Description - Readable with good contrast
      if (eventData.description) {
        const maxWidth = W * 0.85;
        drawWrappedTextWithOutline(
          eventData.description,
          W / 2,
          currentY,
          maxWidth,
          Math.floor(W * 0.035),
          W * 0.045,
          "#FFFFFF"
        );
        currentY += H * 0.18;
      } else {
        currentY += H * 0.05;
      }

      // Date - EXTRA CLEAR with bright color and strong outline
      drawTextWithOutline(
        eventData.date,
        W / 2,
        currentY,
        Math.floor(W * 0.045),
        "#FFD700", // Bright gold
        "#000000",
        6 // Thicker outline
      );
      currentY += H * 0.07;

      // Time - EXTRA CLEAR with bright color and strong outline
      drawTextWithOutline(
        eventData.time,
        W / 2,
        currentY,
        Math.floor(W * 0.042),
        "#FFFFFF", // Pure white
        "#000000",
        6 // Thicker outline
      );
      currentY += H * 0.08;

      // Location - EXTRA CLEAR with bright color and strong outline
      drawTextWithOutline(
        eventData.location,
        W / 2,
        currentY,
        Math.floor(W * 0.04),
        "#FFFFFF", // Pure white
        "#000000",
        6 // Thicker outline
      );

      // Generate image file with compression
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to generate image"));
          return;
        }

        const imageFile = new File([blob], `invitation-${Date.now()}.png`, {
          type: "image/png",
        });

        // Generate PDF with optimized size
        const imgData = canvas.toDataURL("image/jpeg", 0.9);
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? "landscape" : "portrait",
          unit: "mm",
          format: "a4",
        });

        // Calculate dimensions to fit A4
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgRatio = canvas.width / canvas.height;
        const pdfRatio = pdfWidth / pdfHeight;

        let finalWidth = pdfWidth;
        let finalHeight = pdfHeight;

        if (imgRatio > pdfRatio) {
          finalHeight = pdfWidth / imgRatio;
        } else {
          finalWidth = pdfHeight * imgRatio;
        }

        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;

        pdf.addImage(imgData, "JPEG", x, y, finalWidth, finalHeight);
        const pdfBlob = pdf.output("blob");
        const pdfFile = new File([pdfBlob], `invitation-${Date.now()}.pdf`, {
          type: "application/pdf",
        });

        resolve({ imageFile, pdfFile });
      }, "image/png"); // Use PNG for better text quality
    };

    img.onerror = () => {
      reject(new Error("Failed to load card image"));
    };

    img.src = cardImage;
  });
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function InvitationCard() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id") || "";

  const [passedEvent, setPassedEvent] = useState<PassedEvent | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardCategory | null>(null);
  const [memberDetails, setMemberDetails] = useState<MemberDetails>({
    name: "",
    email: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleMemberChange = (field: keyof MemberDetails, value: string) =>
    setMemberDetails((prev) => ({ ...prev, [field]: value }));

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
    if (!selectedCard) {
      toast.error("Please select an invitation card");
      return;
    }
    if (!eventId) {
      toast.error("Event ID not found");
      return;
    }

    setIsGenerating(true);

    try {
      // Step 1: Generate files
      toast.loading("Generating invitation card...", { id: "generating" });
      
      const { imageFile, pdfFile } = await generateCardWithOverlay(
        selectedCard.image,
        eventData,
        memberDetails.name
      );

      toast.success("Card generated successfully!", { id: "generating" });

      // Step 2: Send invitation
      toast.loading("Sending invitation...", { id: "sending" });

      await addEventMember({
        eventId,
        memberDetails,
        file: pdfFile,
      }).unwrap();

      toast.success("Invitation sent successfully!", { id: "sending" });
      
      // Reset form
      setMemberDetails({ name: "", email: "" });
      setSelectedCard(null);
      
    } catch (error: any) {
      console.error("Failed to send invitation:", error);
      toast.dismiss("generating");
      toast.dismiss("sending");
      
      const errorMessage = error?.data?.message || error?.message || "Failed to send invitation";
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedCard) {
      toast.error("Please select an invitation card");
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading("Generating files...");

    try {
      const { imageFile, pdfFile } = await generateCardWithOverlay(
        selectedCard.image,
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
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 font-cormorant">
          Send Event Invitation
        </h1>

        {/* Card Category Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-purple-400 mb-4 text-center">
            Select Invitation Card Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CARD_CATEGORIES.map((category) => (
              <div
                key={category.id}
                onClick={() => setSelectedCard(category)}
                className={`cursor-pointer rounded-lg overflow-hidden border-4 transition-all duration-300 ${
                  selectedCard?.id === category.id
                    ? "border-purple-500 shadow-lg shadow-purple-500/50 scale-105"
                    : "border-gray-700 hover:border-purple-400"
                }`}
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="bg-gray-800 p-2 text-center">
                  <p className="text-white font-medium text-sm">
                    {category.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview and Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Preview */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-purple-400 mb-4">
              Card Preview
            </h3>
            {selectedCard ? (
              <div className="relative w-full max-w-md aspect-[3/4] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={selectedCard.image}
                  alt={selectedCard.name}
                  fill
                  className="object-cover"
                />
                {/* Dark overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/30"></div>
                
                {/* Text Overlay Preview */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 space-y-3">
                  {memberDetails.name && (
                    <p 
                      className="text-white text-xl md:text-2xl font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                      style={{
                        textShadow: '3px 3px 6px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.8)',
                        WebkitTextStroke: '1px black'
                      }}
                    >
                      Dear {memberDetails.name},
                    </p>
                  )}
                  <p 
                    className="text-yellow-400 text-2xl md:text-3xl font-bold drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]"
                    style={{
                      textShadow: '4px 4px 8px rgba(0,0,0,0.9), -1px -1px 3px rgba(0,0,0,0.8)',
                      WebkitTextStroke: '1.5px black'
                    }}
                  >
                    {eventData.eventName || eventData.title}
                  </p>
                  {eventData.description && (
                    <p 
                      className="text-white text-sm md:text-base italic drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] max-w-xs"
                      style={{
                        textShadow: '2px 2px 6px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.8)',
                        WebkitTextStroke: '0.5px black'
                      }}
                    >
                      {eventData.description}
                    </p>
                  )}
                  {/* DATE - Extra Clear and Bold */}
                  <p 
                    className="text-yellow-400 text-lg md:text-xl font-bold drop-shadow-[0_3px_8px_rgba(0,0,0,1)]"
                    style={{
                      textShadow: '3px 3px 8px rgba(0,0,0,1), -1px -1px 3px rgba(0,0,0,0.9)',
                      WebkitTextStroke: '1.2px black'
                    }}
                  >
                    {eventData.date}
                  </p>
                  {/* TIME - Extra Clear and Bold */}
                  <p 
                    className="text-white text-base md:text-lg font-bold drop-shadow-[0_3px_8px_rgba(0,0,0,1)]"
                    style={{
                      textShadow: '3px 3px 8px rgba(0,0,0,1), -1px -1px 3px rgba(0,0,0,0.9)',
                      WebkitTextStroke: '1.2px black'
                    }}
                  >
                    {eventData.time}
                  </p>
                  {/* LOCATION - Extra Clear and Bold */}
                  <p 
                    className="text-white text-base md:text-lg font-bold drop-shadow-[0_3px_8px_rgba(0,0,0,1)]"
                    style={{
                      textShadow: '3px 3px 8px rgba(0,0,0,1), -1px -1px 3px rgba(0,0,0,0.9)',
                      WebkitTextStroke: '1.2px black'
                    }}
                  >
                    {eventData.location}
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md aspect-[3/4] rounded-lg bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-600">
                <p className="text-gray-400 text-center px-4">
                  Select a card category above to see preview
                </p>
              </div>
            )}
          </div>

          {/* Right: Form */}
          <div className="bg-[#2C233E] border border-[#67676D] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-purple-400 mb-6 font-cormorant">
              Invitation Details
            </h3>

            {/* Member Details */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Member Name *
                </label>
                <input
                  type="text"
                  value={memberDetails.name}
                  onChange={(e) => handleMemberChange("name", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter member name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Member Email *
                </label>
                <input
                  type="email"
                  value={memberDetails.email}
                  onChange={(e) => handleMemberChange("email", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter member email"
                />
              </div>
            </div>

            {/* Event Info */}
            {sourceEvent && (
              <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                <h4 className="text-sm font-semibold text-purple-400 mb-2">
                  Event Information
                </h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>
                    <span className="font-medium">Title:</span>{" "}
                    {sourceEvent.title}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span> {eventData.date}{" "}
                    at {eventData.time}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {eventData.location}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleDownload}
                disabled={isGenerating || !selectedCard || !sourceEvent}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  "⬇ Download"
                )}
              </button>

              <button
                onClick={handleSendInvitation}
                disabled={
                  isGenerating || isSending || !selectedCard || !sourceEvent
                }
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                {isGenerating || isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  "✉ Send Invitation"
                )}
              </button>
            </div>

            {!sourceEvent && !eventLoading && (
              <p className="mt-4 text-sm text-red-400 text-center">
                ⚠️ No event found. Please go back and select an event.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
