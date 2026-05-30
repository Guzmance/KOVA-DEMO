export interface Contact {
  id: number;
  fn: string; ln: string; co: string; role: string;
  email: string; phone: string; status: string;
  score: number; city: string; deals: number;
  lastAct: string; notes: string;
  breakdown: { n: string; s: number }[];
  insight: string; action: string;
}
export interface Company {
  id: number; name: string; industry: string;
  size: string; city: string; contacts: number;
  deals: number; revenue: string; since: string;
}
export interface Deal {
  id: number; title: string; co: string;
  val: number; contact: string; prob: number;
  close: string; stage_hist: string[];
}
export interface Activity {
  type: string; icon: string; bg: string;
  contact: string; text: string; time: string;
}
export type View = "dashboard"|"contacts"|"companies"|"deals"|"lists"|"reports"|"activity"|"pipeline";
export type Modal = null|"score"|"create"|"csv"|"settings";
