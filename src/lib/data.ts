import type { Contact, Company, Deal, Activity } from "./types";

export const CONTACTS: Contact[] = [
  { id:1, fn:"Sarah", ln:"Mitchell", co:"Apex Realty Group", role:"Senior Agent", email:"s.mitchell@apexrealty.com", phone:"(305) 555-0142", status:"qualified", score:88, city:"Miami, FL", deals:2, lastAct:"Called 2h ago", notes:"Hot lead — listing 3 properties Q3.", breakdown:[{n:"Distress Index",s:92},{n:"Equity Score",s:88},{n:"Sellability",s:85},{n:"Days Vacant",s:78},{n:"Tax Delinquency",s:90}], insight:"Portfolio shows 3 properties with high distress signals and significant equity. Tax records indicate one property is 90+ days delinquent.", action:"Call today — schedule listing consultation for Q3 pipeline." },
  { id:2, fn:"James", ln:"Thornton", co:"Suncoast Properties", role:"Broker/Owner", email:"j.thornton@suncoast.com", phone:"(813) 555-0291", status:"customer", score:94, city:"Tampa, FL", deals:4, lastAct:"Email 1d ago", notes:"Long-term client. Manages 40+ listings.", breakdown:[{n:"Distress Index",s:95},{n:"Equity Score",s:94},{n:"Sellability",s:92},{n:"Days Vacant",s:88},{n:"Tax Delinquency",s:96}], insight:"Top-tier client with exceptional portfolio health. All dimensions in the 88–96 range.", action:"Monthly check-in and market report delivery." },
  { id:3, fn:"Maria", ln:"Delgado", co:"Blue Horizon Homes", role:"Listing Agent", email:"m.delgado@bluehorizon.com", phone:"(786) 555-0384", status:"contacted", score:72, city:"Miami, FL", deals:1, lastAct:"Note 3d ago", notes:"Interested in the AI scoring demo.", breakdown:[{n:"Distress Index",s:68},{n:"Equity Score",s:75},{n:"Sellability",s:72},{n:"Days Vacant",s:65},{n:"Tax Delinquency",s:80}], insight:"Mid-range portfolio with moderate equity signals. One property showing early vacancy signs.", action:"Send AI scoring demo walkthrough." },
  { id:4, fn:"Robert", ln:"Chen", co:"Palmetto Real Estate", role:"Investment Buyer", email:"r.chen@palmettore.com", phone:"(904) 555-0517", status:"new", score:61, city:"Jacksonville, FL", deals:0, lastAct:"Added 5d ago", notes:"Referred by James Thornton.", breakdown:[{n:"Distress Index",s:58},{n:"Equity Score",s:64},{n:"Sellability",s:60},{n:"Days Vacant",s:55},{n:"Tax Delinquency",s:68}], insight:"New contact with limited data history. Referral quality is high. Modest but growing portfolio.", action:"Intro call — qualify intent and investment criteria." },
  { id:5, fn:"Angela", ln:"Brooks", co:"Keys & Coast Realty", role:"Property Manager", email:"a.brooks@keyscoast.com", phone:"(305) 555-0629", status:"qualified", score:81, city:"Key West, FL", deals:2, lastAct:"Called yesterday", notes:"Manages 60+ vacation rental units.", breakdown:[{n:"Distress Index",s:80},{n:"Equity Score",s:83},{n:"Sellability",s:79},{n:"Days Vacant",s:78},{n:"Tax Delinquency",s:85}], insight:"Solid vacation rental portfolio. High occupancy signals. Minor deferred maintenance on 4 units.", action:"Propose annual management contract." },
  { id:6, fn:"David", ln:"Nakamura", co:"Trident Brokerage", role:"Commercial Agent", email:"d.nakamura@trident.com", phone:"(407) 555-0743", status:"contacted", score:55, city:"Orlando, FL", deals:1, lastAct:"Email 4d ago", notes:"Focused on warehouse and industrial.", breakdown:[{n:"Distress Index",s:50},{n:"Equity Score",s:58},{n:"Sellability",s:54},{n:"Days Vacant",s:48},{n:"Tax Delinquency",s:65}], insight:"Commercial-only focus limits residential scoring relevance. Some vacancy in secondary assets.", action:"Nurture — send commercial market report monthly." },
  { id:7, fn:"Priya", ln:"Sharma", co:"Clearwater Investments", role:"Portfolio Manager", email:"p.sharma@clearwaterinv.com", phone:"(727) 555-0816", status:"customer", score:91, city:"Clearwater, FL", deals:3, lastAct:"Meeting 6h ago", notes:"Buying 2–3 distressed properties/quarter.", breakdown:[{n:"Distress Index",s:94},{n:"Equity Score",s:91},{n:"Sellability",s:90},{n:"Days Vacant",s:85},{n:"Tax Delinquency",s:93}], insight:"Premium investment buyer with clear distressed-asset strategy. Excellent AI match for wholesale leads.", action:"Priority account — first look at all new distressed pipeline." },
  { id:8, fn:"Marcus", ln:"Williams", co:"Gulf Coast Homes", role:"New Construction Sales", email:"m.williams@gulfcoast.com", phone:"(239) 555-0934", status:"new", score:44, city:"Naples, FL", deals:0, lastAct:"Added today", notes:"New inbound from data scrubbing run.", breakdown:[{n:"Distress Index",s:40},{n:"Equity Score",s:48},{n:"Sellability",s:44},{n:"Days Vacant",s:38},{n:"Tax Delinquency",s:50}], insight:"Low score across all dimensions. New construction focus means limited distressed signals. Data completeness 62%.", action:"Low priority — add to quarterly newsletter." },
];

export const COMPANIES: Company[] = [
  { id:1, name:"Apex Realty Group", industry:"Residential Brokerage", size:"12 agents", city:"Miami, FL", contacts:3, deals:4, revenue:"$2.4M", since:"2021" },
  { id:2, name:"Suncoast Properties", industry:"Full-Service Brokerage", size:"28 agents", city:"Tampa, FL", contacts:5, deals:7, revenue:"$5.1M", since:"2019" },
  { id:3, name:"Clearwater Investments", industry:"Investment Portfolio", size:"4 staff", city:"Clearwater, FL", contacts:2, deals:3, revenue:"$12M AUM", since:"2022" },
  { id:4, name:"Blue Horizon Homes", industry:"Residential Listings", size:"8 agents", city:"Miami, FL", contacts:2, deals:2, revenue:"$1.8M", since:"2020" },
  { id:5, name:"Gulf Coast Homes", industry:"New Construction", size:"15 staff", city:"Naples, FL", contacts:2, deals:1, revenue:"$3.2M", since:"2018" },
  { id:6, name:"Keys & Coast Realty", industry:"Vacation Rental Mgmt", size:"6 staff", city:"Key West, FL", contacts:3, deals:3, revenue:"$900K", since:"2023" },
];

export const DEALS: Record<string, Deal[]> = {
  "New Lead":      [{ id:1, title:"3BR Wholesale — Hialeah", co:"Apex Realty Group", val:48000, contact:"Sarah Mitchell", prob:20, close:"Aug 30", stage_hist:["New Lead"] }, { id:2, title:"Distressed Duplex — Tampa", co:"Gulf Coast Homes", val:72000, contact:"Marcus Williams", prob:25, close:"Sep 15", stage_hist:["New Lead"] }],
  "Contacted":     [{ id:3, title:"Portfolio of 4 SFR", co:"Clearwater Investments", val:215000, contact:"Priya Sharma", prob:40, close:"Sep 01", stage_hist:["New Lead","Contacted"] }, { id:4, title:"Condo Flip — Brickell", co:"Blue Horizon Homes", val:38000, contact:"Maria Delgado", prob:35, close:"Sep 20", stage_hist:["New Lead","Contacted"] }],
  "Qualified":     [{ id:5, title:"Waterfront Listing — Keys", co:"Keys & Coast Realty", val:145000, contact:"Angela Brooks", prob:60, close:"Aug 22", stage_hist:["New Lead","Contacted","Qualified"] }, { id:6, title:"NNN Commercial — Orlando", co:"Trident Brokerage", val:310000, contact:"David Nakamura", prob:55, close:"Oct 01", stage_hist:["New Lead","Contacted","Qualified"] }],
  "Proposal Sent": [{ id:7, title:"Annual Mgmt Contract", co:"Suncoast Properties", val:84000, contact:"James Thornton", prob:75, close:"Aug 18", stage_hist:["New Lead","Contacted","Qualified","Proposal Sent"] }, { id:8, title:"Off-Market Package x5", co:"Clearwater Investments", val:520000, contact:"Priya Sharma", prob:80, close:"Sep 05", stage_hist:["New Lead","Contacted","Qualified","Proposal Sent"] }],
  "Closed Won":    [{ id:9, title:"REO Portfolio — Broward", co:"Apex Realty Group", val:178000, contact:"Sarah Mitchell", prob:100, close:"Jul 28", stage_hist:["New Lead","Contacted","Qualified","Proposal Sent","Closed Won"] }, { id:10, title:"Vacant Lot Bundle", co:"Palmetto Real Estate", val:95000, contact:"Robert Chen", prob:100, close:"Jul 15", stage_hist:["New Lead","Contacted","Qualified","Proposal Sent","Closed Won"] }],
};

export const ALL_STAGES = ["New Lead","Contacted","Qualified","Proposal Sent","Closed Won"];

export const ACTIVITIES: Activity[] = [
  { type:"call",  icon:"📞", bg:"#EFF6FF", contact:"Sarah Mitchell",  text:"Called — discussed Q3 listing pipeline. Follow up next Tuesday.", time:"2 hours ago" },
  { type:"email", icon:"✉️", bg:"#FFFBEB", contact:"James Thornton",  text:"Sent weekly market report. Opened 3 times.", time:"Yesterday 4:12 PM" },
  { type:"deal",  icon:"📊", bg:"#F0FDF4", contact:"Priya Sharma",    text:"Deal moved to Proposal Sent — Off-Market Package x5 ($520K)", time:"Yesterday 11:30 AM" },
  { type:"note",  icon:"📝", bg:"#F8FAFC", contact:"Maria Delgado",   text:"Asked about AI scoring demo. Schedule Zoom for Friday.", time:"3 days ago" },
  { type:"call",  icon:"📞", bg:"#EFF6FF", contact:"Angela Brooks",   text:"Called — 2 new vacation rental units coming to market.", time:"3 days ago" },
  { type:"email", icon:"✉️", bg:"#FFFBEB", contact:"David Nakamura",  text:"Sent commercial market comp report. No reply yet.", time:"4 days ago" },
  { type:"note",  icon:"📝", bg:"#F8FAFC", contact:"Robert Chen",     text:"Referred by James Thornton. Looking for distressed SFRs under $120K.", time:"5 days ago" },
];

export const PIPELINE_STAGES = [
  { id:"ingest",     label:"Ingest",      icon:"📥", desc:"County assessor + MLS records pulled" },
  { id:"scrub",      label:"Scrub",       icon:"🧹", desc:"Normalize, dedup, CASS validate" },
  { id:"skiptrace",  label:"Skip Trace",  icon:"🔍", desc:"Phone + email resolved" },
  { id:"profile",    label:"Profile",     icon:"⚙️", desc:"Vertical config applied" },
  { id:"score",      label:"AI Score",    icon:"🧠", desc:"Claude 0–100 composite score" },
  { id:"listbuild",  label:"List Build",  icon:"📋", desc:"Filter, stack, rank" },
  { id:"outreach",   label:"Outreach",    icon:"📡", desc:"AI-personalized SMS/email" },
  { id:"crm",        label:"CRM",         icon:"👥", desc:"Pipeline + activity tracking" },
  { id:"reports",    label:"Reports",     icon:"⏰", desc:"Monday AM intelligence briefing" },
];
