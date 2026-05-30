"use client";
import { useState, useRef } from "react";
import { CONTACTS, COMPANIES, DEALS, ALL_STAGES, ACTIVITIES, PIPELINE_STAGES } from "@/lib/data";
import type { Contact, Company, Deal, View, Modal } from "@/lib/types";

const S = {
  wrap:    { display:"flex" as const, height:"100vh", background:"#F8FAFC", fontFamily:"system-ui,-apple-system,sans-serif", position:"relative" as const, overflow:"hidden" as const },
  sb:      { width:196, flexShrink:0, background:"#0F172A", display:"flex", flexDirection:"column" as const, padding:"10px 8px", gap:2 },
  sbLogo:  { padding:"8px 10px 14px", borderBottom:"1px solid rgba(255,255,255,0.08)", marginBottom:8 },
  sbName:  { fontSize:15, fontWeight:700, color:"#F1F5F9", letterSpacing:"-0.3px" },
  sbSub:   { fontSize:10, color:"#00C896", marginTop:2 },
  main:    { flex:1, display:"flex", flexDirection:"column" as const, overflow:"hidden", minWidth:0 },
  topbar:  { display:"flex", alignItems:"center", gap:8, padding:"9px 14px", background:"#fff", borderBottom:"1px solid #E2E8F0", flexShrink:0, position:"relative" as const },
  content: { flex:1, overflowY:"auto" as const, padding:16 },
  card:    { background:"#fff", border:"1px solid #E2E8F0", borderRadius:10 },
  panel:   { background:"#fff", border:"1px solid #E2E8F0", borderRadius:10, padding:"12px 14px" },
  badge: (s:string) => ({ fontSize:10, padding:"2px 7px", borderRadius:99, fontWeight:600,
    background: s==="new"?"#EFF6FF":s==="contacted"?"#FFFBEB":s==="qualified"?"#F0FDF4":"#F8FAFC",
    color: s==="new"?"#1D4ED8":s==="contacted"?"#B45309":s==="qualified"?"#15803D":"#64748B" }),
  scoreRing: (sc:number|null, sz=34) => ({
    width:sz, height:sz, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:sz>34?13:11, fontWeight:700, flexShrink:0, cursor:"pointer",
    background: sc===null?"#F8FAFC":sc>=80?"#F0FDF4":sc>=60?"#FFFBEB":"#FEF2F2",
    border: `1.5px solid ${sc===null?"#E2E8F0":sc>=80?"#86EFAC":sc>=60?"#FDE68A":"#FCA5A5"}`,
    color: sc===null?"#94A3B8":sc>=80?"#15803D":sc>=60?"#B45309":"#B91C1C",
  }),
};

function Nav({ id, icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:7, border:"none", width:"100%", textAlign:"left", background: active?"rgba(255,255,255,0.1)":"transparent", color: active?"#F1F5F9":"#94A3B8", fontSize:12, fontWeight: active?600:400, cursor:"pointer" }}>
      <span style={{ fontSize:15 }}>{icon}</span>{label}
    </button>
  );
}

export default function CRM() {
  const [view, setView] = useState<View>("dashboard");
  const [selC, setSelC] = useState<Contact|null>(null);
  const [selD, setSelD] = useState<Deal|null>(null);
  const [selCo, setSelCo] = useState<Company|null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [cFilter, setCFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [oTab, setOTab] = useState<"sms"|"email"|"call">("sms");
  const [notifOpen, setNotifOpen] = useState(false);
  const [csvStep, setCsvStep] = useState(0);
  const [lbMin, setLbMin] = useState(60);
  const [lbStatus, setLbStatus] = useState("all");
  const [report, setReport] = useState<string|null>(null);
  const [genLoading, setGenLoading] = useState(false);
  const [scoring, setScoring] = useState<Record<number,any>>({});
  const [scoringId, setScoringId] = useState<number|null>(null);
  const [personalizing, setPersonalizing] = useState(false);
  const [personalizedMsg, setPersonalizedMsg] = useState<Record<number,string>>({});
  const msgRef = useRef<HTMLTextAreaElement>(null);

  const ini = (f:string,l:string) => (f[0]||"")+(l[0]||"");
  const fv = (v:number) => "$"+(v>=1000?(v/1000).toFixed(0)+"K":v);
  const allDeals = Object.values(DEALS).flat();
  const pipeVal = allDeals.reduce((a,d)=>a+d.val,0);
  const wonVal = (DEALS["Closed Won"]||[]).reduce((a,d)=>a+d.val,0);

  const goView = (v:View) => { setView(v); setSelC(null); setSelD(null); setSelCo(null); };

  const scoreContact = async (c: Contact) => {
    setScoringId(c.id);
    try {
      const res = await fetch("/api/score", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ record:c, vertical:"real_estate", tone:"professional", weights:{"Distress Index":30,"Equity Score":25,"Sellability":20,"Days Vacant":15,"Tax Delinquency":10} }) });
      const data = await res.json();
      setScoring(prev => ({...prev, [c.id]: data}));
    } catch {}
    setScoringId(null);
  };

  const generateReport = async () => {
    setGenLoading(true); setReport(null);
    try {
      const res = await fetch("/api/report", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ tenantName:"KOVA Demo", vertical:"Real Estate", leads:CONTACTS, deals:allDeals, tone:"professional" }) });
      const data = await res.json();
      setReport(data.report || "");
    } catch { setReport("Failed to generate — check your API key."); }
    setGenLoading(false);
  };

  const personalizeMsg = async (c: Contact, template: string, channel: string) => {
    setPersonalizing(true);
    try {
      const res = await fetch("/api/personalize", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ lead:c, template, tone:"professional", channel }) });
      const data = await res.json();
      setPersonalizedMsg(prev => ({...prev, [c.id]: data.message || template}));
      if (msgRef.current) msgRef.current.value = data.message || template;
    } catch {}
    setPersonalizing(false);
  };

  const scoreData = selC ? (scoring[selC.id] || null) : null;
  const displayScore = (cid:number) => scoring[cid]?.composite_score ?? null;
  const displayInsight = (cid:number) => scoring[cid]?.ai_insight ?? null;

  // ── VIEWS ──────────────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:14 }}>
        {[["Contacts",CONTACTS.length,"+3 this week","#EFF6FF","#1D4ED8"],["Open Deals",allDeals.length,"+2 this week","#F0FDF4","#15803D"],["Pipeline","$"+Math.round(pipeVal/1000)+"K","+$84K","#FFFBEB","#B45309"],["Closed Won","$"+Math.round(wonVal/1000)+"K","On track","#F5F3FF","#7C3AED"]].map(([l,v,d,bg,c])=>(
          <div key={l as string} style={{ background:bg as string, borderRadius:10, padding:"11px 13px" }}>
            <div style={{ fontSize:11, color:"#64748B", marginBottom:2 }}>{l}</div>
            <div style={{ fontSize:20, fontWeight:700, color:c as string }}>{v}</div>
            <div style={{ fontSize:10, color:"#94A3B8", marginTop:2 }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <div style={S.panel}>
          <div style={{ fontSize:10, fontWeight:600, color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:10 }}>Recent Activity</div>
          {ACTIVITIES.slice(0,4).map((a,i)=>(
            <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", padding:"6px 0", borderBottom: i<3?"1px solid #F1F5F9":"none" }}>
              <div style={{ width:24, height:24, borderRadius:"50%", background:a.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, flexShrink:0 }}>{a.icon}</div>
              <div><div style={{ fontSize:11, color:"#1E293B", lineHeight:1.4 }}><strong>{a.contact}</strong> — {a.text.substring(0,50)}…</div><div style={{ fontSize:10, color:"#94A3B8", marginTop:1 }}>{a.time}</div></div>
            </div>
          ))}
        </div>
        <div style={S.panel}>
          <div style={{ fontSize:10, fontWeight:600, color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:10 }}>Top Leads by Score</div>
          {CONTACTS.sort((a,b)=>b.score-a.score).slice(0,5).map(c=>(
            <div key={c.id} onClick={()=>{setSelC(c);setView("contacts");}} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderBottom:"1px solid #F1F5F9", cursor:"pointer" }}>
              <div style={{ width:26, height:26, borderRadius:"50%", background:"#EFF6FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#1D4ED8", flexShrink:0 }}>{ini(c.fn,c.ln)}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, color:"#1E293B" }}>{c.fn} {c.ln}</div>
                <div style={{ fontSize:10, color:"#64748B", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.co}</div>
              </div>
              <div onClick={e=>{e.stopPropagation();setModalData(c);setModal("score");}} style={S.scoreRing(displayScore(c.id)||c.score)} title="Click for AI breakdown">
                {scoringId===c.id ? "…" : (displayScore(c.id) ?? c.score)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const contacts = CONTACTS.filter(c=> (cFilter==="all"||c.status===cFilter) && (!search || `${c.fn} ${c.ln} ${c.co}`.toLowerCase().includes(search.toLowerCase())));
  const renderContacts = () => selC ? renderContactDetail() : (
    <div>
      <div style={{ display:"flex", gap:5, marginBottom:10, flexWrap:"wrap" as const, alignItems:"center" }}>
        {["all","new","contacted","qualified","customer"].map(f=>(
          <button key={f} onClick={()=>setCFilter(f)} style={{ fontSize:10, padding:"3px 9px", borderRadius:99, border:"1px solid", borderColor: cFilter===f?"#1D4ED8":"#E2E8F0", background: cFilter===f?"#EFF6FF":"#fff", color: cFilter===f?"#1D4ED8":"#64748B", cursor:"pointer" }}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>
        ))}
        <span style={{ fontSize:10, color:"#94A3B8", marginLeft:4 }}>{contacts.length} contacts</span>
      </div>
      {contacts.map(c=>(
        <div key={c.id} onClick={()=>setSelC(c)} style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 4px", borderBottom:"1px solid #F1F5F9", cursor:"pointer" }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"#EFF6FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#1D4ED8", flexShrink:0 }}>{ini(c.fn,c.ln)}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:"#1E293B" }}>{c.fn} {c.ln}</div>
            <div style={{ fontSize:11, color:"#64748B", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.co} · {c.city}</div>
            {displayInsight(c.id) && <div style={{ fontSize:10, color:"#94A3B8", marginTop:1, fontStyle:"italic", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{displayInsight(c.id)?.substring(0,60)}…</div>}
          </div>
          <div style={{ display:"flex", gap:5, alignItems:"center" }}>
            <span style={S.badge(c.status)}>{c.status}</span>
            <div onClick={e=>{e.stopPropagation();scoreContact(c);}} style={S.scoreRing(displayScore(c.id))} title="Click to score with Claude AI">
              {scoringId===c.id ? <span style={{ fontSize:9 }}>AI…</span> : (displayScore(c.id) ?? c.score)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const defaultMsg = (c:Contact) => oTab==="sms" ? `Hi ${c.fn}, following up on our last conversation — do you have 10 minutes this week?` : oTab==="email" ? `Hi ${c.fn},\n\nWanted to follow up and share a few new listings that match your criteria.\n\nBest,` : "";
  const renderContactDetail = () => selC && (
    <div>
      <button onClick={()=>setSelC(null)} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#64748B", background:"none", border:"none", marginBottom:12 }}>← Contacts</button>
      <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:14 }}>
        <div style={{ width:46, height:46, borderRadius:"50%", background:"#EFF6FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#1D4ED8", flexShrink:0 }}>{ini(selC.fn,selC.ln)}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" as const }}>
            <span style={{ fontSize:16, fontWeight:700, color:"#0F172A" }}>{selC.fn} {selC.ln}</span>
            <span style={S.badge(selC.status)}>{selC.status}</span>
            <div onClick={()=>{setModalData(selC);setModal("score");}} style={S.scoreRing(displayScore(selC.id)||selC.score,40)} title="Click for full AI breakdown">
              {scoringId===selC.id ? "AI…" : (displayScore(selC.id) ?? selC.score)}
            </div>
          </div>
          <div style={{ fontSize:12, color:"#64748B", marginTop:2 }}>{selC.role} · {selC.co}</div>
          <div style={{ fontSize:11, color:"#94A3B8", marginTop:4, fontStyle:"italic" }}>{scoreData?.ai_insight || selC.notes}</div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, marginBottom:12 }}>
        {[["Email",selC.email],["Phone",selC.phone],["Location",selC.city],["Open Deals",selC.deals]].map(([l,v])=>(
          <div key={l as string} style={{ background:"#F8FAFC", borderRadius:7, padding:"7px 10px" }}>
            <div style={{ fontSize:9, color:"#94A3B8", textTransform:"uppercase" as const, letterSpacing:"0.05em", marginBottom:2 }}>{l}</div>
            <div style={{ fontSize:12, color:"#0F172A" }}>{String(v)}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <div style={S.panel}>
          <div style={{ fontSize:10, fontWeight:600, color:"#94A3B8", textTransform:"uppercase" as const, letterSpacing:"0.05em", marginBottom:8 }}>Outreach</div>
          <div style={{ display:"flex", gap:2, marginBottom:8, background:"#F1F5F9", borderRadius:7, padding:3 }}>
            {(["sms","email","call"] as const).map(t=>(
              <button key={t} onClick={()=>setOTab(t)} style={{ flex:1, padding:"5px", borderRadius:5, border:"none", background: oTab===t?"#fff":"transparent", color: oTab===t?"#0F172A":"#64748B", fontSize:11, fontWeight: oTab===t?600:400, cursor:"pointer" }}>{t==="sms"?"💬 SMS":t==="email"?"✉️ Email":"📞 Log Call"}</button>
            ))}
          </div>
          {oTab!=="call" ? (
            <>
              <textarea ref={msgRef} defaultValue={personalizedMsg[selC.id]||defaultMsg(selC)} rows={3} style={{ width:"100%", border:"1px solid #E2E8F0", borderRadius:7, padding:"7px 9px", fontSize:11, color:"#0F172A", resize:"none", background:"#F8FAFC" }} />
              <div style={{ display:"flex", gap:6, marginTop:6 }}>
                <button onClick={()=>alert(`${oTab==="sms"?"SMS":"Email"} sent to ${selC.fn}!`)} style={{ flex:1, padding:"7px", background:"#0F172A", color:"#fff", border:"none", borderRadius:6, fontSize:11, fontWeight:600, cursor:"pointer" }}>Send {oTab==="sms"?"SMS":"Email"}</button>
                <button onClick={()=>personalizeMsg(selC, msgRef.current?.value||defaultMsg(selC), oTab)} disabled={personalizing} style={{ flex:1, padding:"7px", background:"#EFF6FF", color:"#1D4ED8", border:"1px solid #BFDBFE", borderRadius:6, fontSize:11, fontWeight:600, cursor:"pointer" }}>
                  {personalizing ? "AI writing…" : "✨ AI Personalize"}
                </button>
              </div>
            </>
          ) : (
            <>
              <textarea rows={3} placeholder="Log call notes…" style={{ width:"100%", border:"1px solid #E2E8F0", borderRadius:7, padding:"7px 9px", fontSize:11, resize:"none", background:"#F8FAFC" }} />
              <button onClick={()=>alert("Call logged!")} style={{ width:"100%", marginTop:6, padding:"7px", background:"#0F172A", color:"#fff", border:"none", borderRadius:6, fontSize:11, fontWeight:600, cursor:"pointer" }}>Log Call</button>
            </>
          )}
        </div>
        <div style={S.panel}>
          <div style={{ fontSize:10, fontWeight:600, color:"#94A3B8", textTransform:"uppercase" as const, letterSpacing:"0.05em", marginBottom:8 }}>Timeline</div>
          {ACTIVITIES.filter(a=>a.contact.includes(selC.fn)).concat(ACTIVITIES.slice(0,2)).slice(0,5).map((a,i)=>(
            <div key={i} style={{ display:"flex", gap:7, alignItems:"flex-start", padding:"5px 0", borderBottom: i<4?"1px solid #F1F5F9":"none" }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background:a.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, flexShrink:0 }}>{a.icon}</div>
              <div><div style={{ fontSize:11, color:"#0F172A", lineHeight:1.4 }}>{a.text}</div><div style={{ fontSize:10, color:"#94A3B8" }}>{a.time}</div></div>
            </div>
          ))}
        </div>
      </div>
      {scoreData?.recommended_action && (
        <div style={{ marginTop:10, padding:"10px 12px", background:"#F0FDF4", border:"1px solid #86EFAC", borderRadius:8 }}>
          <div style={{ fontSize:10, color:"#15803D", fontWeight:700, marginBottom:2 }}>AI RECOMMENDED ACTION</div>
          <div style={{ fontSize:12, color:"#0F172A" }}>{scoreData.recommended_action}</div>
        </div>
      )}
    </div>
  );

  const renderCompanies = () => selCo ? (
    <div>
      <button onClick={()=>setSelCo(null)} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#64748B", background:"none", border:"none", marginBottom:12 }}>← Companies</button>
      <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:14 }}>
        <div style={{ width:46, height:46, borderRadius:8, background:"#F1F5F9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, flexShrink:0 }}>{selCo.name[0]}</div>
        <div><div style={{ fontSize:16, fontWeight:700, color:"#0F172A" }}>{selCo.name}</div><div style={{ fontSize:12, color:"#64748B", marginTop:2 }}>{selCo.industry} · {selCo.city}</div></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, marginBottom:12 }}>
        {[["Revenue",selCo.revenue],["Deals",selCo.deals+" open"],["Contacts",selCo.contacts],["Client Since",selCo.since]].map(([l,v])=>(
          <div key={l as string} style={{ background:"#F8FAFC", borderRadius:7, padding:"7px 10px" }}>
            <div style={{ fontSize:9, color:"#94A3B8", textTransform:"uppercase" as const, letterSpacing:"0.05em", marginBottom:2 }}>{l}</div>
            <div style={{ fontSize:12, color:"#0F172A", fontWeight:600 }}>{String(v)}</div>
          </div>
        ))}
      </div>
      <div style={S.panel}>
        <div style={{ fontSize:10, fontWeight:600, color:"#94A3B8", textTransform:"uppercase" as const, letterSpacing:"0.05em", marginBottom:8 }}>Linked Contacts</div>
        {CONTACTS.filter(c=>c.co===selCo.name).map(c=>(
          <div key={c.id} onClick={()=>{setSelC(c);setSelCo(null);}} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 0", borderBottom:"1px solid #F1F5F9", cursor:"pointer" }}>
            <div style={{ width:26, height:26, borderRadius:"50%", background:"#EFF6FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#1D4ED8", flexShrink:0 }}>{ini(c.fn,c.ln)}</div>
            <div style={{ flex:1 }}><div style={{ fontSize:12, fontWeight:600, color:"#1E293B" }}>{c.fn} {c.ln}</div><div style={{ fontSize:10, color:"#64748B" }}>{c.role}</div></div>
            <span style={S.badge(c.status)}>{c.status}</span>
            <div style={S.scoreRing(c.score)}>{c.score}</div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:9 }}>
      {COMPANIES.map(co=>(
        <div key={co.id} onClick={()=>setSelCo(co)} style={{ ...S.card, padding:12, cursor:"pointer" }}>
          <div style={{ width:32, height:32, borderRadius:7, background:"#F1F5F9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, marginBottom:7 }}>{co.name[0]}</div>
          <div style={{ fontSize:12, fontWeight:600, color:"#0F172A" }}>{co.name}</div>
          <div style={{ fontSize:10, color:"#64748B", marginTop:1 }}>{co.industry}</div>
          <div style={{ display:"flex", gap:9, marginTop:8, paddingTop:8, borderTop:"1px solid #F1F5F9" }}>
            {[["deals",co.deals],["contacts",co.contacts]].map(([l,v])=>(
              <div key={l as string} style={{ fontSize:10, color:"#64748B" }}><strong style={{ display:"block", fontSize:13, color:"#0F172A" }}>{v}</strong>{l}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDeals = () => selD ? (
    <div>
      <button onClick={()=>setSelD(null)} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#64748B", background:"none", border:"none", marginBottom:12 }}>← Pipeline</button>
      <div style={{ display:"flex", gap:12, marginBottom:14 }}>
        <div style={{ width:46, height:46, borderRadius:8, background:"#F0FDF4", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>📊</div>
        <div><div style={{ display:"flex", alignItems:"center", gap:10 }}><span style={{ fontSize:16, fontWeight:700, color:"#0F172A" }}>{selD.title}</span><span style={{ fontSize:14, fontWeight:700, color:"#15803D" }}>{fv(selD.val)}</span></div><div style={{ fontSize:12, color:"#64748B", marginTop:2 }}>{selD.co} · {selD.contact}</div></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, marginBottom:12 }}>
        {[["Stage",selD.stage_hist[selD.stage_hist.length-1]],["Probability",selD.prob+"%"],["Close Date",selD.close],["Value",fv(selD.val)]].map(([l,v])=>(
          <div key={l as string} style={{ background:"#F8FAFC", borderRadius:7, padding:"7px 10px" }}>
            <div style={{ fontSize:9, color:"#94A3B8", textTransform:"uppercase" as const, letterSpacing:"0.05em", marginBottom:2 }}>{l}</div>
            <div style={{ fontSize:12, fontWeight:600, color:"#0F172A" }}>{String(v)}</div>
          </div>
        ))}
      </div>
      <div style={S.panel}>
        <div style={{ fontSize:10, fontWeight:600, color:"#94A3B8", textTransform:"uppercase" as const, letterSpacing:"0.05em", marginBottom:10 }}>Stage History</div>
        <div style={{ display:"flex", alignItems:"flex-start", gap:0, overflowX:"auto" as const }}>
          {ALL_STAGES.map((st,i)=>{
            const idx = selD.stage_hist[selD.stage_hist.length-1];
            const stageIdx = ALL_STAGES.indexOf(idx);
            const done = i < stageIdx; const curr = i === stageIdx;
            return (
              <div key={st} style={{ display:"flex", alignItems:"center" }}>
                <div style={{ display:"flex", flexDirection:"column" as const, alignItems:"center", gap:3 }}>
                  <div style={{ width:24, height:24, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, background: done?"#F0FDF4":curr?"#EFF6FF":"#F8FAFC", border:`1.5px solid ${done?"#86EFAC":curr?"#93C5FD":"#E2E8F0"}`, color: done?"#15803D":curr?"#1D4ED8":"#94A3B8", fontWeight:700 }}>
                    {done?"✓":i+1}
                  </div>
                  <div style={{ fontSize:8, color:"#94A3B8", textAlign:"center" as const, maxWidth:48, whiteSpace:"nowrap" as const }}>{st.replace(" ","\n")}</div>
                </div>
                {i<ALL_STAGES.length-1 && <div style={{ width:20, height:1, background: done?"#86EFAC":"#E2E8F0", marginBottom:14 }} />}
              </div>
            );
          })}
        </div>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" as const, marginTop:12 }}>
          {ALL_STAGES.filter(s=>s!==selD.stage_hist[selD.stage_hist.length-1]).map(s=>(
            <button key={s} onClick={()=>alert(`Deal moved to "${s}"`)} style={{ fontSize:11, padding:"4px 10px", border:"1px solid #E2E8F0", borderRadius:6, background:"#F8FAFC", cursor:"pointer" }}>Move to {s}</button>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div style={{ display:"flex", gap:9, overflowX:"auto" as const, height:"calc(100vh - 130px)" }}>
      {Object.entries(DEALS).map(([stage, deals])=>(
        <div key={stage} style={{ flex:"0 0 150px", display:"flex", flexDirection:"column" as const, gap:6 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:10, fontWeight:600, color:"#64748B", padding:"3px 0" }}>
            <span>{stage}</span>
            <span style={{ background:"#F1F5F9", borderRadius:99, fontSize:9, padding:"1px 5px" }}>{deals.length}</span>
          </div>
          {deals.map(d=>(
            <div key={d.id} onClick={()=>setSelD(d)} style={{ ...S.card, padding:"9px 10px", cursor:"pointer" }}>
              <div style={{ fontSize:11, fontWeight:600, color:"#0F172A", marginBottom:2, lineHeight:1.3 }}>{d.title}</div>
              <div style={{ fontSize:11, color:"#15803D", fontWeight:600 }}>{fv(d.val)}</div>
              <div style={{ fontSize:10, color:"#94A3B8", marginTop:2 }}>{d.co}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderLists = () => {
    const matches = CONTACTS.filter(c=>c.score>=lbMin&&(lbStatus==="all"||c.status===lbStatus));
    return (
      <div style={{ display:"grid", gridTemplateColumns:"190px 1fr", gap:12, height:"calc(100vh-130px)" }}>
        <div style={{ display:"flex", flexDirection:"column" as const, gap:9 }}>
          <div style={S.panel}>
            <div style={{ fontSize:10, fontWeight:600, color:"#94A3B8", textTransform:"uppercase" as const, letterSpacing:"0.05em", marginBottom:10 }}>Filters</div>
            <div style={{ marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#64748B", marginBottom:4 }}><span>Min Score</span><span style={{ fontWeight:700, color:"#0F172A" }}>{lbMin}</span></div>
              <input type="range" min={0} max={100} value={lbMin} onChange={e=>setLbMin(+e.target.value)} style={{ width:"100%" }} />
            </div>
            <div>
              <div style={{ fontSize:10, color:"#64748B", marginBottom:5 }}>Status</div>
              {["all","new","contacted","qualified","customer"].map(s=>(
                <label key={s} style={{ display:"flex", gap:5, fontSize:11, cursor:"pointer", marginBottom:4, alignItems:"center" }}>
                  <input type="radio" name="lbs" checked={lbStatus===s} onChange={()=>setLbStatus(s)} />
                  {s.charAt(0).toUpperCase()+s.slice(1)}
                </label>
              ))}
            </div>
          </div>
          {["High-Score Miami Leads","Q3 Distressed Portfolio","Qualified Buyers — Tampa"].map(l=>(
            <div key={l} style={{ fontSize:11, padding:"7px 10px", background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:7, cursor:"pointer", color:"#0F172A" }}>{l}</div>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 12px", background:"#F8FAFC", borderBottom:"1px solid #E2E8F0", borderRadius:"10px 10px 0 0", alignItems:"center" }}>
            <span style={{ fontSize:11, color:"#64748B" }}>{matches.length} matching leads</span>
            <button onClick={()=>alert("List saved!")} style={{ fontSize:11, padding:"4px 12px", background:"#0F172A", color:"#fff", border:"none", borderRadius:6, cursor:"pointer", fontWeight:600 }}>💾 Save List</button>
          </div>
          <div style={{ overflow:"auto", maxHeight:500 }}>
            {matches.sort((a,b)=>b.score-a.score).map(c=>(
              <div key={c.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderBottom:"1px solid #F8FAFC" }}>
                <div style={{ width:26, height:26, borderRadius:"50%", background:"#EFF6FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#1D4ED8", flexShrink:0 }}>{ini(c.fn,c.ln)}</div>
                <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:12, fontWeight:600, color:"#1E293B" }}>{c.fn} {c.ln}</div><div style={{ fontSize:10, color:"#64748B" }}>{c.co}</div></div>
                <span style={S.badge(c.status)}>{c.status}</span>
                <div onClick={()=>{setModalData(c);setModal("score");}} style={S.scoreRing(c.score)}>{c.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderReports = () => (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, padding:"12px 16px", background:"linear-gradient(135deg,#0F172A,#1E293B)", borderRadius:10 }}>
        <div><div style={{ fontSize:13, fontWeight:700, color:"#F1F5F9" }}>Weekly Intelligence Briefing</div><div style={{ fontSize:11, color:"#64748B", marginTop:2 }}>Powered by Claude AI · Real Estate Vertical</div></div>
        <button onClick={generateReport} disabled={genLoading} style={{ padding:"8px 18px", background: genLoading?"#334155":"#00C896", color: genLoading?"#94A3B8":"#000", border:"none", borderRadius:7, fontSize:12, fontWeight:700, cursor:"pointer" }}>
          {genLoading ? "Claude is writing…" : "⚡ Generate Report"}
        </button>
      </div>
      {report ? (
        <div style={S.panel}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <span style={{ fontSize:10, fontWeight:700, color:"#94A3B8", textTransform:"uppercase" as const, letterSpacing:"0.05em" }}>AI GENERATED REPORT</span>
            <span style={{ fontSize:10, background:"#F0FDF4", color:"#15803D", padding:"2px 8px", borderRadius:99, fontWeight:600 }}>Claude API</span>
          </div>
          <div style={{ fontSize:12, color:"#1E293B", lineHeight:1.8, whiteSpace:"pre-wrap" as const }}>{report}</div>
        </div>
      ) : (
        <div style={{ ...S.panel, textAlign:"center" as const, padding:"40px", color:"#94A3B8" }}>
          <div style={{ fontSize:32, marginBottom:12 }}>📊</div>
          <div style={{ fontSize:14, fontWeight:600, color:"#64748B", marginBottom:4 }}>No report yet</div>
          <div style={{ fontSize:12 }}>Click "Generate Report" to have Claude write your weekly intelligence briefing live</div>
        </div>
      )}
    </div>
  );

  const renderActivity = () => (
    <div>
      {ACTIVITIES.map((a,i)=>(
        <div key={i} style={{ display:"flex", gap:9, alignItems:"flex-start", padding:"9px 0", borderBottom:"1px solid #F1F5F9" }}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:a.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>{a.icon}</div>
          <div style={{ flex:1 }}><div style={{ fontSize:12, color:"#0F172A", lineHeight:1.5 }}><strong>{a.contact}</strong> — {a.text}</div><div style={{ fontSize:10, color:"#94A3B8", marginTop:2 }}>{a.time}</div></div>
        </div>
      ))}
    </div>
  );

  const renderPipeline = () => (
    <div>
      <div style={{ fontSize:13, fontWeight:700, color:"#0F172A", marginBottom:14 }}>Data Pipeline — 9 Stages</div>
      <div style={{ display:"flex", flexDirection:"column" as const, gap:8 }}>
        {PIPELINE_STAGES.map((stage, i) => {
          const pct = [100,100,95,100,88,82,75,70,65][i];
          const active = i === 4;
          return (
            <div key={stage.id} style={{ ...S.card, padding:"12px 14px", borderLeft:`3px solid ${active?"#00C896":pct===100?"#86EFAC":"#E2E8F0"}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:20 }}>{stage.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:"#0F172A" }}>{stage.label}</span>
                      {active && <span style={{ fontSize:9, background:"#F0FDF4", color:"#15803D", padding:"1px 7px", borderRadius:99, fontWeight:700 }}>ACTIVE</span>}
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, color: pct>=90?"#15803D":pct>=70?"#B45309":"#94A3B8" }}>{pct}%</span>
                  </div>
                  <div style={{ height:5, background:"#F1F5F9", borderRadius:99, overflow:"hidden" }}>
                    <div style={{ width:`${pct}%`, height:"100%", background: active?"#00C896":pct===100?"#86EFAC":"#93C5FD", borderRadius:99, transition:"width 0.5s" }} />
                  </div>
                </div>
              </div>
              <div style={{ fontSize:11, color:"#94A3B8", marginTop:5, marginLeft:30 }}>{stage.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── SCORE MODAL ──────────────────────────────────────────────────────────────
  const renderScoreModal = () => {
    const c = modalData as Contact;
    const live = scoring[c?.id];
    const breakdown = live?.score_breakdown ? Object.entries(live.score_breakdown) : c?.breakdown?.map(b=>[b.n,b.s]) || [];
    const score = live?.composite_score ?? c?.score;
    const insight = live?.ai_insight ?? c?.insight;
    const action = live?.recommended_action ?? c?.action;
    return c ? (
      <div style={{ padding:"0 4px" }}>
        <div style={{ textAlign:"center" as const, marginBottom:16 }}>
          <div style={{ ...S.scoreRing(score, 72), margin:"0 auto 10px", fontSize:22, fontWeight:800 }}>{score}</div>
          <div style={{ fontSize:14, fontWeight:700, color:"#0F172A" }}>{c.fn} {c.ln}</div>
          <div style={{ fontSize:11, color:"#64748B" }}>{c.co}</div>
          {live && <span style={{ fontSize:10, background:"#F0FDF4", color:"#15803D", padding:"2px 8px", borderRadius:99, fontWeight:700, marginTop:5, display:"inline-block" }}>Live from Claude API</span>}
        </div>
        {breakdown.map(([name,val]:any,i:number)=>(
          <div key={i} style={{ marginBottom:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#0F172A", marginBottom:3 }}><span>{name}</span><span style={{ fontWeight:700 }}>{val}</span></div>
            <div style={{ height:4, background:"#F1F5F9", borderRadius:99, overflow:"hidden" }}><div style={{ width:`${val}%`, height:"100%", background: val>=80?"#86EFAC":val>=60?"#FDE68A":"#FCA5A5", borderRadius:99 }} /></div>
          </div>
        ))}
        {insight && <div style={{ marginTop:12, padding:"10px 12px", background:"#F8FAFC", borderRadius:8 }}><div style={{ fontSize:9, color:"#94A3B8", textTransform:"uppercase" as const, marginBottom:4 }}>Claude AI Insight</div><div style={{ fontSize:12, color:"#0F172A", lineHeight:1.6 }}>{insight}</div></div>}
        {action && <div style={{ marginTop:8, padding:"10px 12px", background:"#EFF6FF", borderRadius:8 }}><div style={{ fontSize:9, color:"#1D4ED8", textTransform:"uppercase" as const, marginBottom:4 }}>Recommended Action</div><div style={{ fontSize:12, color:"#0F172A", fontWeight:600 }}>{action}</div></div>}
        <button onClick={()=>scoreContact(c)} disabled={scoringId===c.id} style={{ width:"100%", marginTop:12, padding:"9px", background: scoringId===c.id?"#F1F5F9":"#0F172A", color: scoringId===c.id?"#94A3B8":"#fff", border:"none", borderRadius:7, fontSize:12, fontWeight:700, cursor:"pointer" }}>
          {scoringId===c.id ? "Scoring with Claude…" : "🧠 Score Live with Claude API"}
        </button>
      </div>
    ) : null;
  };

  const renderCSV = () => (
    <div>
      <div style={{ display:"flex", justifyContent:"center", gap:5, marginBottom:14 }}>
        {[0,1,2].map(i=><div key={i} style={{ width:7, height:7, borderRadius:"50%", background: i===csvStep?"#0F172A":"#E2E8F0" }} />)}
      </div>
      {csvStep===0 && <div onClick={()=>setCsvStep(1)} style={{ border:"1.5px dashed #CBD5E1", borderRadius:10, padding:"28px", textAlign:"center" as const, cursor:"pointer", background:"#F8FAFC" }}>
        <div style={{ fontSize:32, marginBottom:8 }}>📁</div>
        <div style={{ fontSize:13, fontWeight:600, color:"#0F172A", marginBottom:3 }}>Drop CSV here or click to upload</div>
        <div style={{ fontSize:11, color:"#94A3B8" }}>Supports .csv, .xlsx · Any column format</div>
      </div>}
      {csvStep===1 && <>
        <div style={{ fontSize:12, fontWeight:600, color:"#0F172A", marginBottom:8 }}>Scrubbing preview — 5 of 247 records</div>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:10 }}>
          <thead><tr>{["Name","Phone (raw)","Phone (clean)","Quality"].map(h=><th key={h} style={{ padding:"4px 7px", background:"#F8FAFC", textAlign:"left" as const, color:"#64748B", borderBottom:"1px solid #E2E8F0" }}>{h}</th>)}</tr></thead>
          <tbody>{[["Sarah Mitchell","3055550142","+1 (305) 555-0142","94%"],["james thornton","813.555.0291","+1 (813) 555-0291","98%"],["MARIA DELGADO","(786)5550384","+1 (786) 555-0384","91%"],["R. Chen","9045550517","+1 (904) 555-0517","88%"],["Angela Brooks","","— No phone","42%"]].map((r,i)=><tr key={i}>{r.map((v,j)=><td key={j} style={{ padding:"4px 7px", borderBottom:"1px solid #F8FAFC", color: j===3?(v==="42%"?"#B91C1C":"#15803D"):j===2?"#15803D":"#0F172A" }}>{v||"—"}</td>)}</tr>)}</tbody>
        </table>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:7, marginTop:10 }}>
          {[["247","Total"],["229","Clean"],["14","Dupes"],["4","Invalid"]].map(([v,l])=>(
            <div key={l} style={{ background:"#F8FAFC", borderRadius:7, padding:"8px", textAlign:"center" as const }}><div style={{ fontSize:17, fontWeight:700, color:"#0F172A" }}>{v}</div><div style={{ fontSize:9, color:"#94A3B8" }}>{l}</div></div>
          ))}
        </div>
        <button onClick={()=>setCsvStep(2)} style={{ width:"100%", marginTop:12, padding:"9px", background:"#0F172A", color:"#fff", border:"none", borderRadius:7, fontSize:12, fontWeight:700, cursor:"pointer" }}>Import 229 Records</button>
      </>}
      {csvStep===2 && <div style={{ textAlign:"center" as const, padding:"20px" }}>
        <div style={{ fontSize:40, marginBottom:10 }}>✅</div>
        <div style={{ fontSize:15, fontWeight:700, color:"#0F172A", marginBottom:5 }}>229 contacts imported</div>
        <div style={{ fontSize:12, color:"#64748B", marginBottom:16 }}>Scrubbing complete · 14 duplicates removed · AI scoring queued</div>
        <button onClick={()=>{setModal(null);setCsvStep(0);}} style={{ padding:"9px 24px", background:"#0F172A", color:"#fff", border:"none", borderRadius:7, fontSize:12, fontWeight:700, cursor:"pointer" }}>View Contacts</button>
      </div>}
    </div>
  );

  const NAV = [["dashboard","📊","Dashboard"],["contacts","👥","Contacts"],["companies","🏢","Companies"],["deals","📈","Pipeline"],["lists","📋","Lists"],["reports","📰","Reports"],["activity","⚡","Activity"]];

  const titles: Record<string,string> = { dashboard:"Dashboard", contacts:"Contacts", companies:"Companies", deals:"Pipeline", lists:"List Builder", reports:"Reports", activity:"Activity" };

  return (
    <div style={S.wrap}>
      {/* Sidebar */}
      <aside style={S.sb}>
        <div style={S.sbLogo}>
          <div style={S.sbName}>KOVA</div>
          <div style={S.sbSub}>Real Estate</div>
        </div>
        {NAV.map(([id,icon,label])=><Nav key={id} id={id} icon={icon} label={label} active={view===id&&!selC&&!selD&&!selCo} onClick={()=>goView(id as View)} />)}
        <div style={{ flex:1 }} />
        <Nav id="onboard" icon="⚙️" label="Settings" active={false} onClick={()=>window.open("/onboard","_self")} />
      </aside>

      {/* Main */}
      <div style={S.main}>
        {/* Topbar */}
        <div style={S.topbar}>
          <span style={{ fontSize:13, fontWeight:600, color:"#0F172A", flex:1 }}>
            {selC ? `${selC.fn} ${selC.ln}` : selD ? selD.title : selCo ? selCo.name : titles[view]}
          </span>
          <div style={{ position:"relative" as const }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{ padding:"5px 9px 5px 28px", fontSize:12, border:"1px solid #E2E8F0", borderRadius:7, background:"#F8FAFC", width:150, color:"#0F172A" }} />
            <span style={{ position:"absolute" as const, left:9, top:"50%", transform:"translateY(-50%)", fontSize:12, color:"#94A3B8", pointerEvents:"none" as const }}>🔍</span>
          </div>
          {["contacts","deals","lists","reports"].includes(view) && !selC && !selD && !selCo && (
            <button onClick={()=>setModal("create")} style={{ fontSize:12, padding:"5px 12px", background:"#0F172A", color:"#fff", border:"none", borderRadius:7, display:"flex", alignItems:"center", gap:4, fontWeight:600 }}>
              <span>+</span> Add
            </button>
          )}
          <button onClick={()=>setCsvStep(0)||setModal("csv")} style={{ fontSize:12, padding:"5px 12px", background:"#F8FAFC", color:"#64748B", border:"1px solid #E2E8F0", borderRadius:7, fontWeight:600 }}>↑ Import</button>
          <div style={{ position:"relative" as const }}>
            <button onClick={()=>setNotifOpen(!notifOpen)} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", padding:"4px", color:"#64748B", position:"relative" as const }}>
              🔔<span style={{ position:"absolute" as const, top:2, right:2, width:7, height:7, background:"#EF4444", borderRadius:"50%", border:"1.5px solid #fff" }} />
            </button>
            {notifOpen && (
              <div style={{ position:"absolute" as const, right:0, top:"100%", marginTop:4, width:280, background:"#fff", border:"1px solid #E2E8F0", borderRadius:10, padding:12, zIndex:99, boxShadow:"0 4px 16px rgba(0,0,0,0.1)" }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#0F172A", marginBottom:8, display:"flex", justifyContent:"space-between" }}><span>New lead alerts</span><span style={{ fontSize:10, color:"#94A3B8" }}>4 new</span></div>
                {[{fn:"Rachel",ln:"Torres",sc:87,sig:"High distress index",t:"12 min ago"},{fn:"Kevin",ln:"Park",sc:91,sig:"Tax delinquency flag",t:"1 hour ago"},{fn:"Donna",ln:"Reeves",sc:78,sig:"Probate filing matched",t:"2 hours ago"}].map((n,i)=>(
                  <div key={i} style={{ display:"flex", gap:8, alignItems:"center", padding:"6px 0", borderBottom: i<2?"1px solid #F1F5F9":"none" }}>
                    <div style={{ width:24, height:24, borderRadius:"50%", background:"#EFF6FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:"#1D4ED8", flexShrink:0 }}>{n.fn[0]}{n.ln[0]}</div>
                    <div style={{ flex:1 }}><div style={{ fontSize:11, color:"#0F172A" }}><strong>{n.fn} {n.ln}</strong> — {n.sig}</div><div style={{ fontSize:10, color:"#94A3B8" }}>{n.t}</div></div>
                    <div style={S.scoreRing(n.sc,26)}>{n.sc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"#EFF6FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#1D4ED8", cursor:"pointer" }}>DU</div>
        </div>

        {/* Content */}
        <div style={S.content}>
          {view==="dashboard" && renderDashboard()}
          {view==="contacts" && renderContacts()}
          {view==="companies" && renderCompanies()}
          {view==="deals" && renderDeals()}
          {view==="lists" && renderLists()}
          {view==="reports" && renderReports()}
          {view==="activity" && renderActivity()}
          {view==="pipeline" && renderPipeline()}
        </div>
      </div>

      {/* Modal Overlay */}
      {modal && (
        <div onClick={()=>setModal(null)} style={{ position:"absolute" as const, inset:0, background:"rgba(0,0,0,0.4)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:12, width:420, maxHeight:580, overflowY:"auto" as const, padding:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <span style={{ fontSize:15, fontWeight:700, color:"#0F172A" }}>{modal==="score"?"AI Score Breakdown":modal==="csv"?"Import CSV":modal==="create"?"Add New":"Settings"}</span>
              <button onClick={()=>setModal(null)} style={{ background:"none", border:"none", fontSize:18, color:"#94A3B8", cursor:"pointer" }}>×</button>
            </div>
            {modal==="score" && renderScoreModal()}
            {modal==="csv" && renderCSV()}
            {modal==="create" && (
              <div>
                {[["First Name","text","Sarah"],["Last Name","text","Mitchell"],["Company","text","Apex Realty Group"],["Email","email","s@example.com"],["Phone","tel","(305) 555-0000"]].map(([l,t,ph])=>(
                  <div key={l as string} style={{ marginBottom:9 }}>
                    <label style={{ fontSize:10, color:"#94A3B8", textTransform:"uppercase" as const, letterSpacing:"0.05em", display:"block", marginBottom:3 }}>{l}</label>
                    <input type={t as string} placeholder={ph as string} style={{ width:"100%", padding:"8px 10px", border:"1px solid #E2E8F0", borderRadius:7, fontSize:13, color:"#0F172A", background:"#F8FAFC" }} />
                  </div>
                ))}
                <button onClick={()=>{alert("Contact created!");setModal(null);}} style={{ width:"100%", padding:"9px", background:"#0F172A", color:"#fff", border:"none", borderRadius:7, fontSize:13, fontWeight:700, cursor:"pointer", marginTop:4 }}>Create Contact</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
