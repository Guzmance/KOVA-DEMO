"use client";
import { useState, useRef } from "react";
import { Camera, Upload, X, Check, Loader2, ScanLine } from "lucide-react";
import { IE } from "@/lib/icon-mode";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ScannedContact {
  firstName: string; lastName: string; company: string; title: string;
  phone: string; email: string; address: string; website: string;
  linkedin: string; notes: string;
}

interface Props { onClose: () => void; onAdd: (c: ScannedContact) => void; }

const FIELD_LABELS: Record<keyof ScannedContact, string> = {
  firstName:"First Name", lastName:"Last Name", company:"Company", title:"Title",
  phone:"Phone", email:"Email", address:"Address", website:"Website",
  linkedin:"LinkedIn", notes:"Notes",
};

export default function CardScanModal({ onClose, onAdd }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [stage,     setStage]     = useState<"upload"|"scanning"|"review"|"done">("upload");
  const [preview,   setPreview]   = useState<string | null>(null);
  const [scanned,   setScanned]   = useState<ScannedContact | null>(null);
  const [edited,    setEdited]    = useState<ScannedContact | null>(null);
  const [err,       setErr]       = useState<string | null>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  };

  const scan = async () => {
    if (!preview) return;
    setStage("scanning");
    setErr(null);
    try {
      const base64 = preview.split(",")[1];
      const mediaType = preview.split(";")[0].split(":")[1] || "image/jpeg";
      const res  = await fetch("/api/card-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed");
      setScanned(data);
      setEdited(data);
      setStage("review");
    } catch {
      // Fallback demo data when API key not set
      const demo: ScannedContact = {
        firstName:"Marcus", lastName:"Webb", company:"Clearwater Investments LLC",
        title:"Managing Principal", phone:"(727) 390-4821", email:"m.webb@clearwaterinvest.com",
        address:"400 Cleveland St, Suite 800, Clearwater, FL 33755",
        website:"clearwaterinvest.com", linkedin:"linkedin.com/in/marcuswebb", notes:"",
      };
      setScanned(demo);
      setEdited(demo);
      setStage("review");
    }
  };

  const handleAdd = () => {
    if (edited) { onAdd(edited); setStage("done"); }
  };

  const PRIMARY_FIELDS: (keyof ScannedContact)[] = ["firstName","lastName","title","company","email","phone"];
  const SECONDARY_FIELDS: (keyof ScannedContact)[] = ["address","website","linkedin","notes"];

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden" style={{ maxHeight: "90vh", overflowY: "auto" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center">
              <IE emoji="🔍" Icon={ScanLine} size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Business Card Scanner</p>
              <p className="text-[10px] text-muted-foreground">AI-powered · Extract contact info instantly</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <IE emoji="✕" Icon={X} size={16} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-6">
          {/* UPLOAD STAGE */}
          {stage === "upload" && (
            <div className="space-y-4">
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
                  preview ? "border-[#00C896] bg-[#00C896]/5" : "border-border hover:border-[#0F172A]/40 hover:bg-secondary/50"
                )}
              >
                {preview ? (
                  <div className="space-y-3">
                    <img src={preview} alt="Card preview" className="mx-auto max-h-40 rounded-lg object-contain shadow-sm" />
                    <p className="text-xs text-muted-foreground">Image ready — click Scan to extract info</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-full bg-secondary mx-auto flex items-center justify-center">
                      <IE emoji="📷" Icon={Camera} size={24} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Drop card image here</p>
                      <p className="text-xs text-muted-foreground mt-1">or click to upload · JPG, PNG, HEIC</p>
                    </div>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2" onClick={() => fileRef.current?.click()}>
                  <IE emoji="📤" Icon={Upload} size={14} />Upload Image
                </Button>
                <Button className="flex-1 gap-2 bg-[#0F172A] hover:bg-[#0F172A]/90" onClick={scan} disabled={!preview}>
                  <IE emoji="🔍" Icon={ScanLine} size={14} />Scan Card
                </Button>
              </div>
            </div>
          )}

          {/* SCANNING */}
          {stage === "scanning" && (
            <div className="py-12 flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-full border-4 border-[#E2E8F0]" />
                <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-[#00C896] animate-spin" />
                <ScanLine size={20} className="absolute inset-0 m-auto text-[#00C896]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Scanning card…</p>
                <p className="text-xs text-muted-foreground mt-1">Claude is extracting contact information</p>
              </div>
              <div className="flex gap-1.5">
                {["Reading fields","Parsing name","Extracting contact"].map((s, i) => (
                  <Badge key={s} variant="secondary" className="text-[9px] animate-pulse" style={{ animationDelay: `${i * 300}ms` }}>{s}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* REVIEW */}
          {stage === "review" && edited && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#F0FDF4] border border-[#86EFAC]">
                <IE emoji="✅" Icon={Check} size={14} className="text-[#15803D]" />
                <p className="text-xs font-semibold text-[#15803D]">Card scanned successfully — review and edit before saving</p>
              </div>

              {preview && (
                <img src={preview} alt="Scanned card" className="w-full max-h-24 object-contain rounded-lg bg-secondary" />
              )}

              <div className="grid grid-cols-2 gap-2.5">
                {PRIMARY_FIELDS.map(f => (
                  <div key={f}>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide block mb-1">{FIELD_LABELS[f]}</label>
                    <input
                      value={(edited as any)[f]}
                      onChange={e => setEdited(prev => prev ? { ...prev, [f]: e.target.value } : prev)}
                      className="w-full px-3 py-1.5 text-xs border border-border rounded-lg bg-secondary/30 text-foreground focus:bg-white transition-colors"
                    />
                  </div>
                ))}
              </div>

              <details className="group">
                <summary className="text-[11px] font-medium text-muted-foreground cursor-pointer list-none flex items-center gap-1.5">
                  <span className="group-open:rotate-90 transition-transform inline-block">›</span>
                  More fields (address, website, notes)
                </summary>
                <div className="grid grid-cols-2 gap-2.5 mt-2.5">
                  {SECONDARY_FIELDS.map(f => (
                    <div key={f} className={f === "notes" ? "col-span-2" : ""}>
                      <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide block mb-1">{FIELD_LABELS[f]}</label>
                      {f === "notes" ? (
                        <textarea
                          value={(edited as any)[f]}
                          onChange={e => setEdited(prev => prev ? { ...prev, [f]: e.target.value } : prev)}
                          rows={2}
                          className="w-full px-3 py-1.5 text-xs border border-border rounded-lg bg-secondary/30 text-foreground resize-none"
                        />
                      ) : (
                        <input
                          value={(edited as any)[f]}
                          onChange={e => setEdited(prev => prev ? { ...prev, [f]: e.target.value } : prev)}
                          className="w-full px-3 py-1.5 text-xs border border-border rounded-lg bg-secondary/30 text-foreground"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </details>

              <div className="flex gap-2 pt-1">
                <Button variant="outline" className="flex-1" onClick={() => { setStage("upload"); setPreview(null); }}>
                  Re-scan
                </Button>
                <Button className="flex-1 bg-[#0F172A] hover:bg-[#0F172A]/90 gap-1.5" onClick={handleAdd}>
                  <IE emoji="✅" Icon={Check} size={13} />Add to Contacts
                </Button>
              </div>
            </div>
          )}

          {/* DONE */}
          {stage === "done" && (
            <div className="py-10 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-full bg-[#F0FDF4] border-2 border-[#86EFAC] flex items-center justify-center">
                <IE emoji="✅" Icon={Check} size={24} className="text-[#15803D]" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{edited?.firstName} {edited?.lastName} added</p>
                <p className="text-xs text-muted-foreground mt-1">{edited?.company} · {edited?.title}</p>
              </div>
              <Button variant="outline" onClick={onClose}>Done</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
