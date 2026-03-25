"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  BarChart3,
  Lightbulb,
  ClipboardCheck,
  Users,
  Calendar,
  MessageSquare,
  Database,
  Menu,
  X,
} from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";

/* ── Header ─────────────────────────────────────────────────── */
function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-blue-900 text-lg tracking-tight">National</span>
              <span className="font-bold text-blue-600 text-sm">Check-In Week</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {["Home", "Products", "Resources", "Blog"].map((l) => (
              <a key={l} href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">{l}</a>
            ))}
            <a href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Log In</a>
            <a href="/events" className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Register Now
            </a>
          </nav>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {["Home", "Products", "Resources", "Blog", "Log In"].map((l) => (
                <a key={l} href="#" className="block text-base font-medium text-slate-600">{l}</a>
              ))}
              <a href="/events" className="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-full text-base font-semibold">
                Register Now
              </a>
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
    <section className="relative pt-16 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6">
              Student Wellbeing: <br />
              <span className="text-blue-600">A National Priority.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
              Join Australia&rsquo;s leading student wellbeing event, National Check-In Week,
              bridging data, experts, and schools.
            </p>
            <a
              href="/events"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 mb-12"
            >
              Register Now
            </a>

            <div className="flex flex-col gap-3">
              <CountdownTimer />
              <p className="text-sm font-medium text-slate-500">Until National Check-In Week 2026</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000"
                alt="Students collaborating"
                className="w-full h-[500px] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" aria-hidden="true" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" aria-hidden="true" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-teal-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000" aria-hidden="true" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Impact ──────────────────────────────────────────────────── */
function Impact() {
  const stats = [
    { value: "15",    label: "Million Students",      sub: "Supporting what\u2019s Million students impact" },
    { value: "1 in 7", label: "Australian Children",  sub: "Australian children in Australian children" },
    { value: "38%",   label: "of Children",           sub: "Supporting children\u2019s women over 38% of children" },
    { value: "24%",   label: "of Children",           sub: "Supporting children worten anaki 24% of children" },
  ];
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-sm font-black tracking-[0.2em] text-slate-400 uppercase mb-16">Impact</h2>
        <div className="grid md:grid-cols-4 gap-12 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-5xl font-black text-blue-600 mb-4">{s.value}</div>
              <div className="text-lg font-bold text-slate-900 mb-2">{s.label}</div>
              <p className="text-sm text-slate-500 leading-relaxed">{s.sub}</p>
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
    { icon: <BarChart3 className="w-6 h-6 text-blue-600" />, title: "Growing Challenges", desc: "Growing challenges in their environment, including changes and pressure in academic needs and connection lags." },
    { icon: <Lightbulb className="w-6 h-6 text-blue-600" />, title: "Elevated Impact Needed", desc: "Elevated impact needed to counteract increasing pressure on environments and students, helping to overcome challenges." },
    { icon: <ClipboardCheck className="w-6 h-6 text-blue-600" />, title: "Year of the Data", desc: "This year of data will provide insights needed to improve student wellbeing in early years as the foundation of the data." },
    { icon: <Users className="w-6 h-6 text-blue-600" />, title: "Student Voice at the Centre", desc: "Student voice is incorporated into the centre of planning, ensuring their voice is a priority in your strategy." },
  ];
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-sm font-black tracking-[0.2em] text-slate-400 uppercase mb-16">Why This Matters</h2>
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex gap-6"
            >
              <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
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
  const steps = [
    { icon: <Calendar className="w-5 h-5" />, title: "Step 1. Online Challenge",   desc: "Join the leading student wellbeing event, National Check-In Week." },
    { icon: <Users className="w-5 h-5" />,    title: "Step 2. Check Positions",    desc: "Case study for schools on the insights from the data collected at National Check-In Week." },
    { icon: <MessageSquare className="w-5 h-5" />, title: "Step 3. Registration",  desc: "Register for and comments and roles to be placed of your treatment or schools." },
    { icon: <Database className="w-5 h-5" />, title: "Step 4. Enter Data",         desc: "Registration to the data and insights derived from the national measurement." },
  ];
  return (
    <section className="py-24 bg-blue-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-sm font-black tracking-[0.2em] text-slate-400 uppercase mb-16">How to Participate</h2>
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          <div className="space-y-10">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Register Form</h3>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" />
                <input type="text" placeholder="Last Name"  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" />
              </div>
              <input type="email" placeholder="Email"       className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" />
              <input type="text"  placeholder="School Name" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" />
              <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-500 appearance-none">
                <option>Role</option>
                <option>Teacher</option>
                <option>Principal</option>
                <option>Student</option>
                <option>Parent</option>
              </select>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-xs text-slate-500 leading-tight">
                    I agree to the terms and conditions of this as of our{" "}
                    <a href="/privacy" className="text-blue-600 underline">Privacy Policy</a>
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-xs text-slate-500 leading-tight">
                    I agree with our{" "}
                    <a href="/terms" className="text-blue-600 underline">Cookie Policy</a>
                  </span>
                </label>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mt-4">
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Speakers ────────────────────────────────────────────────── */
function Speakers() {
  const speakers = [
    { name: "Andrew Smith",    role: "Professor", img: "https://i.pravatar.cc/150?u=andrew",  bio: "Leading expert in student wellbeing and educational data analysis with over 20 years experience." },
    { name: "Sally Webster",   role: "Professor", img: "https://i.pravatar.cc/150?u=sally",   bio: "Specializes in psychological safety in schools and developing resilience programs for youth." },
    { name: "Dianne Giblin",   role: "Professor", img: "https://i.pravatar.cc/150?u=dianne",  bio: "Advocate for parent engagement and community-driven wellbeing initiatives in regional areas." },
    { name: "Dr Mark Williams",role: "Professor", img: "https://i.pravatar.cc/150?u=mark",    bio: "Renowned researcher in cognitive development and the impact of digital environments on learning." },
    { name: "Gemma McLean",    role: "Professor", img: "https://i.pravatar.cc/150?u=gemma",   bio: "Focuses on early childhood development and the transition to primary education systems." },
    { name: "Kate Xavier",     role: "Professor", img: "https://i.pravatar.cc/150?u=kate",    bio: "Expert in trauma-informed practice and supporting vulnerable student populations." },
    { name: "Nikki Bonus",     role: "Professor", img: "https://i.pravatar.cc/150?u=nikki",   bio: "Founder of several wellbeing platforms used by thousands of schools across Australia." },
    { name: "Corrie Ackland",  role: "Professor", img: "https://i.pravatar.cc/150?u=corrie",  bio: "Dedicated to improving mental health outcomes through peer-to-peer support networks." },
  ];
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-sm font-black tracking-[0.2em] text-slate-400 uppercase mb-16">Featured Speakers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {speakers.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-blue-50 group-hover:ring-blue-100 transition-all">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{s.name}</h3>
                <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">{s.role}</p>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{s.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Custom Footer ───────────────────────────────────────────── */
function Home1Footer() {
  return (
    <footer className="bg-blue-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <div className="space-y-4 text-blue-100/70 text-sm">
              <p>+61 02 555 505</p>
              <p>Fax: 100 888 992</p>
              <p>events@nationalcheckinweek.com</p>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-blue-100/70 text-sm">
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms"   className="hover:text-white transition-colors">Terms and Conditions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">Social Media</h4>
            <div className="flex gap-4">
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://x.com" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-white text-xl tracking-tight">National</span>
                <span className="font-bold text-blue-300 text-sm">Check-In Week</span>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-10 border-t border-blue-800 text-center text-blue-100/40 text-xs">
          <p>Copyright &copy; 2026 National Check-In Week. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ── Root export ─────────────────────────────────────────────── */
export default function Home1Client() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main id="main-content">
        <Hero />
        <Impact />
        <WhyMatters />
        <HowToParticipate />
        <Speakers />
      </main>
      <Home1Footer />
    </div>
  );
}
