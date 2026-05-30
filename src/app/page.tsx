"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => { router.replace("/dashboard"); }, [router]);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#06090F" }}>
      <div style={{ color:"#00C896", fontSize:18, fontWeight:700 }}>Loading KOVA...</div>
    </div>
  );
}
