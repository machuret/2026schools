"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Heart, Users, BarChart3, Smile, TrendingUp, ShieldCheck, Database,
  MessageSquare, UserCircle, Menu, X, CheckCircle, ArrowRight,
} from "lucide-react";

/* ── Tokens ──────────────────────────────────────────────────── */
const fi = "var(--font-poppins), Poppins, sans-serif";
const fs = "var(--font-montserrat), Montserrat, sans-serif";
const WARM   = "#FFFFFF";
const SAGE   = "#F8F4F7";
const BLUE   = "#29B8E8";
const BLUE_D = "#1A9DCA";
const NAVY   = "#3D3D3D";
const DARK   = "#3D3D3D";
const G6     = "#4b5563";
const G5     = "#6b7280";
const G4     = "#9ca3af";
const G3     = "#d1d5db";

/* ── Countdown ───────────────────────────────────────────────── */
const TARGET = new Date("2026-05-25T00:00:00+10:00");
function Countdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(true);
    const tick = () => {
      const ms = Math.max(0, TARGET.getTime() - Date.now());
      setT({ d: Math.floor(ms / 86400000), h: Math.floor((ms % 86400000) / 3600000), m: Math.floor((ms % 3600000) / 60000), s: Math.floor((ms % 60000) / 1000) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  if (!ok) return <div style={{ height: 88 }} />;
  return (
    <div className="flex gap-3">
      {([[t.d, "Days"], [t.h, "Hrs"], [t.m, "Min"], [t.s, "Sec"]] as [number, string][]).map(([v, l]) => (
        <div key={l as string} className="flex flex-col items-center bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100 min-w-[62px]">
          <span className="text-3xl font-black tabular-nums leading-none" style={{ color: DARK, fontFamily: fs }}>{String(v as number).padStart(2, "0")}</span>
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 mt-1.5">{l}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Shared input ────────────────────────────────────────────── */
const inp: React.CSSProperties = {
  fontFamily: fi, fontSize: "0.875rem", color: DARK,
  background: "#fff", border: "1px solid #f3f4f6",
  borderRadius: 12, padding: "12px 16px",
  width: "100%", boxSizing: "border-box", outline: "none",
};

/* ── Navbar ──────────────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <a href="/"><Image src="/logo/nciw_no_background-1024x577.png" alt="National Check-in Week" height={60} width={107} style={{ objectFit: "contain" }} priority /></a>
        <nav className="hidden md:flex items-center gap-8">
          {["Home","About","Resources","Blog"].map(l => (
            <a key={l} href="#" className="text-sm font-medium text-slate-500 hover:text-[#29B8E8] transition-colors" style={{ textDecoration: "none" }}>{l}</a>
          ))}
          <a href="/login" className="text-sm font-medium text-slate-500 hover:text-[#29B8E8] transition-colors" style={{ textDecoration: "none" }}>Log In</a>
          <a href="/events" className="text-base font-bold text-white px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200" style={{ background: BLUE, textDecoration: "none" }}>Register Now</a>
        </nav>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" style={{ background: "none", border: "none", cursor: "pointer", color: DARK }} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-gray-100 bg-white overflow-hidden">
            <div className="px-4 py-4 flex flex-col gap-3">
              {["Home","About","Resources","Blog","Log In"].map(l => (
                <a key={l} href="#" className="py-2 text-base font-medium text-slate-600 hover:text-[#29B8E8] transition-colors" style={{ textDecoration: "none" }}>{l}</a>
              ))}
              <a href="/events" className="mt-2 text-center text-base font-bold text-white py-3 rounded-full transition-colors" style={{ background: BLUE, textDecoration: "none" }}>Register Now</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ── Hero ────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full" style={{ background: "radial-gradient(circle, #E6F7FD 0%, transparent 65%)" }} />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, #FCEEF6 0%, transparent 65%)" }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6" style={{ color: BLUE, background: "#E6F7FD" }}>
            <span aria-hidden>💙</span> 25 May 2026 &middot; Australia
          </motion.div>
          <h1 className="font-black leading-[1.07] tracking-tight mb-5" style={{ fontFamily: fs, fontSize: "clamp(2.5rem, 5vw, 3.75rem)", color: DARK }}>
            Empathy &amp; Connection:<br />
            <span style={{ color: BLUE }}>A National Check-In Week</span><br />
            for Student Wellbeing.
          </h1>
          <p style={{ fontFamily: fi, fontSize: "1.125rem", color: DARK, lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
            Join us in creating safe spaces and fostering community for all students.
            Together, we can make a difference in mental health awareness.
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            <motion.a href="/events" whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-2.5 text-base font-bold text-white px-9 py-4 rounded-2xl shadow-2xl" style={{ background: BLUE, textDecoration: "none" }}>
              Join the Movement <ArrowRight size={18} />
            </motion.a>
            <motion.a href="/about" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center text-base font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-[#29B8E8] hover:text-[#29B8E8] px-9 py-4 rounded-2xl transition-colors duration-200" style={{ textDecoration: "none" }}>
              Learn More
            </motion.a>
          </div>
          <Countdown />
          <p style={{ fontFamily: fi, fontSize: "0.875rem", color: G6, fontStyle: "italic", marginTop: 16 }}>
            Until National Check-In Week 2026
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative hidden lg:block">
          <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://picsum.photos/seed/students-group/800/600" alt="Diverse group of students" style={{ width: "100%", height: "auto", objectFit: "cover", display: "block" }} referrerPolicy="no-referrer" />
          </div>
          <div aria-hidden="true" style={{ position: "absolute", bottom: -24, left: -24, width: 96, height: 96, background: "#d1fae5", borderRadius: "50%", zIndex: -1, filter: "blur(24px)", opacity: 0.6 }} />
          <div aria-hidden="true" style={{ position: "absolute", top: -24, right: -24, width: 128, height: 128, background: "#dbeafe", borderRadius: "50%", zIndex: -1, filter: "blur(24px)", opacity: 0.6 }} />
        </motion.div>
      </div>
    </section>
  );
}

/* ── Impact ──────────────────────────────────────────────────── */
function Impact() {
  const stats = [
    { label: "Million Students",   value: "15",    sub: "Supporting urban & rural students impact",           Icon: Heart,    iconColor: "#f87171", bg: "#fef2f2" },
    { label: "Children Supported", value: "1 in 7", sub: "Australian children in the education system",        Icon: Users,    iconColor: "#60a5fa", bg: "#eff6ff" },
    { label: "of Children",        value: "38%",   sub: "Supporting children more than 38% of children",       Icon: BarChart3, iconColor: "#4ade80", bg: "#f0fdf4" },
    { label: "of Children",        value: "24%",   sub: "Supporting children mental health 24% of children",   Icon: Smile,    iconColor: "#facc15", bg: "#fefce8" },
  ];
  return (
    <section style={{ padding: "80px 0", background: "#fff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <p style={{ fontFamily: fi, fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: G6, marginBottom: 48 }}>Impact</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
          {stats.map((s, i) => (
            <motion.div key={i} whileHover={{ y: -5 }}
              style={{ background: s.bg, padding: 32, borderRadius: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ background: "#fff", padding: 12, borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 24 }}>
                <s.Icon size={24} color={s.iconColor} />
              </div>
              <div style={{ fontFamily: fi, fontSize: "2.25rem", fontWeight: 700, color: DARK, marginBottom: 8, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: fi, fontSize: "1rem", fontWeight: 700, color: DARK, marginBottom: 16 }}>{s.label}</div>
              <p style={{ fontFamily: fi, fontSize: "0.875rem", color: DARK, lineHeight: 1.6, margin: 0 }}>{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Why This Matters ────────────────────────────────────────── */
function WhyMatters() {
  const items = [
    { title: "Growing Challenges",          desc: "Growing challenges in the current education landscape and student mental health.",    Icon: TrendingUp,  iconColor: "#f97316" },
    { title: "Elevated Impact Needed",       desc: "Elevated impact needed to address the increasing need for connection.",               Icon: ShieldCheck, iconColor: "#3b82f6" },
    { title: "Year of the Data",             desc: "The role of data in understanding and improving student wellbeing outcomes.",          Icon: Database,    iconColor: "#a855f7" },
    { title: "Student Voice at the Centre",  desc: "Centering student voices in the development of wellbeing programs.",                  Icon: MessageSquare, iconColor: "#22c55e" },
  ];
  return (
    <section style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p style={{ fontFamily: fi, textAlign: "center", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: G6, marginBottom: 64 }}>Why This Matters</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-x-16 lg:gap-y-10">
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="flex gap-5 p-6 rounded-3xl border border-slate-100 hover:border-[#29B8E8]/30 hover:shadow-lg transition-all duration-300 group">
              <div className="flex-shrink-0 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-200" style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <item.Icon size={24} color={item.iconColor} />
              </div>
              <div>
                <h3 className="text-base font-bold mb-2" style={{ fontFamily: fi, color: DARK }}>{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How to Participate ──────────────────────────────────────── */
function HowToParticipate() {
  const [done, setDone] = useState(false);
  const steps = [
    { step: "1", title: "Connect",          desc: "Join our leading student wellbeing event, National Check-In Week.",               Icon: Users },
    { step: "2", title: "Check Routines",   desc: "Create space for students on the regular items and routines at school.",           Icon: UserCircle },
    { step: "3", title: "Registration",     desc: "Register your school and role to be part of the movement.",                       Icon: ShieldCheck },
    { step: "4", title: "Enter Data",       desc: "Register to the online platform for data collection and insights.",               Icon: Database },
  ];
  return (
    <section style={{ padding: "80px 24px", background: SAGE }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p style={{ fontFamily: fi, textAlign: "center", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: G6, marginBottom: 64 }}>How to Participate</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-5 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-lg group-hover:scale-110 transition-transform duration-200" style={{ background: BLUE }}>
                  {i + 1}
                </div>
                <div className="pt-1">
                  <h3 className="text-base font-bold mb-1" style={{ fontFamily: fi, color: DARK }}>{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ background: WARM, padding: 40, borderRadius: 40, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}>
            <h3 style={{ fontFamily: fi, fontSize: "1.5rem", fontWeight: 700, color: DARK, marginBottom: 32 }}>Register Form</h3>
            {done ? (
              <div className="text-center py-8">
                <CheckCircle size={52} className="mx-auto mb-4" color={BLUE} />
                <h3 style={{ fontFamily: fi, fontSize: "1.5rem", fontWeight: 800, color: DARK, marginBottom: 8 }}>You&rsquo;re registered!</h3>
                <p style={{ fontFamily: fi, color: G5 }}>We&rsquo;ll be in touch with details before May 2026.</p>
              </div>
            ) : (
            <form style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={e => { e.preventDefault(); setDone(true); }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <input type="text" placeholder="First Name" style={inp} />
                <input type="text" placeholder="Last Name"  style={inp} />
              </div>
              <input type="email" placeholder="Email"       style={inp} />
              <input type="text"  placeholder="School Name" style={inp} />
              <select style={{ ...inp, color: G4 }}>
                <option>Role</option><option>Teacher</option><option>Student</option><option>Parent</option>
              </select>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 8 }}>
                {["I agree to the terms and conditions and privacy policy.", "I want to stay updated with news and events."].map(lbl => (
                  <label key={lbl} style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                    <input type="checkbox" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontFamily: fi, fontSize: "0.875rem", color: DARK, lineHeight: 1.5 }}>{lbl}</span>
                  </label>
                ))}
              </div>
              <motion.button type="submit" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }} className="mt-1 w-full inline-flex items-center justify-center gap-2.5 text-base font-bold text-white py-4 rounded-2xl shadow-xl border-0 cursor-pointer" style={{ background: BLUE }}>
                Register Now <ArrowRight size={18} />
              </motion.button>
            </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Featured Speakers ───────────────────────────────────────── */
function FeaturedSpeakers() {
  const speakers = [
    { name: "Andrew Smith",    role: "Wellbeing Researcher",    desc: "Leading expert in student wellbeing and educational data analysis.",          img: "https://i.pravatar.cc/150?u=andrew1" },
    { name: "Sally Webster",   role: "Educational Psychologist",desc: "Specialises in psychological safety and resilience programs for youth.",      img: "https://i.pravatar.cc/150?u=sally2"  },
    { name: "Dianne Giblin",   role: "Community Advocate",      desc: "Advocate for parent engagement and community-driven wellbeing initiatives.",  img: "https://i.pravatar.cc/150?u=dianne3" },
    { name: "Dr Mark Williams",role: "Cognitive Researcher",    desc: "Researches digital environments and their impact on cognitive development.",  img: "https://i.pravatar.cc/150?u=mark4"   },
    { name: "Gemma McLean",    role: "Early Childhood Lead",    desc: "Expert in early childhood development and transition to primary school.",     img: "https://i.pravatar.cc/150?u=gemma5"  },
    { name: "Kate Xavier",     role: "Trauma Specialist",       desc: "Expert in trauma-informed practice for vulnerable student populations.",      img: "https://i.pravatar.cc/150?u=kate6"   },
    { name: "Nikki Bonus",     role: "Platform Founder",        desc: "Founded wellbeing platforms used by thousands of schools across Australia.",  img: "https://i.pravatar.cc/150?u=nikki7"  },
    { name: "Corrie Ackland",  role: "Mental Health Lead",      desc: "Dedicated to improving peer-to-peer mental health support in schools.",      img: "https://i.pravatar.cc/150?u=corrie8" },
  ];
  return (
    <section style={{ padding: "80px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p style={{ fontFamily: fi, textAlign: "center", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: G6, marginBottom: 64 }}>Featured Speakers</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
          {speakers.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group bg-white rounded-3xl p-5 text-center border border-slate-100 hover:border-[#29B8E8]/40 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-slate-100 group-hover:ring-[#29B8E8]/40 transition-all duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt={s.name} className="w-full h-full object-cover block" referrerPolicy="no-referrer" />
              </div>
              <h3 className="text-sm font-bold mb-1.5" style={{ color: DARK, fontFamily: fi }}>{s.name}</h3>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mb-3" style={{ color: BLUE, background: "#E6F7FD" }}>{s.role}</span>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────── */
function Footer() {
  const lnk: React.CSSProperties = { fontFamily: fi, fontSize: "0.875rem", color: "rgba(255,255,255,0.9)", textDecoration: "none" };
  return (
    <footer style={{ background: NAVY, color: "#fff", padding: "64px 24px" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
        <div>
          <h4 style={{ fontFamily: fi, fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.9, marginBottom: 24 }}>Contact Us</h4>
          {["1800 123 456", "info@checkinweek.com", "123 Education Way, Sydney"].map(t => (
            <p key={t} style={{ fontFamily: fi, fontSize: "0.875rem", opacity: 1, marginBottom: 12 }}>{t}</p>
          ))}
        </div>
        <div>
          <h4 style={{ fontFamily: fi, fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.9, marginBottom: 24 }}>Quick Links</h4>
          {[["About Us","#"],["Resources","#"],["Privacy Policy","#"],["Terms of Service","#"]].map(([l,h]) => (
            <p key={l} style={{ marginBottom: 12 }}><a href={h} style={lnk}>{l}</a></p>
          ))}
        </div>
        <div>
          <h4 style={{ fontFamily: fi, fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.9, marginBottom: 24 }}>Social Media</h4>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "Facebook",  d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
              { label: "LinkedIn",  d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" },
            ].map(({ label, d }) => (
              <a key={label} href="#" aria-label={label} style={{ background: "rgba(255,255,255,0.1)", padding: 8, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={d} /></svg>
              </a>
            ))}
            <a href="#" aria-label="Instagram" style={{ background: "rgba(255,255,255,0.1)", padding: 8, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="white"/></svg>
            </a>
            <a href="#" aria-label="Twitter / X" style={{ background: "rgba(255,255,255,0.1)", padding: 8, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <Image
            src="/logo/nciw_no_background-1024x577.png"
            alt="National Check-in Week"
            width={160}
            height={90}
            style={{ objectFit: "contain", marginBottom: 16, filter: "brightness(0) invert(1)", opacity: 0.8 }}
          />
          <p style={{ fontFamily: fi, fontSize: "0.875rem", opacity: 0.75, textAlign: "right", margin: 0 }}>
            © 2026 National Check-In Week.<br />All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ── Root ────────────────────────────────────────────────────── */
export default function Home2Client() {
  return (
    <div style={{ minHeight: "100vh", background: WARM, display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Hero />
        <Impact />
        <WhyMatters />
        <HowToParticipate />
        <FeaturedSpeakers />
      </main>
      <Footer />
    </div>
  );
}
