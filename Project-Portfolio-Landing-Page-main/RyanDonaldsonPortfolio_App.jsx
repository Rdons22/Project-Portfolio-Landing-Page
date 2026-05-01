import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TEST_CASES = [
  { component: "IntroGate", input: { clicked: false }, expected: "renders the animated Enter page before the cinematic sequence" },
  { component: "IntroGate", input: { clicked: true }, expected: "starts the cinematic intro after clicking Enter" },
  { component: "CinematicIntroStage", input: { mode: "tunnel" }, expected: "renders a smooth zoom corridor after Enter" },
  { component: "CinematicIntroStage", input: { mode: "cards" }, expected: "bursts project cards across the screen" },
  { component: "CinematicIntroStage", input: { ending: true }, expected: "uses a hero match-cut into the landing page" },
  { component: "ProjectIndexPreview", input: { active: true }, expected: "renders interactive colored project index" },
  { component: "ProjectTile", input: { title: "AI Audit Toolkit" }, expected: "renders editorial project tile" },
  { component: "WorkGrid", input: { projectCount: 5 }, expected: "renders staggered asymmetric project grid" },
  { component: "RyanDonaldsonProjectPortfolio", input: { loaded: true }, expected: "renders complete portfolio without syntax errors" },
];

const ACCENT = "#FF5A3D";
const BLUE = "#4C7DFF";
const GREEN = "#19A974";
const VIOLET = "#8B5CF6";
const RED = "#E11D48";

function ArrowIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <path d="M7 17L17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

function FadeIn({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function NavLink({ href, label, color, onClick }) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      initial="rest"
      animate="rest"
      whileHover="hover"
      className="relative inline-block no-underline"
    >
      <span className="relative block overflow-hidden" style={{ height: "1.4em", lineHeight: "1.4em" }}>
        <motion.span
          className="block leading-[1.4em]"
          variants={{ rest: { y: "0%" }, hover: { y: "-100%" } }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        >
          {label}
        </motion.span>
        <motion.span
          className="block leading-[1.4em]"
          style={{ color }}
          variants={{ rest: { y: "0%" }, hover: { y: "-100%" } }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        >
          {label}
        </motion.span>
      </span>
      <motion.span
        className="pointer-events-none absolute left-0 right-0 block h-px"
        style={{ backgroundColor: color, bottom: "-5px", transformOrigin: "center" }}
        variants={{ rest: { scaleX: 0, opacity: 0 }, hover: { scaleX: 1, opacity: 1 } }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className="pointer-events-none absolute -left-3 top-1/2 block h-1 w-1 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: color }}
        variants={{ rest: { scale: 0, opacity: 0 }, hover: { scale: 1, opacity: 1 } }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.a>
  );
}

function NameMark({ onActivate }) {
  const [bursts, setBursts] = useState([]);
  const COLORS = [ACCENT, BLUE, GREEN, VIOLET, RED, "#111111"];
  const letters = "Ryan Donaldson".split("");

  const handleClick = (e) => {
    e.preventDefault();
    if (onActivate) onActivate();
    const id = Date.now() + Math.random();
    const particles = Array.from({ length: 18 }, (_, i) => ({
      i,
      angle: (i / 18) * Math.PI * 2 + Math.random() * 0.5,
      distance: 60 + Math.random() * 80,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 4 + Math.random() * 6,
      rot: (Math.random() - 0.5) * 360,
    }));
    setBursts((prev) => [...prev, { id, particles }]);
    setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== id)), 950);
  };

  const containerVariants = {
    rest: {},
    hover: { transition: { staggerChildren: 0.035 } },
  };
  const letterVariants = {
    rest: { y: 0, rotate: 0, color: undefined },
    hover: {
      y: [0, -4, 0],
      rotate: [0, -8, 0],
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.a
      href="#top"
      onClick={handleClick}
      initial="rest"
      animate="rest"
      whileHover="hover"
      variants={containerVariants}
      className="relative font-mono text-[10px] uppercase tracking-[0.28em] text-black/55 no-underline transition hover:text-black"
      aria-label="Ryan Donaldson — back to top"
    >
      <span className="relative inline-flex">
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            variants={letterVariants}
            className={`inline-block ${i >= 5 ? "text-[#FF5A3D]" : ""}`}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        ))}
      </span>

      <span className="pointer-events-none absolute left-1/2 top-1/2">
        <AnimatePresence>
          {bursts.map((b) =>
            b.particles.map((p) => (
              <motion.span
                key={`${b.id}-${p.i}`}
                className="absolute block rounded-full"
                style={{ width: p.size, height: p.size, backgroundColor: p.color }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.6, rotate: 0 }}
                animate={{
                  x: Math.cos(p.angle) * p.distance,
                  y: Math.sin(p.angle) * p.distance,
                  opacity: 0,
                  scale: 0.4,
                  rotate: p.rot,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            ))
          )}
        </AnimatePresence>
      </span>
    </motion.a>
  );
}

const AUDIT_SAMPLES = [
  {
    id: "invoice",
    label: "Invoice line",
    raw: "Office supplies · $1,240.00 · Vendor: Acme · Date: 2025-03-12",
    parse: ["type: expense", "amount: 1,240.00", "vendor: Acme", "date: 2025-03-12"],
    classify: { label: "OPEX · Office expenses", color: BLUE },
    ifrs: { ref: "IAS 16", note: "Below capitalization threshold — expensed to P&L" },
    flag: { tone: "ok", text: "No anomalies · matches Q1 vendor pattern", color: GREEN },
    verdict: { confidence: 96, action: "Auto-post to GL", color: GREEN },
  },
  {
    id: "payroll",
    label: "Payroll entry",
    raw: "Salary · $48,000.00 · Employee #042 · Dept: Engineering · Date: 2025-03-31",
    parse: ["type: salary", "amount: 48,000.00", "dept: Engineering", "period: 2025-03"],
    classify: { label: "OPEX · Personnel · Engineering", color: VIOLET },
    ifrs: { ref: "IAS 19", note: "Short-term employee benefits · monthly accrual" },
    flag: { tone: "warn", text: "2.1× department average — review recommended", color: ACCENT },
    verdict: { confidence: 78, action: "Hold for review", color: ACCENT },
  },
  {
    id: "revenue",
    label: "Revenue accrual",
    raw: "Service revenue · $215,000.00 · Customer: Northwind · Date: 2025-03-31",
    parse: ["type: revenue", "amount: 215,000.00", "customer: Northwind", "period: Q1-2025"],
    classify: { label: "Revenue · Services rendered", color: GREEN },
    ifrs: { ref: "IFRS 15", note: "Performance obligation NOT satisfied · contract unsigned" },
    flag: { tone: "error", text: "Critical · service not delivered, contract unsigned — recognition violates IFRS 15", color: RED },
    verdict: { confidence: 18, action: "Block · escalate to controller", color: RED },
  },
];

function ProjectIndexPreview({ compact = false }) {
  const [active, setActive] = useState(AUDIT_SAMPLES[0]);
  const [input, setInput] = useState(AUDIT_SAMPLES[0].raw);
  const [step, setStep] = useState(0);

  const run = (sample) => {
    setActive(sample);
    setInput(sample.raw);
    setStep(0);
    let s = 0;
    const tick = () => {
      s += 1;
      setStep(s);
      if (s < 5) setTimeout(tick, 650);
    };
    setTimeout(tick, 280);
  };

  useEffect(() => {
    const t = setTimeout(() => run(AUDIT_SAMPLES[0]), 350);
    return () => clearTimeout(t);
  }, []);

  const stages = [
    { code: "01", label: "Parse", color: "#111111" },
    { code: "02", label: "Classify", color: active.classify.color },
    { code: "03", label: "Retrieve · IFRS", color: BLUE },
    { code: "04", label: "Flag", color: active.flag.color },
  ];

  return (
    <div className={`relative overflow-hidden bg-[#fafafa] text-black ${compact ? "" : "min-h-screen"}`}>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 18% 18%, ${active.classify.color}14, transparent 32%), radial-gradient(circle at 82% 78%, ${active.flag.color}10, transparent 32%)`,
        }}
      />

      <div className="relative px-6 py-14 md:px-10 md:py-20">
        <div className="mb-10 max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-black/40">Try it · Live demo</p>
          <h2 className="mt-5 text-4xl font-light leading-[1.04] tracking-[-0.07em] md:text-6xl">
            Drop a journal entry. Watch it get <span style={{ color: BLUE }}>audited</span>.
          </h2>
          <p className="mt-5 max-w-xl text-sm font-light leading-7 text-black/55">
            A toy version of one of the systems below — pick a sample, run the pipeline, and see the model classify it, look up the IFRS reference, and flag any anomalies.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.04)] lg:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/40">Input</p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
              spellCheck={false}
              className="mt-4 w-full resize-none rounded-xl border border-black/10 bg-[#fafafa] p-4 font-mono text-sm leading-6 text-black/80 outline-none transition focus:border-black/30"
              placeholder="Office supplies · $1,240.00 · Vendor: …"
            />

            <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.24em] text-black/35">Try one</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {AUDIT_SAMPLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => run(s)}
                  className={`rounded-full border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition ${
                    active.id === s.id
                      ? "border-black text-black"
                      : "border-black/10 text-black/50 hover:text-black"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

          </div>

          <div className="relative rounded-2xl border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.04)] lg:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/40">Pipeline</p>

            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              {stages.map((stage, i) => {
                const reached = step > i;
                const isCurrent = step === i + 1;
                return (
                  <div key={stage.code}>
                    <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em]">
                      <span style={{ color: reached ? stage.color : "rgba(0,0,0,0.2)" }}>{stage.code}</span>
                      <span className={reached ? "text-black/70" : "text-black/30"}>{stage.label}</span>
                    </div>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-black/[0.06]">
                      <motion.div
                        className="h-full"
                        style={{ backgroundColor: stage.color }}
                        initial={{ width: "0%" }}
                        animate={{ width: reached ? "100%" : isCurrent ? "55%" : "0%" }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 space-y-3">
              <AnimatePresence>
                {step >= 1 && (
                  <motion.div
                    key={`parse-${active.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="rounded-xl border border-black/10 bg-[#fafafa] p-4"
                  >
                    <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-black/35">Parse</p>
                    <div className="mt-2 grid grid-cols-1 gap-1 font-mono text-[11px] leading-5 text-black/65 sm:grid-cols-2">
                      {active.parse.map((line) => (
                        <div key={line}>{line}</div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step >= 2 && (
                  <motion.div
                    key={`classify-${active.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center justify-between rounded-xl border border-black/10 bg-white p-4"
                  >
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-black/35">Classify</p>
                      <p className="mt-1 text-base font-light tracking-[-0.02em]">{active.classify.label}</p>
                    </div>
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: active.classify.color }} />
                  </motion.div>
                )}

                {step >= 3 && (
                  <motion.div
                    key={`ifrs-${active.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="rounded-xl border border-black/10 bg-white p-4"
                  >
                    <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-black/35">Retrieve · IFRS</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em]"
                        style={{ borderColor: BLUE, color: BLUE }}
                      >
                        {active.ifrs.ref}
                      </span>
                      <span className="text-sm font-light text-black/65">{active.ifrs.note}</span>
                    </div>
                  </motion.div>
                )}

                {step >= 4 && (
                  <motion.div
                    key={`flag-${active.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center justify-between rounded-xl border p-4"
                    style={{ borderColor: `${active.flag.color}33`, backgroundColor: `${active.flag.color}0d` }}
                  >
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.24em]" style={{ color: active.flag.color }}>
                        Flag
                      </p>
                      <p className="mt-1 text-sm font-light tracking-[-0.02em] text-black/80">{active.flag.text}</p>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: active.flag.color }}>
                      {active.flag.tone === "ok" ? "✓ Pass" : active.flag.tone === "warn" ? "⚠ Review" : "✗ Critical"}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {step >= 5 && (
            <motion.div
              key={`verdict-${active.id}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 overflow-hidden rounded-2xl border border-black/10 bg-black px-6 py-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
              style={{ borderTop: `3px solid ${active.verdict.color}` }}
            >
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/40">Verdict</p>
                  <p className="mt-1 text-2xl font-light tracking-[-0.03em]">{active.verdict.action}</p>
                </div>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/40">Confidence</p>
                    <p className="mt-1 font-mono text-2xl tabular-nums" style={{ color: active.verdict.color }}>
                      {active.verdict.confidence}%
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/40">Reference</p>
                    <p className="mt-1 font-mono text-sm">{active.ifrs.ref}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CinematicIntroStage({ ending = false }) {
  const projectCards = useMemo(
    () => [
      { code: "01", title: "AI Audit Toolkit", meta: "Accounting AI", color: ACCENT, startX: -760, startY: -280, midX: -285, midY: -138, endX: -385, endY: -196, exitX: -470, exitY: -360, rotate: -13, delay: 1.05 },
      { code: "02", title: "IFRS RAG", meta: "Retrieval", color: BLUE, startX: 800, startY: -245, midX: 285, midY: -96, endX: 372, endY: -152, exitX: 485, exitY: -330, rotate: 10, delay: 1.2 },
      { code: "03", title: "GL Engine", meta: "Reconciliation", color: GREEN, startX: -800, startY: 245, midX: -300, midY: 116, endX: -350, endY: 170, exitX: -500, exitY: 330, rotate: 9, delay: 1.35 },
      { code: "04", title: "Task OS", meta: "Product", color: VIOLET, startX: 790, startY: 275, midX: 300, midY: 128, endX: 350, endY: 188, exitX: 500, exitY: 345, rotate: -9, delay: 1.5 },
      { code: "05", title: "CPA Firm Concept", meta: "Strategy", color: "#111111", startX: 0, startY: 520, midX: 0, midY: 188, endX: 0, endY: 252, exitX: 0, exitY: 430, rotate: 0, delay: 1.65 },
    ],
    []
  );

  const tunnelFrames = useMemo(() => Array.from({ length: 14 }, (_, i) => i), []);
  const finalTags = ["Accounting", "AI", "Systems", "Projects", "Portfolio"];

  return (
    <motion.div className="relative h-screen overflow-hidden bg-[#fbfbf8] text-black" animate={{ opacity: 1, scale: ending ? 1.006 : 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
      <motion.div
        className="absolute inset-0 opacity-[0.52]"
        animate={{ backgroundPosition: ending ? ["0px 0px", "88px 88px"] : ["0px 0px", "44px 44px"] }}
        transition={{ duration: ending ? 0.95 : 18, repeat: ending ? 0 : Infinity, ease: "linear" }}
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.052) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.052) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{ opacity: ending ? 0 : [0.76, 1, 0.84] }}
        transition={{ duration: ending ? 0.7 : 5.5, repeat: ending ? 0 : Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 20% 26%, rgba(255,90,61,0.15), transparent 24%), radial-gradient(circle at 78% 25%, rgba(76,125,255,0.17), transparent 28%), radial-gradient(circle at 52% 78%, rgba(25,169,116,0.11), transparent 26%)",
        }}
      />

      <div className="absolute inset-0 [perspective:1600px]">
        {tunnelFrames.map((frame) => (
          <motion.div
            key={frame}
            className="absolute left-1/2 top-1/2 border border-black/10 bg-white/[0.018] shadow-[0_0_72px_rgba(76,125,255,0.08)]"
            style={{ width: 140 + frame * 82, height: 82 + frame * 48 }}
            initial={{ x: "-50%", y: "-50%", opacity: 0, rotateX: 70, scale: 0.12 }}
            animate={{
              opacity: ending ? 0 : [0, 0.38, 0.22, 0],
              rotateX: [70, 64, 58, 50],
              scale: [0.14 + frame * 0.028, 0.72 + frame * 0.085, 1.58 + frame * 0.12, 2.35 + frame * 0.15],
            }}
            transition={{ duration: 4.15, delay: frame * 0.055, times: [0, 0.34, 0.72, 1], ease: [0.22, 1, 0.36, 1] }}
          />
        ))}

        <motion.div
          className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.68) 24%, rgba(255,255,255,0) 68%)" }}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: ending ? [0.18, 0.82, 0] : [0, 0.9, 0.62, 0.14], scale: ending ? [1.28, 2.1, 2.8] : [0.2, 0.92, 1.26, 1.54] }}
          transition={{ duration: ending ? 0.95 : 4.8, times: ending ? [0, 0.46, 1] : [0, 0.22, 0.62, 1], ease: [0.22, 1, 0.36, 1] }}
        />

        {projectCards.map((card, index) => (
          <motion.div
            key={card.code}
            className="absolute left-1/2 top-1/2 w-[23rem] max-w-[78vw] rounded-[1.45rem] border border-black/10 bg-white/82 p-5 shadow-[0_32px_110px_rgba(0,0,0,0.13)] backdrop-blur-2xl"
            initial={{ x: card.startX, y: card.startY, opacity: 0, scale: 0.55, rotate: card.rotate, rotateY: index % 2 ? -30 : 30 }}
            animate={{
              x: ending ? card.exitX : [card.startX, card.midX, card.endX, card.endX * 0.96],
              y: ending ? card.exitY : [card.startY, card.midY, card.endY, card.endY * 0.96],
              opacity: ending ? 0 : [0, 1, 1, 1],
              scale: ending ? 0.82 : [0.55, 1.08, 0.92, 0.96],
              rotate: ending ? card.rotate * 0.9 : [card.rotate, 0, card.rotate * 0.25, 0],
              rotateY: ending ? 0 : [index % 2 ? -30 : 30, 0, 0, 0],
            }}
            transition={{ duration: ending ? 0.62 : 3.55, delay: ending ? index * 0.035 : card.delay, times: ending ? undefined : [0, 0.46, 0.82, 1], ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: card.color }}>{card.code}</p>
                <h3 className="mt-3 text-2xl font-light leading-none tracking-[-0.055em]">{card.title}</h3>
                <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-black/36">{card.meta}</p>
              </div>
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: card.color }} />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="absolute inset-x-0 top-0 z-20 border-b border-black/10 bg-white/64 px-6 py-5 backdrop-blur-2xl"
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: ending ? -64 : 0, opacity: ending ? 0 : 1 }}
        transition={{ duration: ending ? 0.52 : 0.8, delay: ending ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.26em] text-black/38">
          <span>Ryan Donaldson</span>
          <span>Portfolio opening</span>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 text-center">
        <div className="max-w-5xl">
          <motion.p
            className="font-mono text-[10px] uppercase tracking-[0.34em] text-black/34"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: ending ? 0 : [0, 1, 1], y: ending ? -12 : [12, 0, 0] }}
            transition={{ duration: ending ? 0.42 : 2.75, delay: ending ? 0 : 1.75, ease: [0.22, 1, 0.36, 1] }}
          >
            Ryan Donaldson
          </motion.p>

          <motion.h2
            className="mt-4 text-6xl font-light leading-[0.9] tracking-[-0.1em] md:text-8xl lg:text-[8.5rem]"
            initial={{ opacity: 0, y: 44, scale: 0.86, filter: "blur(16px)" }}
            animate={{
              opacity: ending ? [1, 0.82, 0] : [0, 0, 1, 1],
              y: ending ? [0, -18, -58] : [44, 20, 0, 0],
              scale: ending ? [1.02, 1.18, 1.36] : [0.86, 0.94, 1, 1.02],
              filter: ending ? ["blur(0px)", "blur(2px)", "blur(18px)"] : ["blur(16px)", "blur(9px)", "blur(0px)", "blur(0px)"],
            }}
            transition={{ duration: ending ? 0.85 : 4.15, delay: ending ? 0 : 2.0, times: ending ? [0, 0.5, 1] : [0, 0.24, 0.6, 1], ease: [0.22, 1, 0.36, 1] }}
          >
            Project <span className="text-[#FF5A3D]">Portfolio</span>
          </motion.h2>

          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: ending ? 0 : [0, 1, 1], y: ending ? -16 : [18, 0, 0] }}
            transition={{ duration: ending ? 0.4 : 3.05, delay: ending ? 0 : 2.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {finalTags.map((tag, index) => (
              <span key={tag} className="rounded-full border border-black/10 bg-white/80 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-black/48 backdrop-blur-xl">
                {String(index + 1).padStart(2, "0")} / {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {ending && (
          <motion.div className="pointer-events-none absolute inset-0 z-50 bg-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
            <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 pb-20 pt-28 text-center md:px-10">
              <motion.p className="font-mono text-[10px] uppercase tracking-[0.32em] text-black/35" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}>
                Project <span className="text-[#FF5A3D]">Portfolio</span>
              </motion.p>
              <motion.h1 className="mt-8 max-w-4xl text-5xl font-light leading-[1.06] tracking-[-0.08em] md:text-7xl lg:text-8xl" initial={{ opacity: 0, y: 22, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>
                Building useful things at the edge of <span className="text-[#FF5A3D]">accounting</span> and <span className="text-[#4C7DFF]">AI</span>.
              </motion.h1>
              <motion.p className="mx-auto mt-8 max-w-2xl text-lg font-light leading-8 tracking-[-0.025em] text-black/50" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}>
                A living collection of experiments, prototypes, and showreel projects — not a resume page.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function IntroGate({ onEnter }) {
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);

  const preEnterModules = useMemo(
    () => [
      { code: "01", label: "Audit", color: ACCENT, x: "14%", y: "20%", size: 118, delay: 0 },
      { code: "02", label: "RAG", color: BLUE, x: "74%", y: "23%", size: 92, delay: 0.2 },
      { code: "03", label: "GL", color: GREEN, x: "20%", y: "68%", size: 84, delay: 0.4 },
      { code: "04", label: "OS", color: VIOLET, x: "76%", y: "66%", size: 124, delay: 0.6 },
      { code: "05", label: "Build", color: "#111111", x: "50%", y: "18%", size: 64, delay: 0.8 },
    ],
    []
  );

  const handleEnter = () => {
    setStarting(true);
    window.setTimeout(() => setEnding(true), 5900);
    window.setTimeout(onEnter, 6600);
  };

  return (
    <motion.section className="fixed inset-0 z-[100] bg-white text-black" exit={{ opacity: 0, scale: 1.015, filter: "blur(6px)" }} transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}>
      <AnimatePresence mode="wait">
        {!starting ? (
          <motion.div
            key="intro"
            className="relative flex h-full flex-col items-center justify-center overflow-hidden px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.025, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="absolute inset-0 opacity-[0.48]"
              animate={{ backgroundPosition: ["0px 0px", "44px 44px"] }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundImage: "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />

            <motion.div
              className="absolute inset-0"
              animate={{ opacity: [0.72, 1, 0.72] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background:
                  "radial-gradient(circle at 22% 26%, rgba(255,90,61,0.10), transparent 24%), radial-gradient(circle at 76% 28%, rgba(76,125,255,0.11), transparent 28%), radial-gradient(circle at 50% 78%, rgba(25,169,116,0.08), transparent 26%)",
              }}
            />

            <motion.div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/5" initial={{ opacity: 0, scale: 0.72, rotate: 0 }} animate={{ opacity: [0, 0.72, 0.42], scale: [0.72, 1, 1.06], rotate: 360 }} transition={{ opacity: { duration: 2.2 }, scale: { duration: 7, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 38, repeat: Infinity, ease: "linear" } }} />
            <motion.div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/5" initial={{ opacity: 0, scale: 0.82, rotate: 0 }} animate={{ opacity: [0, 0.58, 0.34], scale: [0.82, 1.08, 0.96], rotate: -360 }} transition={{ opacity: { duration: 2.1, delay: 0.15 }, scale: { duration: 8.5, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 44, repeat: Infinity, ease: "linear" } }} />

            {preEnterModules.map((module, index) => (
              <motion.div
                key={module.code}
                className="absolute grid place-items-center border bg-white/58 text-center shadow-[0_18px_80px_rgba(0,0,0,0.06)] backdrop-blur-xl"
                style={{ left: module.x, top: module.y, width: module.size, height: module.size, borderColor: `${module.color}42` }}
                initial={{ opacity: 0, y: 28, scale: 0.7, rotate: index % 2 ? -8 : 8 }}
                animate={{
                  opacity: 1,
                  y: [0, index % 2 ? 12 : -12, 0],
                  scale: [1, index % 2 ? 1.045 : 0.965, 1],
                  rotate: [0, index % 2 ? -4 : 4, 0],
                  boxShadow: [`0 18px 80px ${module.color}10`, `0 28px 100px ${module.color}20`, `0 18px 80px ${module.color}10`],
                }}
                transition={{
                  opacity: { duration: 0.75, delay: 0.22 + module.delay },
                  y: { duration: 6.2 + index * 0.35, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 6.2 + index * 0.35, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 6.2 + index * 0.35, repeat: Infinity, ease: "easeInOut" },
                  boxShadow: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: module.color }}>{module.code}</p>
                  <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.18em] text-black/36">{module.label}</p>
                </div>
              </motion.div>
            ))}

            <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-50" aria-hidden="true">
              <motion.line x1="14%" y1="20%" x2="50%" y2="50%" stroke="rgba(0,0,0,0.10)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }} />
              <motion.line x1="74%" y1="23%" x2="50%" y2="50%" stroke="rgba(0,0,0,0.10)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 5.6, delay: 0.5, repeat: Infinity, ease: "easeInOut" }} />
              <motion.line x1="20%" y1="68%" x2="50%" y2="50%" stroke="rgba(0,0,0,0.10)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 5.6, delay: 1.0, repeat: Infinity, ease: "easeInOut" }} />
              <motion.line x1="76%" y1="66%" x2="50%" y2="50%" stroke="rgba(0,0,0,0.10)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 5.6, delay: 1.5, repeat: Infinity, ease: "easeInOut" }} />
            </svg>

            <motion.div className="absolute left-0 right-0 top-0 z-10 border-b border-black/10 bg-white/48 px-6 py-5 backdrop-blur-2xl" initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.72, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
              <div className="mx-auto flex max-w-6xl items-center justify-between font-mono text-[10px] uppercase tracking-[0.26em] text-black/36">
                <span>Ryan Donaldson</span>
                <motion.span animate={{ opacity: [0.35, 0.8, 0.35] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>Ready</motion.span>
              </div>
            </motion.div>

            <motion.div className="relative z-20 mb-8 border border-black/10 bg-white/56 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.36em] text-black/40 shadow-[0_20px_80px_rgba(0,0,0,0.06)] backdrop-blur-2xl" initial={{ opacity: 0, y: 10, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.15, duration: 0.7 }}>
              Ryan <span className="text-[#FF5A3D]">Donaldson</span>
            </motion.div>

            <motion.h1 className="relative z-20 max-w-2xl text-5xl font-light leading-[1.08] tracking-[-0.075em] md:text-7xl" initial={{ opacity: 0, y: 18, scale: 0.98, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} transition={{ delay: 0.26, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
              Projects, systems, and <span className="text-[#4C7DFF]">experiments</span>.
            </motion.h1>

            <motion.p className="relative z-20 mt-7 max-w-xl text-sm font-light leading-7 tracking-[-0.02em] text-black/45" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              A compact portfolio interface for accounting, AI workflows, and practical build experiments.
            </motion.p>

            <motion.button type="button" onClick={handleEnter} className="group relative z-20 mt-10 overflow-hidden border border-black bg-black px-6 py-4 font-mono text-[10px] uppercase tracking-[0.24em] text-white shadow-[0_24px_90px_rgba(0,0,0,0.14)] transition hover:-translate-y-0.5 hover:border-[#FF5A3D] hover:bg-[#FF5A3D]" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: [0, -4, 0] }} transition={{ opacity: { delay: 0.7, duration: 0.5 }, y: { delay: 1.1, duration: 2.8, repeat: Infinity, ease: "easeInOut" } }}>
              <motion.span className="absolute inset-y-0 left-[-40%] w-1/3 bg-white/20 blur-sm" animate={{ x: [0, 360] }} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }} />
              <span className="relative inline-flex items-center gap-3">
                Enter <ArrowIcon className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </motion.button>

            <motion.div className="absolute bottom-0 left-0 right-0 z-10 border-t border-black/10 bg-white/52 px-6 py-4 backdrop-blur-2xl" initial={{ y: 70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.75, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}>
              <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-black/34">
                <span><span className="text-[#FF5A3D]">01</span> Accounting AI</span>
                <span><span className="text-[#4C7DFF]">02</span> Retrieval</span>
                <span><span className="text-[#19A974]">03</span> Reconciliation</span>
                <span><span className="text-[#8B5CF6]">04</span> Product</span>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <CinematicIntroStage ending={ending} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function ProjectTile({ title, eyebrow, description, image, index, large = false, accent = ACCENT }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.85, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`group ${large ? "md:col-span-7" : "md:col-span-5"}`}
    >
      <a href="#" className="block text-inherit no-underline">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f1f1f1] md:aspect-[4/5]">
          <div className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.035]" style={{ backgroundImage: `url(${image})` }} />
          <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/[0.05]" />
          <div className="absolute left-4 top-4 h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
        </div>
        <div className="pt-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-black/35">{eyebrow}</p>
          <h3 className="mt-3 text-xl font-normal leading-tight tracking-[-0.04em] text-black md:text-2xl">{title}</h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-black/48">{description}</p>
          <span className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: accent }}>
            View Project <ArrowIcon className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </a>
    </motion.article>
  );
}

function WorkGrid() {
  const projects = [
    {
      title: "AI Audit Toolkit",
      eyebrow: "01 / Accounting AI",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
      description: "A showreel project for GL reconciliation, anomaly detection, IFRS retrieval, and agentic review workflows.",
      large: false,
      accent: ACCENT,
    },
    {
      title: "IFRS RAG Knowledge Base",
      eyebrow: "02 / Retrieval System",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=85",
      description: "A local-answering system concept that forces source-grounded responses from accounting standards instead of generic AI guesses.",
      large: true,
      accent: BLUE,
    },
    {
      title: "GL Reconciliation Engine",
      eyebrow: "03 / Data Workflow",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=85",
      description: "A Python and SQL based project concept for matching transactions, surfacing exceptions, and producing review-ready outputs.",
      large: true,
      accent: GREEN,
    },
    {
      title: "AI Task OS Extension",
      eyebrow: "04 / Product Experiment",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=85",
      description: "A Chrome extension experiment with task recommendations, focus mode, dynamic UI, search overlay, and productivity logic.",
      large: false,
      accent: VIOLET,
    },
    {
      title: "CPA Firm AI Concept",
      eyebrow: "05 / Strategy Prototype",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
      description: "A future-facing project exploring how a small accounting practice could use AI workflows, templates, and repeatable service systems.",
      large: false,
      accent: ACCENT,
    },
  ];

  return (
    <div className="grid gap-x-12 gap-y-24 md:grid-cols-12 md:gap-y-32">
      {projects.map((project, index) => (
        <div key={project.title} className={`${index % 2 === 1 ? "md:mt-28" : ""} ${project.large ? "md:col-span-7" : "md:col-span-5"}`}>
          <ProjectTile {...project} index={index} large={project.large} />
        </div>
      ))}
    </div>
  );
}

export default function RyanDonaldsonProjectPortfolio() {
  const [entered, setEntered] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToId = (id) => (e) => {
    if (e) e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const headerH = 80;
    const sectionPad = parseFloat(window.getComputedStyle(el).paddingTop) || 0;
    const innerPad = el.firstElementChild
      ? parseFloat(window.getComputedStyle(el.firstElementChild).paddingTop) || 0
      : 0;
    const target = el.getBoundingClientRect().top + window.scrollY + sectionPad + innerPad - headerH;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  useEffect(() => {
    if (!entered) return;
    const onKey = (e) => {
      if (e.key !== "Enter") return;
      const t = e.target;
      const tag = (t?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || t?.isContentEditable) return;
      e.preventDefault();
      scrollToTop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entered]);

  return (
    <main className="min-h-screen bg-white font-sans text-black selection:bg-black selection:text-white">
      <AnimatePresence>{!entered && <IntroGate onEnter={() => setEntered(true)} />}</AnimatePresence>

      <header className="fixed left-0 right-0 top-0 z-40 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 md:px-10">
          <NameMark onActivate={scrollToTop} />
          <div className="hidden items-center gap-10 font-mono text-[10px] uppercase tracking-[0.2em] text-black/35 md:flex">
            <NavLink href="#projects" label="Projects" color={ACCENT} onClick={scrollToId("projects")} />
            <NavLink href="#about" label="Index" color={BLUE} onClick={scrollToId("about")} />
            <NavLink href="#contact" label="Contact" color={GREEN} onClick={scrollToId("contact")} />
          </div>
        </nav>
      </header>

      <section id="top" className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 pb-20 pt-28 text-center md:px-10">
        <FadeIn delay={entered ? 0.05 : 1.9}>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-black/35">
            Project <span className="text-[#FF5A3D]">Portfolio</span>
          </p>
        </FadeIn>
        <FadeIn delay={entered ? 0.18 : 2.05}>
          <h1 className="mt-8 max-w-4xl text-5xl font-light leading-[1.06] tracking-[-0.08em] md:text-7xl lg:text-8xl">
            Building useful things at the edge of <span className="text-[#FF5A3D]">accounting</span> and <span className="text-[#4C7DFF]">AI</span>.
          </h1>
        </FadeIn>
        <FadeIn delay={entered ? 0.32 : 2.2}>
          <p className="mx-auto mt-8 max-w-2xl text-lg font-light leading-8 tracking-[-0.025em] text-black/50">
            A living collection of experiments, prototypes, and showreel projects — not a resume page.
          </p>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 md:px-10">
        <ProjectIndexPreview compact />
      </section>

      <section id="projects" className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
        <div className="mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-black/35">Work</p>
            <h2 className="mt-5 max-w-2xl text-5xl font-light leading-[1.02] tracking-[-0.07em] md:text-7xl">
              Selected <span className="text-[#FF5A3D]">projects</span>.
            </h2>
          </div>
          <p className="max-w-sm text-sm font-light leading-6 text-black/45">
            Each project should eventually open into its own case study: the problem, the build, the tools, screenshots, and what it proves.
          </p>
        </div>
        <WorkGrid />
      </section>

      <section id="about" className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 border-y border-black/10 py-16 md:grid-cols-[0.7fr_1.3fr]">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#4C7DFF]">Index</p>
          <div>
            <h2 className="max-w-3xl text-4xl font-light leading-[1.08] tracking-[-0.06em] md:text-6xl">
              The point is to show what I can <span className="text-[#19A974]">build</span>, not just where I have worked.
            </h2>
            <div className="mt-10 grid gap-6 text-sm leading-7 text-black/50 md:grid-cols-3">
              <p><span className="text-[#FF5A3D]">Accounting ideas</span> turned into working tools, models, and repeatable workflows.</p>
              <p><span className="text-[#4C7DFF]">Finance analysis</span> presented through clean interfaces and practical project thinking.</p>
              <p><span className="text-[#8B5CF6]">AI experiments</span> that are small enough to build, but strong enough to show.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#19A974]">Next</p>
          <h2 className="mx-auto mt-6 max-w-3xl text-5xl font-light leading-[1.05] tracking-[-0.075em] md:text-7xl">
            More projects coming as the <span className="text-[#4C7DFF]">toolkit</span> gets built.
          </h2>
          <a href="mailto:ryan@example.com" className="mt-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#FF5A3D] underline underline-offset-4">
            Contact <ArrowIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-6 py-10 font-mono text-[10px] uppercase tracking-[0.18em] text-black/30 md:flex-row md:px-10">
        <p>Ryan Donaldson</p>
        <p>Project Portfolio / <span className="text-[#FF5A3D]">Accounting</span> + <span className="text-[#4C7DFF]">AI</span></p>
      </footer>
    </main>
  );
}
