import type { Contact, Company, Deal, Activity } from "./types";

export const VERTICAL_CONFIG: Record<string, { label: string; icon: string; color: string; accent: string; signals: string[] }> = {
  real_estate: {
    label: "Real Estate", icon: "🏠", color: "#00C896", accent: "#007A5C",
    signals: ["Distress Index","Equity Score","Sellability","Days Vacant","Tax Delinquency"],
  },
  healthcare: {
    label: "Healthcare", icon: "🏥", color: "#3B9EFF", accent: "#1D4ED8",
    signals: ["Practice Growth","Referral Volume","Payer Mix Score","Compliance Risk","Expansion Signal"],
  },
  manufacturing: {
    label: "Manufacturing", icon: "🏭", color: "#F59E0B", accent: "#B45309",
    signals: ["Procurement Signal","Financial Health","Growth Velocity","Supply Chain Risk","Equipment Need"],
  },
};

export const ALL_VERTICALS = Object.entries(VERTICAL_CONFIG).map(([id, v]) => ({ id, ...v }));

// ── CONTACTS ──────────────────────────────────────────────────────────────────
export const CONTACTS: Contact[] = [

  // ── REAL ESTATE ──────────────────────────────────────────────────────────
  { id:1,  vertical:"real_estate", fn:"Sarah",  ln:"Mitchell",  co:"Apex Realty Group",       role:"Senior Agent",       email:"s.mitchell@apexrealty.com",     phone:"(305) 555-0142", status:"qualified", score:88, city:"Miami, FL",        deals:2, lastAct:"Called 2h ago",     notes:"Hot lead — listing 3 properties Q3.", breakdown:[{n:"Distress Index",s:92},{n:"Equity Score",s:88},{n:"Sellability",s:85},{n:"Days Vacant",s:78},{n:"Tax Delinquency",s:90}], insight:"Portfolio shows 3 properties with high distress signals and significant equity. One property 90+ days tax delinquent.", action:"Call today — schedule listing consultation for Q3." },
  { id:2,  vertical:"real_estate", fn:"James",  ln:"Thornton",  co:"Suncoast Properties",     role:"Broker/Owner",       email:"j.thornton@suncoast.com",        phone:"(813) 555-0291", status:"customer",  score:94, city:"Tampa, FL",        deals:4, lastAct:"Email 1d ago",      notes:"Long-term client. Manages 40+ listings.", breakdown:[{n:"Distress Index",s:95},{n:"Equity Score",s:94},{n:"Sellability",s:92},{n:"Days Vacant",s:88},{n:"Tax Delinquency",s:96}], insight:"Top-tier client with exceptional portfolio health. All dimensions in the 88–96 range.", action:"Monthly check-in and market report delivery." },
  { id:3,  vertical:"real_estate", fn:"Maria",  ln:"Delgado",   co:"Blue Horizon Homes",      role:"Listing Agent",      email:"m.delgado@bluehorizon.com",      phone:"(786) 555-0384", status:"contacted", score:72, city:"Miami, FL",        deals:1, lastAct:"Note 3d ago",       notes:"Interested in the AI scoring demo.", breakdown:[{n:"Distress Index",s:68},{n:"Equity Score",s:75},{n:"Sellability",s:72},{n:"Days Vacant",s:65},{n:"Tax Delinquency",s:80}], insight:"Mid-range portfolio with moderate equity signals. One property showing early vacancy signs.", action:"Send AI scoring demo walkthrough." },
  { id:4,  vertical:"real_estate", fn:"Robert", ln:"Chen",      co:"Palmetto Real Estate",    role:"Investment Buyer",   email:"r.chen@palmettore.com",          phone:"(904) 555-0517", status:"new",       score:61, city:"Jacksonville, FL", deals:0, lastAct:"Added 5d ago",      notes:"Referred by James Thornton.", breakdown:[{n:"Distress Index",s:58},{n:"Equity Score",s:64},{n:"Sellability",s:60},{n:"Days Vacant",s:55},{n:"Tax Delinquency",s:68}], insight:"New contact with limited data history. Referral quality is high.", action:"Intro call — qualify intent and investment criteria." },
  { id:5,  vertical:"real_estate", fn:"Angela", ln:"Brooks",    co:"Keys & Coast Realty",     role:"Property Manager",   email:"a.brooks@keyscoast.com",         phone:"(305) 555-0629", status:"qualified", score:81, city:"Key West, FL",     deals:2, lastAct:"Called yesterday",   notes:"Manages 60+ vacation rental units.", breakdown:[{n:"Distress Index",s:80},{n:"Equity Score",s:83},{n:"Sellability",s:79},{n:"Days Vacant",s:78},{n:"Tax Delinquency",s:85}], insight:"Solid vacation rental portfolio. High occupancy signals from public records.", action:"Propose annual management contract." },
  { id:6,  vertical:"real_estate", fn:"Priya",  ln:"Sharma",    co:"Clearwater Investments",  role:"Portfolio Manager",  email:"p.sharma@clearwaterinv.com",     phone:"(727) 555-0816", status:"customer",  score:91, city:"Clearwater, FL",   deals:3, lastAct:"Meeting 6h ago",     notes:"Buying 2–3 distressed properties/quarter.", breakdown:[{n:"Distress Index",s:94},{n:"Equity Score",s:91},{n:"Sellability",s:90},{n:"Days Vacant",s:85},{n:"Tax Delinquency",s:93}], insight:"Premium investment buyer with clear distressed-asset strategy.", action:"Priority account — first look at all new distressed pipeline." },

  // ── HEALTHCARE ────────────────────────────────────────────────────────────
  { id:10, vertical:"healthcare",  fn:"Dr. Linda", ln:"Okafor",    co:"Okafor Family Medicine",  role:"Practice Owner",     email:"l.okafor@okaformd.com",          phone:"(312) 555-0811", status:"qualified", score:87, city:"Chicago, IL",      deals:2, lastAct:"Called 1d ago",      notes:"Expanding to second location — actively evaluating EMR vendors.", breakdown:[{n:"Practice Growth",s:91},{n:"Referral Volume",s:88},{n:"Payer Mix Score",s:84},{n:"Compliance Risk",s:76},{n:"Expansion Signal",s:95}], insight:"High expansion signal — second location filed with state. Referral volume up 34% YOY. Strong candidate for enterprise package.", action:"Schedule demo this week — expansion timeline is 90 days." },
  { id:11, vertical:"healthcare",  fn:"Marcus",    ln:"Jimenez",   co:"Sunrise Dental Group",    role:"Managing Partner",   email:"m.jimenez@sunrisedental.com",    phone:"(469) 555-0334", status:"customer",  score:93, city:"Dallas, TX",       deals:3, lastAct:"Meeting 2d ago",     notes:"6-location dental group — high value account.", breakdown:[{n:"Practice Growth",s:95},{n:"Referral Volume",s:92},{n:"Payer Mix Score",s:90},{n:"Compliance Risk",s:88},{n:"Expansion Signal",s:97}], insight:"Multi-location dental group with exceptional financials. Payer mix is 72% private insurance. Minimal compliance exposure.", action:"Upsell to Enterprise Suite — they have 3 more locations planned." },
  { id:12, vertical:"healthcare",  fn:"Aisha",     ln:"Thompson",  co:"Coastal Behavioral Health",role:"Clinical Director",  email:"a.thompson@coastalbh.com",       phone:"(813) 555-0557", status:"contacted", score:74, city:"Tampa, FL",        deals:1, lastAct:"Email 3d ago",      notes:"Behavioral health — strong growth segment.", breakdown:[{n:"Practice Growth",s:78},{n:"Referral Volume",s:72},{n:"Payer Mix Score",s:68},{n:"Compliance Risk",s:65},{n:"Expansion Signal",s:80}], insight:"Behavioral health practices are the fastest growing segment post-2022. Moderate compliance exposure from telehealth billing.", action:"Send case study on behavioral health ROI — follow up Friday." },
  { id:13, vertical:"healthcare",  fn:"Dr. Kevin", ln:"Park",      co:"Park Orthopedic Clinic",  role:"Physician Owner",    email:"k.park@parkortho.com",           phone:"(615) 555-0229", status:"new",       score:65, city:"Nashville, TN",    deals:0, lastAct:"Added today",        notes:"New inbound — orthopedic specialty.", breakdown:[{n:"Practice Growth",s:62},{n:"Referral Volume",s:68},{n:"Payer Mix Score",s:70},{n:"Compliance Risk",s:55},{n:"Expansion Signal",s:60}], insight:"Orthopedic clinic with steady referral volume. Payer mix skews toward Medicare/Medicaid — watch revenue cycle.", action:"Intro call — qualify IT budget and current vendor pain points." },
  { id:14, vertical:"healthcare",  fn:"Dr. Rachel",ln:"Torres",    co:"Torres Women's Health",   role:"OB-GYN Practice Mgr",email:"r.torres@torreswh.com",           phone:"(305) 555-0781", status:"qualified", score:82, city:"Miami, FL",        deals:2, lastAct:"Called yesterday",   notes:"Fast-growing women's health practice.", breakdown:[{n:"Practice Growth",s:86},{n:"Referral Volume",s:84},{n:"Payer Mix Score",s:80},{n:"Compliance Risk",s:72},{n:"Expansion Signal",s:85}], insight:"Women's health is a high-growth vertical. Strong referral network from 4 hospital systems. Expansion signal confirmed.", action:"Propose mid-market package — strong fit for outreach automation." },

  // ── MANUFACTURING ─────────────────────────────────────────────────────────
  { id:20, vertical:"manufacturing", fn:"Greg",    ln:"Harmon",    co:"Harmon Industrial Supply", role:"VP Procurement",     email:"g.harmon@harmonindustrial.com",  phone:"(216) 555-0445", status:"qualified", score:89, city:"Cleveland, OH",    deals:2, lastAct:"Called 2h ago",      notes:"Active buying cycle — Q3 equipment budget approved.", breakdown:[{n:"Procurement Signal",s:94},{n:"Financial Health",s:88},{n:"Growth Velocity",s:85},{n:"Supply Chain Risk",s:78},{n:"Equipment Need",s:92}], insight:"UCC filings show $2.1M equipment financing in last 90 days. Job postings for CNC operators up 40% — clear expansion signal.", action:"Send equipment procurement proposal this week — budget cycle closes Jul 31." },
  { id:21, vertical:"manufacturing", fn:"Sandra",  ln:"Wu",        co:"Pacific Fabrication Co",   role:"Operations Director", email:"s.wu@pacificfab.com",            phone:"(503) 555-0678", status:"customer",  score:95, city:"Portland, OR",     deals:4, lastAct:"Meeting 1d ago",     notes:"Tier 1 manufacturer — enterprise account.", breakdown:[{n:"Procurement Signal",s:96},{n:"Financial Health",s:95},{n:"Growth Velocity",s:93},{n:"Supply Chain Risk",s:88},{n:"Equipment Need",s:97}], insight:"Top-tier manufacturer with $24M in annual procurement. SEC filing shows 18% revenue growth YOY. Supply chain diversified across 4 regions.", action:"Renew enterprise contract — due for review in 45 days." },
  { id:22, vertical:"manufacturing", fn:"Derek",   ln:"Coleman",   co:"Midwest Steel Solutions",  role:"Plant Manager",       email:"d.coleman@midweststeel.com",     phone:"(317) 555-0312", status:"contacted", score:71, city:"Indianapolis, IN", deals:1, lastAct:"Email 4d ago",      notes:"Steel fabrication — watching for capex signals.", breakdown:[{n:"Procurement Signal",s:68},{n:"Financial Health",s:74},{n:"Growth Velocity",s:70},{n:"Supply Chain Risk",s:65},{n:"Equipment Need",s:75}], insight:"Moderate growth signals. One OSHA inspection flagged aging equipment — potential forced replacement cycle in 6-12 months.", action:"Nurture with industry report — revisit Q4 when new budget cycle opens." },
  { id:23, vertical:"manufacturing", fn:"Tamara",  ln:"Reeves",    co:"Reeves Precision Parts",   role:"CEO",                 email:"t.reeves@reevesprecision.com",   phone:"(423) 555-0890", status:"new",       score:58, city:"Chattanooga, TN",  deals:0, lastAct:"Added today",        notes:"Small precision parts shop — new inbound.", breakdown:[{n:"Procurement Signal",s:55},{n:"Financial Health",s:60},{n:"Growth Velocity",s:56},{n:"Supply Chain Risk",s:52},{n:"Equipment Need",s:62}], insight:"Small-batch precision manufacturer with limited public data. Government contract filings suggest aerospace subcontracting.", action:"Intro call — qualify production capacity and RFQ volume." },
  { id:24, vertical:"manufacturing", fn:"James",   ln:"Patel",     co:"Apex Composite Materials", role:"Purchasing Director",  email:"j.patel@apexcomposite.com",     phone:"(860) 555-0156", status:"qualified", score:84, city:"Hartford, CT",     deals:1, lastAct:"Called yesterday",   notes:"Aerospace composites — high-value procurement.", breakdown:[{n:"Procurement Signal",s:88},{n:"Financial Health",s:85},{n:"Growth Velocity",s:82},{n:"Supply Chain Risk",s:78},{n:"Equipment Need",s:86}], insight:"Aerospace composite supplier with DoD contract exposure. Import records show raw material sourcing from 3 countries — supply chain diversification needed.", action:"Propose supply chain intelligence module — strong ROI story." },
];

// ── COMPANIES ─────────────────────────────────────────────────────────────────
export const COMPANIES: Company[] = [
  { id:1, vertical:"real_estate",   name:"Apex Realty Group",       industry:"Residential Brokerage", size:"12 agents", city:"Miami, FL",        contacts:3, deals:4, revenue:"$2.4M",  since:"2021" },
  { id:2, vertical:"real_estate",   name:"Suncoast Properties",     industry:"Full-Service Brokerage",size:"28 agents", city:"Tampa, FL",        contacts:5, deals:7, revenue:"$5.1M",  since:"2019" },
  { id:3, vertical:"real_estate",   name:"Clearwater Investments",  industry:"Investment Portfolio",  size:"4 staff",   city:"Clearwater, FL",   contacts:2, deals:3, revenue:"$12M",   since:"2022" },
  { id:4, vertical:"healthcare",    name:"Okafor Family Medicine",  industry:"Primary Care",          size:"8 providers",city:"Chicago, IL",      contacts:2, deals:2, revenue:"$3.2M",  since:"2018" },
  { id:5, vertical:"healthcare",    name:"Sunrise Dental Group",    industry:"Dental — Multi-Location",size:"6 locations",city:"Dallas, TX",       contacts:3, deals:3, revenue:"$8.4M",  since:"2016" },
  { id:6, vertical:"healthcare",    name:"Coastal Behavioral Health",industry:"Behavioral Health",    size:"12 clinicians",city:"Tampa, FL",       contacts:2, deals:1, revenue:"$1.9M",  since:"2020" },
  { id:7, vertical:"manufacturing", name:"Harmon Industrial Supply", industry:"Industrial Supply",    size:"85 staff",  city:"Cleveland, OH",    contacts:2, deals:2, revenue:"$14M",   since:"2015" },
  { id:8, vertical:"manufacturing", name:"Pacific Fabrication Co",  industry:"Metal Fabrication",    size:"220 staff", city:"Portland, OR",     contacts:3, deals:4, revenue:"$24M",   since:"2011" },
  { id:9, vertical:"manufacturing", name:"Apex Composite Materials",industry:"Aerospace Composites", size:"45 staff",  city:"Hartford, CT",     contacts:2, deals:1, revenue:"$6.8M",  since:"2017" },
];

// ── DEALS ─────────────────────────────────────────────────────────────────────
export const ALL_DEALS: Record<string, Record<string, Deal[]>> = {
  real_estate: {
    "New Lead":      [{id:1,title:"3BR Wholesale — Hialeah",co:"Apex Realty Group",val:48000,contact:"Sarah Mitchell",prob:20,close:"Aug 30",stage_hist:["New Lead"]},{id:2,title:"Distressed Duplex — Tampa",co:"Clearwater Investments",val:72000,contact:"Robert Chen",prob:25,close:"Sep 15",stage_hist:["New Lead"]}],
    "Contacted":     [{id:3,title:"Portfolio of 4 SFR",co:"Clearwater Investments",val:215000,contact:"Priya Sharma",prob:40,close:"Sep 01",stage_hist:["New Lead","Contacted"]},{id:4,title:"Condo Flip — Brickell",co:"Apex Realty Group",val:38000,contact:"Maria Delgado",prob:35,close:"Sep 20",stage_hist:["New Lead","Contacted"]}],
    "Qualified":     [{id:5,title:"Waterfront Listing — Keys",co:"Keys & Coast Realty",val:145000,contact:"Angela Brooks",prob:60,close:"Aug 22",stage_hist:["New Lead","Contacted","Qualified"]}],
    "Proposal Sent": [{id:7,title:"Annual Mgmt Contract",co:"Suncoast Properties",val:84000,contact:"James Thornton",prob:75,close:"Aug 18",stage_hist:["New Lead","Contacted","Qualified","Proposal Sent"]},{id:8,title:"Off-Market Package x5",co:"Clearwater Investments",val:520000,contact:"Priya Sharma",prob:80,close:"Sep 05",stage_hist:["New Lead","Contacted","Qualified","Proposal Sent"]}],
    "Closed Won":    [{id:9,title:"REO Portfolio — Broward",co:"Apex Realty Group",val:178000,contact:"Sarah Mitchell",prob:100,close:"Jul 28",stage_hist:["New Lead","Contacted","Qualified","Proposal Sent","Closed Won"]}],
  },
  healthcare: {
    "New Lead":      [{id:101,title:"EMR Implementation — Okafor FM",co:"Okafor Family Medicine",val:24000,contact:"Dr. Linda Okafor",prob:25,close:"Sep 10",stage_hist:["New Lead"]},{id:102,title:"Revenue Cycle Audit — Torres WH",co:"Torres Women's Health",val:18000,contact:"Dr. Rachel Torres",prob:30,close:"Sep 20",stage_hist:["New Lead"]}],
    "Contacted":     [{id:103,title:"Telehealth Platform — Coastal BH",co:"Coastal Behavioral Health",val:36000,contact:"Aisha Thompson",prob:40,close:"Aug 28",stage_hist:["New Lead","Contacted"]}],
    "Qualified":     [{id:104,title:"Patient Intelligence Suite — Sunrise",co:"Sunrise Dental Group",val:92000,contact:"Marcus Jimenez",prob:65,close:"Aug 15",stage_hist:["New Lead","Contacted","Qualified"]},{id:105,title:"Compliance Monitor — Park Ortho",co:"Park Orthopedic Clinic",val:28000,contact:"Dr. Kevin Park",prob:55,close:"Sep 01",stage_hist:["New Lead","Contacted","Qualified"]}],
    "Proposal Sent": [{id:106,title:"Enterprise Suite — Sunrise Dental",co:"Sunrise Dental Group",val:185000,contact:"Marcus Jimenez",prob:80,close:"Aug 10",stage_hist:["New Lead","Contacted","Qualified","Proposal Sent"]}],
    "Closed Won":    [{id:107,title:"Practice Analytics — Okafor FM",co:"Okafor Family Medicine",val:42000,contact:"Dr. Linda Okafor",prob:100,close:"Jul 20",stage_hist:["New Lead","Contacted","Qualified","Proposal Sent","Closed Won"]}],
  },
  manufacturing: {
    "New Lead":      [{id:201,title:"Q3 Equipment Package — Harmon",co:"Harmon Industrial Supply",val:148000,contact:"Greg Harmon",prob:30,close:"Jul 31",stage_hist:["New Lead"]},{id:202,title:"Supply Chain Intelligence — Patel",co:"Apex Composite Materials",val:56000,contact:"James Patel",prob:25,close:"Sep 15",stage_hist:["New Lead"]}],
    "Contacted":     [{id:203,title:"CNC Equipment RFQ — Midwest",co:"Midwest Steel Solutions",val:88000,contact:"Derek Coleman",prob:35,close:"Oct 01",stage_hist:["New Lead","Contacted"]}],
    "Qualified":     [{id:204,title:"Procurement Intelligence — Harmon",co:"Harmon Industrial Supply",val:220000,contact:"Greg Harmon",prob:60,close:"Aug 20",stage_hist:["New Lead","Contacted","Qualified"]},{id:205,title:"Data Platform — Pacific Fab",co:"Pacific Fabrication Co",val:380000,contact:"Sandra Wu",prob:70,close:"Aug 05",stage_hist:["New Lead","Contacted","Qualified"]}],
    "Proposal Sent": [{id:206,title:"Enterprise Renewal — Pacific Fab",co:"Pacific Fabrication Co",val:620000,contact:"Sandra Wu",prob:85,close:"Aug 01",stage_hist:["New Lead","Contacted","Qualified","Proposal Sent"]}],
    "Closed Won":    [{id:207,title:"Supply Chain Module — Harmon",co:"Harmon Industrial Supply",val:94000,contact:"Greg Harmon",prob:100,close:"Jul 15",stage_hist:["New Lead","Contacted","Qualified","Proposal Sent","Closed Won"]}],
  },
};

export const ALL_STAGES = ["New Lead","Contacted","Qualified","Proposal Sent","Closed Won"];

// ── ACTIVITIES ────────────────────────────────────────────────────────────────
export const ACTIVITIES: Record<string, Activity[]> = {
  real_estate: [
    { type:"call",  icon:"📞", bg:"#EFF6FF", contact:"Sarah Mitchell",  text:"Called — discussed Q3 listing pipeline. Follow up Tuesday.", time:"2 hours ago" },
    { type:"email", icon:"✉️", bg:"#FFFBEB", contact:"James Thornton",  text:"Sent weekly market report. Opened 3 times.", time:"Yesterday 4:12 PM" },
    { type:"deal",  icon:"📊", bg:"#F0FDF4", contact:"Priya Sharma",    text:"Deal moved to Proposal Sent — Off-Market Package x5 ($520K)", time:"Yesterday 11:30 AM" },
    { type:"note",  icon:"📝", bg:"#F8FAFC", contact:"Maria Delgado",   text:"Asked about AI scoring demo. Schedule Zoom for Friday.", time:"3 days ago" },
    { type:"call",  icon:"📞", bg:"#EFF6FF", contact:"Angela Brooks",   text:"Called — 2 new vacation rentals coming to market next month.", time:"3 days ago" },
  ],
  healthcare: [
    { type:"call",  icon:"📞", bg:"#EFF6FF", contact:"Dr. Linda Okafor", text:"Called — confirmed second location filing. Demo scheduled.", time:"1 hour ago" },
    { type:"email", icon:"✉️", bg:"#FFFBEB", contact:"Marcus Jimenez",   text:"Sent enterprise proposal for 6-location Sunrise Dental Group.", time:"Yesterday 2:00 PM" },
    { type:"deal",  icon:"📊", bg:"#F0FDF4", contact:"Marcus Jimenez",   text:"Deal advanced to Proposal Sent — Enterprise Suite ($185K)", time:"Yesterday 10:00 AM" },
    { type:"note",  icon:"📝", bg:"#F8FAFC", contact:"Aisha Thompson",   text:"Telehealth billing compliance risk flagged — send compliance module info.", time:"2 days ago" },
    { type:"call",  icon:"📞", bg:"#EFF6FF", contact:"Dr. Rachel Torres", text:"Called — women's health expansion on track for Q4.", time:"3 days ago" },
  ],
  manufacturing: [
    { type:"call",  icon:"📞", bg:"#EFF6FF", contact:"Greg Harmon",      text:"Called — Q3 budget confirmed at $2.1M. RFQ coming end of week.", time:"2 hours ago" },
    { type:"email", icon:"✉️", bg:"#FFFBEB", contact:"Sandra Wu",         text:"Sent enterprise renewal proposal. Decision by Aug 1.", time:"Yesterday 3:30 PM" },
    { type:"deal",  icon:"📊", bg:"#F0FDF4", contact:"Sandra Wu",         text:"Deal moved to Proposal Sent — Enterprise Renewal ($620K)", time:"Yesterday 9:00 AM" },
    { type:"note",  icon:"📝", bg:"#F8FAFC", contact:"Derek Coleman",     text:"OSHA inspection found aging press equipment — replacement signal.", time:"4 days ago" },
    { type:"call",  icon:"📞", bg:"#EFF6FF", contact:"James Patel",       text:"Called — DoD subcontract awarded. Supply chain expansion needed.", time:"5 days ago" },
  ],
};

export const PIPELINE_STAGES = [
  { id:"ingest",    label:"Ingest",      icon:"📥", desc:"Public records + data feeds pulled" },
  { id:"scrub",     label:"Scrub",       icon:"🧹", desc:"Normalize, dedup, validate" },
  { id:"skiptrace", label:"Skip Trace",  icon:"🔍", desc:"Phone + email resolved" },
  { id:"profile",   label:"Profile",     icon:"⚙️", desc:"Vertical config applied" },
  { id:"score",     label:"AI Score",    icon:"🧠", desc:"Claude 0–100 composite score" },
  { id:"listbuild", label:"List Build",  icon:"📋", desc:"Filter, stack, rank" },
  { id:"outreach",  label:"Outreach",    icon:"📡", desc:"AI-personalized SMS/email" },
  { id:"crm",       label:"CRM",         icon:"👥", desc:"Pipeline + activity tracking" },
  { id:"reports",   label:"Reports",     icon:"⏰", desc:"Monday AM intelligence briefing" },
];
