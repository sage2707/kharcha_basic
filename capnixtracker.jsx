import { useState, useEffect, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const STORAGE_KEY_APIS = "capnix-api-rows";
const STORAGE_KEY_COMPANIES = "capnix-companies";
const STORAGE_KEY_QUOTES = "capnix-quotes";

const ALL_APIS = [
  // ── DATA APIS ──
  { n:1,  name:"PAN Verification",               layer:"Identity & KYC",         phase:"MVP" },
  { n:2,  name:"Aadhaar eKYC (OTP)",              layer:"Identity & KYC",         phase:"MVP" },
  { n:3,  name:"Aadhaar XML / Offline KYC",       layer:"Identity & KYC",         phase:"MVP" },
  { n:4,  name:"Liveness + Face Match",           layer:"Identity & KYC",         phase:"MVP" },
  { n:5,  name:"OCR — ID Documents",              layer:"Identity & KYC",         phase:"MVP" },
  { n:6,  name:"Director DIN Verification",       layer:"Identity & KYC",         phase:"MVP" },
  { n:7,  name:"CKYC Registry",                   layer:"Identity & KYC",         phase:"Phase 2" },
  { n:8,  name:"Video KYC (V-CIP)",               layer:"Identity & KYC",         phase:"Phase 2" },
  { n:9,  name:"GSTIN Verification",              layer:"Business KYB",           phase:"MVP" },
  { n:10, name:"Udyam Registration Verify",       layer:"Business KYB",           phase:"MVP" },
  { n:11, name:"MCA21 Company Data",              layer:"Business KYB",           phase:"MVP" },
  { n:12, name:"ROC Filings — Annual Returns",    layer:"Business KYB",           phase:"MVP" },
  { n:13, name:"Charge Registration (CHG)",       layer:"Business KYB",           phase:"MVP" },
  { n:14, name:"Shop & Establishment Reg",        layer:"Business KYB",           phase:"Phase 2" },
  { n:15, name:"FSSAI License Verify",            layer:"Business KYB",           phase:"Phase 2" },
  { n:16, name:"Import Export Code (IEC)",        layer:"Business KYB",           phase:"Phase 3" },
  { n:17, name:"GSTR-3B Return History",          layer:"GST & Tax",              phase:"MVP" },
  { n:18, name:"GSTR-1 Sales Data",               layer:"GST & Tax",              phase:"MVP" },
  { n:19, name:"GSTN Annual Turnover",            layer:"GST & Tax",              phase:"MVP" },
  { n:20, name:"ITR Fetch (last 3 yrs)",          layer:"GST & Tax",              phase:"MVP" },
  { n:21, name:"E-Invoice Data (IRN)",            layer:"GST & Tax",              phase:"Phase 2" },
  { n:22, name:"E-Way Bill Data",                 layer:"GST & Tax",              phase:"Phase 2" },
  { n:23, name:"Form 26AS / AIS / TIS",           layer:"GST & Tax",              phase:"Phase 2" },
  { n:24, name:"GST Compliance Score",            layer:"GST & Tax",              phase:"Phase 2" },
  { n:25, name:"CIBIL Commercial (CMR)",          layer:"Credit Bureau",          phase:"MVP" },
  { n:26, name:"CIBIL Consumer — Director 1",     layer:"Credit Bureau",          phase:"MVP" },
  { n:27, name:"CIBIL Consumer — Director 2",     layer:"Credit Bureau",          phase:"MVP" },
  { n:28, name:"Bureau Dedupe Check",             layer:"Credit Bureau",          phase:"MVP" },
  { n:29, name:"DPD History Analysis",            layer:"Credit Bureau",          phase:"MVP" },
  { n:30, name:"CRIF BizCheck",                   layer:"Credit Bureau",          phase:"Phase 2" },
  { n:31, name:"Experian Business Score",         layer:"Credit Bureau",          phase:"Phase 2" },
  { n:32, name:"Equifax Business Report",         layer:"Credit Bureau",          phase:"Phase 3" },
  { n:33, name:"Account Aggregator (AA)",         layer:"Bank & Cash Flow",       phase:"MVP" },
  { n:34, name:"Bank Statement Parser (PDF)",     layer:"Bank & Cash Flow",       phase:"MVP" },
  { n:35, name:"Bank Statement Analyser (AI)",    layer:"Bank & Cash Flow",       phase:"MVP" },
  { n:36, name:"Cash Flow Analysis Engine",       layer:"Bank & Cash Flow",       phase:"Phase 2" },
  { n:37, name:"Current Account Turnover",        layer:"Bank & Cash Flow",       phase:"MVP" },
  { n:38, name:"UPI Transaction History",         layer:"Bank & Cash Flow",       phase:"Phase 2" },
  { n:39, name:"CERSAI NPA Check",               layer:"Legal & Compliance",     phase:"MVP" },
  { n:40, name:"Court Records / Litigation",      layer:"Legal & Compliance",     phase:"MVP" },
  { n:41, name:"NCLT / Insolvency Records",       layer:"Legal & Compliance",     phase:"MVP" },
  { n:42, name:"GST Blacklist Check",             layer:"Legal & Compliance",     phase:"MVP" },
  { n:43, name:"Wilful Defaulter (RBI)",          layer:"Legal & Compliance",     phase:"MVP" },
  { n:44, name:"EPFO Compliance Check",           layer:"Legal & Compliance",     phase:"Phase 2" },
  { n:45, name:"ESIC Compliance",                 layer:"Legal & Compliance",     phase:"Phase 2" },
  { n:46, name:"Pollution Control NOC",           layer:"Legal & Compliance",     phase:"Phase 3" },
  { n:47, name:"Property Encumbrance (CERSAI)",   layer:"Assets & Property",      phase:"Phase 2" },
  { n:48, name:"Land Records (Bhoomi/7-12)",      layer:"Assets & Property",      phase:"Phase 2" },
  { n:49, name:"Vehicle Registration (RC)",       layer:"Assets & Property",      phase:"Phase 2" },
  { n:50, name:"Charge Satisfaction Search",      layer:"Assets & Property",      phase:"Phase 2" },
  { n:51, name:"GeM Seller Performance",          layer:"Alternate Data",         phase:"Phase 2" },
  { n:52, name:"Electricity Bill Payment",        layer:"Alternate Data",         phase:"Phase 2" },
  { n:53, name:"News & Social Media Scan",        layer:"Alternate Data",         phase:"Phase 2" },
  { n:54, name:"TReDS Invoice History",           layer:"Alternate Data",         phase:"Phase 3" },
  { n:55, name:"Balance Sheet Parser (AI)",       layer:"Documents & Financial",  phase:"MVP" },
  { n:56, name:"P&L Statement Analyser",          layer:"Documents & Financial",  phase:"MVP" },
  { n:57, name:"ITR Analyser",                    layer:"Documents & Financial",  phase:"MVP" },
  { n:58, name:"GST Return Analyser",             layer:"Documents & Financial",  phase:"Phase 2" },
  { n:59, name:"Financial Statement Fraud Check", layer:"Documents & Financial",  phase:"Phase 2" },
  { n:60, name:"DigiLocker Document Fetch",       layer:"Documents & Financial",  phase:"MVP" },
  { n:61, name:"eStamp / eSign",                  layer:"Documents & Financial",  phase:"Phase 2" },
  // ── PLATFORM APIS ──
  { n:62, name:"SMS + Email + WhatsApp (MSG91)",  layer:"Platform — Comms",       phase:"MVP" },
  { n:63, name:"Payment Gateway (Razorpay)",      layer:"Platform — Payments",    phase:"MVP" },
  { n:64, name:"Penny Drop + Payouts (Razorpay X)",layer:"Platform — Payments",  phase:"MVP" },
  { n:65, name:"Document Storage (AWS S3 + KMS)", layer:"Platform — Infra",       phase:"MVP" },
  { n:66, name:"Async Job Queue (SQS / BullMQ)",  layer:"Platform — Infra",       phase:"MVP" },
  { n:67, name:"API Gateway + Rate Limiter",      layer:"Platform — Infra",       phase:"MVP" },
  { n:68, name:"User Auth (Firebase / Auth0)",    layer:"Platform — Infra",       phase:"MVP" },
  { n:69, name:"Error Monitoring (Sentry)",       layer:"Platform — Infra",       phase:"MVP" },
  { n:70, name:"Audit Logging (CloudWatch)",      layer:"Platform — Infra",       phase:"MVP" },
  { n:71, name:"Post-Disbursal NPA Monitor",      layer:"Platform — Lending",     phase:"Phase 3" },
];

const LAYERS = [...new Set(ALL_APIS.map(a => a.layer))];
const PHASES = ["MVP", "Phase 2", "Phase 3"];
const STATUSES = ["Not Started", "Contacted", "Quote Received", "Negotiating", "Signed", "Rejected"];

const STATUS_COLORS = {
  "Not Started":   { bg: "#1e2535", text: "#4B5A6E", dot: "#4B5A6E" },
  "Contacted":     { bg: "#0d2244", text: "#60a5fa", dot: "#3b82f6" },
  "Quote Received":{ bg: "#1a1040", text: "#a78bfa", dot: "#8b5cf6" },
  "Negotiating":   { bg: "#2a1a00", text: "#fbbf24", dot: "#f59e0b" },
  "Signed":        { bg: "#002a1a", text: "#34d399", dot: "#10b981" },
  "Rejected":      { bg: "#2a0a0a", text: "#f87171", dot: "#ef4444" },
};

const PHASE_COLORS = {
  "MVP":     { bg: "#2a0a0a", text: "#fca5a5" },
  "Phase 2": { bg: "#2a1a00", text: "#fde68a" },
  "Phase 3": { bg: "#002a14", text: "#6ee7b7" },
};

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────
async function storageGet(key) {
  try {
    const r = await window.storage.get(key);
    return r ? JSON.parse(r.value) : null;
  } catch { return null; }
}
async function storageSet(key, val) {
  try { await window.storage.set(key, JSON.stringify(val)); return true; }
  catch { return false; }
}

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────
function Badge({ label, type = "status" }) {
  const colors = type === "phase" ? PHASE_COLORS[label] : STATUS_COLORS[label];
  if (!colors) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 9px", borderRadius: 20, fontSize: 10, fontWeight: 600,
      background: colors.bg, color: colors.text, whiteSpace: "nowrap",
      letterSpacing: "0.04em", textTransform: "uppercase"
    }}>
      {type === "status" && <span style={{ width: 5, height: 5, borderRadius: "50%", background: colors.dot, flexShrink: 0 }} />}
      {label}
    </span>
  );
}

function SaveToast({ visible }) {
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 999,
      background: "#10b981", color: "#fff", padding: "10px 20px",
      borderRadius: 10, fontSize: 13, fontWeight: 600,
      boxShadow: "0 4px 24px rgba(16,185,129,0.4)",
      transform: visible ? "translateY(0)" : "translateY(80px)",
      opacity: visible ? 1 : 0, transition: "all 0.3s ease",
      pointerEvents: "none"
    }}>
      ✓ Saved successfully
    </div>
  );
}

function Input({ value, onChange, placeholder, mono, style = {} }) {
  return (
    <input
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        background: "#0d1526", border: "1px solid #1e2d45",
        borderRadius: 6, color: "#e2e8f0", padding: "5px 9px",
        fontSize: 11, outline: "none", width: "100%",
        fontFamily: mono ? "'DM Mono', monospace" : "inherit",
        ...style
      }}
    />
  );
}

function Select({ value, onChange, options, style = {} }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: "#0d1526", border: "1px solid #1e2d45",
        borderRadius: 6, color: "#94a3b8", padding: "5px 8px",
        fontSize: 11, outline: "none", cursor: "pointer", ...style
      }}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ─── API PAGE ─────────────────────────────────────────────────────────────────
function ApiPage({ apiRows, setApiRows, onSave }) {
  const [search, setSearch] = useState("");
  const [filterLayer, setFilterLayer] = useState("");
  const [filterPhase, setFilterPhase] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const update = (n, field, val) => {
    setApiRows(prev => ({ ...prev, [n]: { ...(prev[n] || {}), [field]: val } }));
  };

  const filtered = ALL_APIS.filter(a => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterLayer && a.layer !== filterLayer) return false;
    if (filterPhase && a.phase !== filterPhase) return false;
    if (filterStatus) {
      const status = (apiRows[a.n]?.status) || "Not Started";
      if (status !== filterStatus) return false;
    }
    return true;
  });

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = ALL_APIS.filter(a => (apiRows[a.n]?.status || "Not Started") === s).length;
    return acc;
  }, {});

  const mvpDone = ALL_APIS.filter(a => a.phase === "MVP" && (apiRows[a.n]?.status) === "Signed").length;
  const mvpTotal = ALL_APIS.filter(a => a.phase === "MVP").length;

  let currentLayer = null;

  return (
    <div style={{ padding: "20px 24px" }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { val: 71, label: "Total APIs", color: "#e2e8f0" },
          { val: counts["Signed"], label: "Signed", color: "#10b981" },
          { val: counts["Quote Received"] + counts["Negotiating"], label: "In Progress", color: "#f59e0b" },
          { val: counts["Contacted"], label: "Contacted", color: "#3b82f6" },
          { val: `${mvpDone}/${mvpTotal}`, label: "MVP Signed", color: "#8b5cf6" },
        ].map(s => (
          <div key={s.label} style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'DM Mono',monospace", color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="⌕  Search APIs…"
          style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 8, color: "#e2e8f0", padding: "7px 14px", fontSize: 12, outline: "none", flex: 1, minWidth: 180, fontFamily: "inherit" }}
        />
        <Select value={filterLayer} onChange={setFilterLayer} options={["All Layers", ...LAYERS]} />
        <Select value={filterPhase} onChange={setFilterPhase} options={["All Phases", ...PHASES]} />
        <Select value={filterStatus} onChange={setFilterStatus} options={["All Status", ...STATUSES]} />
        <button onClick={onSave} style={{ background: "#3b82f6", border: "none", borderRadius: 8, color: "#fff", padding: "7px 18px", fontSize: 12, fontWeight: 600, cursor: "pointer", marginLeft: "auto" }}>
          💾 Save
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#0d1526" }}>
              {["#", "API Name", "Phase", "Vendor / Provider", "Price (₹/call)", "Status", "Notes"].map(h => (
                <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#4b5a6e", textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1px solid #1e2d45", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => {
              const showLayer = a.layer !== currentLayer;
              currentLayer = a.layer;
              const d = apiRows[a.n] || {};
              return [
                showLayer && (
                  <tr key={`layer-${a.layer}`} style={{ background: "#0f1929" }}>
                    <td colSpan={7} style={{ padding: "6px 14px", fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "1px solid #1e2d45" }}>
                      {a.layer}
                    </td>
                  </tr>
                ),
                <tr key={a.n} style={{ borderBottom: "1px solid #1a2538" }}>
                  <td style={{ padding: "9px 14px", color: "#4b5a6e", fontFamily: "'DM Mono',monospace", fontSize: 11 }}>{a.n}</td>
                  <td style={{ padding: "9px 14px", fontWeight: 500, color: "#e2e8f0" }}>{a.name}</td>
                  <td style={{ padding: "9px 14px" }}><Badge label={a.phase} type="phase" /></td>
                  <td style={{ padding: "9px 14px", minWidth: 140 }}>
                    <Input value={d.vendor} onChange={v => update(a.n, "vendor", v)} placeholder="e.g. Perfios" />
                  </td>
                  <td style={{ padding: "9px 14px", minWidth: 100 }}>
                    <Input value={d.price} onChange={v => update(a.n, "price", v)} placeholder="₹ —" mono style={{ width: 90 }} />
                  </td>
                  <td style={{ padding: "9px 14px", minWidth: 130 }}>
                    <Select value={d.status || "Not Started"} onChange={v => update(a.n, "status", v)} options={STATUSES} />
                  </td>
                  <td style={{ padding: "9px 14px", minWidth: 150 }}>
                    <Input value={d.notes} onChange={v => update(a.n, "notes", v)} placeholder="Notes…" />
                  </td>
                </tr>
              ];
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "#4b5a6e" }}>No APIs match your filters</div>
        )}
      </div>
    </div>
  );
}

// ─── COMPANY PAGE ─────────────────────────────────────────────────────────────
function CompanyPage({ companies, setCompanies, onSave }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [showQuoteForm, setShowQuoteForm] = useState(null);
  const [quoteForm, setQuoteForm] = useState({});

  const openAdd = () => {
    setEditId(null);
    setForm({ status: "Not Started" });
    setShowForm(true);
  };
  const openEdit = (c) => {
    setEditId(c.id);
    setForm({ ...c });
    setShowForm(true);
  };
  const saveForm = () => {
    if (!form.name?.trim()) return alert("Company name required");
    if (editId) {
      setCompanies(prev => prev.map(c => c.id === editId ? { ...c, ...form } : c));
    } else {
      setCompanies(prev => [...prev, { ...form, id: Date.now().toString(), quotes: [] }]);
    }
    setShowForm(false);
  };
  const deleteCompany = (id) => {
    if (confirm("Delete this company?")) setCompanies(prev => prev.filter(c => c.id !== id));
  };
  const openAddQuote = (id) => {
    setShowQuoteForm(id);
    setQuoteForm({ api: "", price: "", validTill: "", note: "" });
  };
  const saveQuote = (cid) => {
    setCompanies(prev => prev.map(c => c.id === cid
      ? { ...c, quotes: [...(c.quotes || []), { ...quoteForm, id: Date.now().toString() }] }
      : c
    ));
    setShowQuoteForm(null);
  };
  const deleteQuote = (cid, qid) => {
    setCompanies(prev => prev.map(c => c.id === cid
      ? { ...c, quotes: c.quotes.filter(q => q.id !== qid) }
      : c
    ));
  };

  const filtered = companies.filter(c => {
    if (search && !c.name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus && c.status !== filterStatus) return false;
    return true;
  });

  const counts = STATUSES.reduce((acc, s) => { acc[s] = companies.filter(c => c.status === s).length; return acc; }, {});

  const F = ({ label, field, placeholder, type = "text" }) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 4, fontWeight: 500 }}>{label}</label>
      {field === "status" ? (
        <select value={form[field] || "Not Started"} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
          style={{ width: "100%", background: "#0d1526", border: "1px solid #1e2d45", borderRadius: 7, color: "#e2e8f0", padding: "8px 12px", fontSize: 12, outline: "none" }}>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      ) : field === "notes" ? (
        <textarea value={form[field] || ""} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} placeholder={placeholder}
          style={{ width: "100%", background: "#0d1526", border: "1px solid #1e2d45", borderRadius: 7, color: "#e2e8f0", padding: "8px 12px", fontSize: 12, outline: "none", resize: "vertical", minHeight: 70, fontFamily: "inherit" }} />
      ) : (
        <input type={type} value={form[field] || ""} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} placeholder={placeholder}
          style={{ width: "100%", background: "#0d1526", border: "1px solid #1e2d45", borderRadius: 7, color: "#e2e8f0", padding: "8px 12px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
      )}
    </div>
  );

  return (
    <div style={{ padding: "20px 24px" }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { val: companies.length, label: "Total", color: "#e2e8f0" },
          { val: counts["Signed"] || 0, label: "Signed", color: "#10b981" },
          { val: counts["Negotiating"] || 0, label: "Negotiating", color: "#f59e0b" },
          { val: counts["Quote Received"] || 0, label: "Quoted", color: "#8b5cf6" },
          { val: counts["Contacted"] || 0, label: "Contacted", color: "#3b82f6" },
          { val: counts["Not Started"] || 0, label: "Not Started", color: "#4b5a6e" },
        ].map(s => (
          <div key={s.label} style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 10, padding: "10px 14px" }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'DM Mono',monospace", color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="⌕  Search companies…"
          style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 8, color: "#e2e8f0", padding: "7px 14px", fontSize: 12, outline: "none", flex: 1, minWidth: 180, fontFamily: "inherit" }} />
        <Select value={filterStatus} onChange={setFilterStatus} options={["All Status", ...STATUSES]} />
        <button onClick={openAdd} style={{ background: "#3b82f6", border: "none", borderRadius: 8, color: "#fff", padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          + Add Company
        </button>
        <button onClick={onSave} style={{ background: "#0d2244", border: "1px solid #3b82f6", borderRadius: 8, color: "#60a5fa", padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          💾 Save
        </button>
      </div>

      {/* Company Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 12 }}>
        {filtered.map(c => {
          const sc = STATUS_COLORS[c.status] || STATUS_COLORS["Not Started"];
          const bestPrice = c.quotes?.length ? Math.min(...c.quotes.map(q => parseFloat(q.price) || Infinity)) : null;
          return (
            <div key={c.id} style={{ background: "#111827", border: `1px solid ${sc.dot}33`, borderRadius: 12, padding: 16 }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{c.category}</div>
                </div>
                <Badge label={c.status} />
              </div>

              {/* Status bar */}
              <div style={{ height: 3, borderRadius: 2, background: sc.dot, opacity: 0.5, marginBottom: 12 }} />

              {/* Contact info */}
              {c.contactPerson && <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3 }}>👤 {c.contactPerson}</div>}
              {c.email && <div style={{ fontSize: 11, color: "#60a5fa", fontFamily: "'DM Mono',monospace", marginBottom: 3 }}>✉ {c.email}</div>}
              {c.phone && <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'DM Mono',monospace", marginBottom: 3 }}>📞 {c.phone}</div>}
              {c.followUp && <div style={{ fontSize: 11, color: "#fbbf24", marginBottom: 3 }}>📅 Follow-up: {c.followUp}</div>}
              {c.notes && (
                <div style={{ background: "#0d1526", borderRadius: 7, padding: "8px 10px", fontSize: 11, color: "#94a3b8", lineHeight: 1.5, margin: "8px 0" }}>
                  {c.notes}
                </div>
              )}

              {/* Quotes Section */}
              <div style={{ background: "#0d1526", borderRadius: 8, padding: 10, marginTop: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: "#4b5a6e", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                    💰 Quotes {c.quotes?.length ? `(${c.quotes.length})` : ""}
                    {bestPrice && isFinite(bestPrice) && <span style={{ color: "#10b981", marginLeft: 8, fontFamily: "'DM Mono',monospace" }}>Best: ₹{bestPrice}/call</span>}
                  </div>
                  <button onClick={() => openAddQuote(c.id)} style={{ background: "none", border: "1px dashed #1e2d45", borderRadius: 5, color: "#4b5a6e", padding: "2px 8px", fontSize: 10, cursor: "pointer" }}>
                    + Add Quote
                  </button>
                </div>

                {/* Quote Add Form */}
                {showQuoteForm === c.id && (
                  <div style={{ background: "#111827", borderRadius: 8, padding: 10, marginBottom: 8, border: "1px solid #1e2d45" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 90px", gap: 6, marginBottom: 6 }}>
                      <input value={quoteForm.api} onChange={e => setQuoteForm(p => ({ ...p, api: e.target.value }))} placeholder="API name"
                        style={{ background: "#0d1526", border: "1px solid #1e2d45", borderRadius: 5, color: "#e2e8f0", padding: "5px 8px", fontSize: 11, outline: "none", fontFamily: "inherit" }} />
                      <input value={quoteForm.price} onChange={e => setQuoteForm(p => ({ ...p, price: e.target.value }))} placeholder="₹/call"
                        style={{ background: "#0d1526", border: "1px solid #1e2d45", borderRadius: 5, color: "#10b981", padding: "5px 8px", fontSize: 11, outline: "none", fontFamily: "'DM Mono',monospace" }} />
                      <input type="date" value={quoteForm.validTill} onChange={e => setQuoteForm(p => ({ ...p, validTill: e.target.value }))}
                        style={{ background: "#0d1526", border: "1px solid #1e2d45", borderRadius: 5, color: "#94a3b8", padding: "5px 8px", fontSize: 11, outline: "none", colorScheme: "dark" }} />
                    </div>
                    <input value={quoteForm.note} onChange={e => setQuoteForm(p => ({ ...p, note: e.target.value }))} placeholder="Note (optional)"
                      style={{ width: "100%", background: "#0d1526", border: "1px solid #1e2d45", borderRadius: 5, color: "#94a3b8", padding: "5px 8px", fontSize: 11, outline: "none", marginBottom: 6, fontFamily: "inherit", boxSizing: "border-box" }} />
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => saveQuote(c.id)} style={{ background: "#10b981", border: "none", borderRadius: 5, color: "#fff", padding: "4px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Save</button>
                      <button onClick={() => setShowQuoteForm(null)} style={{ background: "none", border: "1px solid #1e2d45", borderRadius: 5, color: "#64748b", padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                )}

                {/* Quote list */}
                {c.quotes?.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 70px 80px auto", gap: 4, fontSize: 10, color: "#4b5a6e", marginBottom: 4, padding: "0 2px" }}>
                    <span>API</span><span style={{ textAlign: "right" }}>₹/call</span><span>Valid Till</span><span></span>
                  </div>
                ) : (
                  <div style={{ fontSize: 11, color: "#374151", textAlign: "center", padding: "6px 0" }}>No quotes yet</div>
                )}
                {c.quotes?.map(q => (
                  <div key={q.id} style={{ display: "grid", gridTemplateColumns: "1fr 70px 80px auto", gap: 4, alignItems: "center", padding: "4px 2px", borderTop: "1px solid #1a2538" }}>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{q.api}</span>
                    <span style={{ fontSize: 11, color: "#10b981", fontFamily: "'DM Mono',monospace", textAlign: "right" }}>₹{q.price}</span>
                    <span style={{ fontSize: 10, color: "#64748b" }}>{q.validTill || "—"}</span>
                    <button onClick={() => deleteQuote(c.id, q.id)} style={{ background: "none", border: "none", color: "#374151", cursor: "pointer", fontSize: 12, padding: "0 4px" }}>✕</button>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                <button onClick={() => openEdit(c)} style={{ flex: 1, background: "#0d1526", border: "1px solid #1e2d45", borderRadius: 7, color: "#94a3b8", padding: "5px 10px", fontSize: 11, cursor: "pointer" }}>✏ Edit</button>
                {c.website && <button onClick={() => window.open(c.website, "_blank")} style={{ background: "#0d1526", border: "1px solid #1e2d45", borderRadius: 7, color: "#94a3b8", padding: "5px 10px", fontSize: 11, cursor: "pointer" }}>🔗</button>}
                <button onClick={() => deleteCompany(c.id)} style={{ background: "#2a0a0a", border: "1px solid #ef444433", borderRadius: 7, color: "#f87171", padding: "5px 10px", fontSize: 11, cursor: "pointer" }}>🗑</button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 48, color: "#4b5a6e" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🏢</div>
            No companies found
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div onClick={e => e.target === e.currentTarget && setShowForm(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 14, padding: 24, width: "90%", maxWidth: 520, maxHeight: "88vh", overflowY: "auto" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", marginBottom: 18 }}>{editId ? "Edit Company" : "Add Company"}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
              <F label="Company Name *" field="name" placeholder="e.g. Gridlines" />
              <F label="Category" field="category" placeholder="e.g. KYC / Identity" />
              <F label="Contact Person" field="contactPerson" placeholder="Name" />
              <F label="Email" field="email" placeholder="email@company.com" />
              <F label="Phone" field="phone" placeholder="+91 …" />
              <F label="Website" field="website" placeholder="https://…" />
            </div>
            <F label="Status" field="status" />
            <F label="APIs They Cover" field="apis" placeholder="PAN Verification, GSTIN…" />
            <F label="Notes / Last Interaction" field="notes" placeholder="e.g. Sent email on 20 May. Awaiting pricing…" />
            <F label="Next Follow-up Date" field="followUp" type="date" />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 6 }}>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "1px solid #1e2d45", borderRadius: 8, color: "#64748b", padding: "7px 16px", fontSize: 12, cursor: "pointer" }}>Cancel</button>
              <button onClick={saveForm} style={{ background: "#3b82f6", border: "none", borderRadius: 8, color: "#fff", padding: "7px 18px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({ apiRows, companies }) {
  const mvpApis = ALL_APIS.filter(a => a.phase === "MVP");
  const allQuotes = companies.flatMap(c => (c.quotes || []).map(q => ({ ...q, company: c.name })));
  const pipeline = STATUSES.filter(s => s !== "Not Started").map(s => ({ status: s, cos: companies.filter(c => c.status === s) })).filter(s => s.cos.length > 0);

  return (
    <div style={{ padding: "20px 24px" }}>
      {/* Top Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { val: `${ALL_APIS.filter(a => apiRows[a.n]?.status === "Signed").length}/71`, label: "APIs Signed", color: "#10b981" },
          { val: `${mvpApis.filter(a => apiRows[a.n]?.status === "Signed").length}/${mvpApis.length}`, label: "MVP Signed", color: "#f59e0b" },
          { val: companies.filter(c => c.status === "Signed").length, label: "Vendors Contracted", color: "#3b82f6" },
          { val: allQuotes.length, label: "Quotes Received", color: "#8b5cf6" },
        ].map(s => (
          <div key={s.label} style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'DM Mono',monospace", color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        {/* MVP Status */}
        <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "#4b5a6e", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #1e2d45", background: "#0d1526" }}>
            MVP APIs — Sign-off
          </div>
          <div style={{ padding: "0 14px", maxHeight: 320, overflowY: "auto" }}>
            {mvpApis.map(a => {
              const d = apiRows[a.n] || {};
              return (
                <div key={a.n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #1a2538" }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#e2e8f0" }}>{a.name}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {d.price && <span style={{ fontSize: 10, color: "#10b981", fontFamily: "'DM Mono',monospace" }}>₹{d.price}</span>}
                    <Badge label={d.status || "Not Started"} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pipeline */}
        <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "#4b5a6e", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #1e2d45", background: "#0d1526" }}>
            Company Pipeline
          </div>
          <div style={{ padding: "12px 14px" }}>
            {pipeline.length === 0 && <div style={{ color: "#4b5a6e", fontSize: 12 }}>No companies added yet</div>}
            {pipeline.map(p => (
              <div key={p.status} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: "#4b5a6e", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.07em", display: "flex", alignItems: "center", gap: 6 }}>
                  <Badge label={p.status} /> <span>{p.cos.length}</span>
                </div>
                {p.cos.map(c => <div key={c.id} style={{ fontSize: 12, fontWeight: 500, color: "#94a3b8", paddingLeft: 12, paddingBottom: 3 }}>{c.name}</div>)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Quotes */}
      <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "#4b5a6e", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #1e2d45", background: "#0d1526" }}>
          All Quotes Received
        </div>
        {allQuotes.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "#4b5a6e", fontSize: 12 }}>No quotes yet — add them in Company Tracker</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#0d1526" }}>
                {["Company", "API", "₹/call", "Valid Till", "Note"].map(h => (
                  <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 10, color: "#4b5a6e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1px solid #1e2d45" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allQuotes.map((q, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1a2538" }}>
                  <td style={{ padding: "8px 14px", fontWeight: 600, color: "#e2e8f0" }}>{q.company}</td>
                  <td style={{ padding: "8px 14px", color: "#94a3b8" }}>{q.api}</td>
                  <td style={{ padding: "8px 14px", color: "#10b981", fontFamily: "'DM Mono',monospace", fontWeight: 600 }}>₹{q.price}</td>
                  <td style={{ padding: "8px 14px", color: "#64748b" }}>{q.validTill || "—"}</td>
                  <td style={{ padding: "8px 14px", color: "#64748b", fontSize: 11 }}>{q.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("apis");
  const [apiRows, setApiRows] = useState({});
  const [companies, setCompanies] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const savedApis = await storageGet(STORAGE_KEY_APIS);
      const savedCos = await storageGet(STORAGE_KEY_COMPANIES);
      if (savedApis) setApiRows(savedApis);
      if (savedCos) setCompanies(savedCos);
      setLoaded(true);
    })();
  }, []);

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    await storageSet(STORAGE_KEY_APIS, apiRows);
    await storageSet(STORAGE_KEY_COMPANIES, companies);
    setSaving(false);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  }, [apiRows, companies, saving]);

  if (!loaded) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0B0F1A", color: "#4b5a6e", fontSize: 14, fontFamily: "'DM Mono',monospace" }}>
      Loading…
    </div>
  );

  const navItems = [
    { id: "apis", icon: "🔌", label: "API Central", count: `${ALL_APIS.length} APIs` },
    { id: "companies", icon: "🏢", label: "Company Tracker", count: `${companies.length} companies` },
    { id: "dashboard", icon: "📊", label: "Dashboard" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0B0F1A", fontFamily: "'Sora', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* NAV */}
      <div style={{ display: "flex", alignItems: "center", height: 52, background: "#0d1526", borderBottom: "1px solid #1e2d45", padding: "0 24px", position: "sticky", top: 0, zIndex: 100, gap: 4 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#3b82f6", letterSpacing: "-0.5px", marginRight: 20 }}>
          CAPNIX <span style={{ color: "#4b5a6e", fontWeight: 300 }}>Tracker</span>
        </div>
        {navItems.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)}
            style={{ padding: "5px 14px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: "inherit", transition: "all .15s",
              background: page === n.id ? "#3b82f6" : "none", color: page === n.id ? "#fff" : "#64748b" }}>
            {n.icon} {n.label}
          </button>
        ))}
        <div style={{ marginLeft: "auto", fontSize: 11, color: "#374151", fontFamily: "'DM Mono',monospace" }}>
          {navItems.find(n => n.id === page)?.count}
        </div>
        <button onClick={handleSave} disabled={saving}
          style={{ marginLeft: 12, background: saving ? "#1e3a5f" : "#1e3a5f", border: "1px solid #3b82f6", borderRadius: 8, color: "#60a5fa", padding: "5px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>
          {saving ? "Saving…" : "💾 Save"}
        </button>
      </div>

      {/* PAGES */}
      {page === "apis" && <ApiPage apiRows={apiRows} setApiRows={setApiRows} onSave={handleSave} />}
      {page === "companies" && <CompanyPage companies={companies} setCompanies={setCompanies} onSave={handleSave} />}
      {page === "dashboard" && <DashboardPage apiRows={apiRows} companies={companies} />}

      <SaveToast visible={toast} />
    </div>
  );
}
