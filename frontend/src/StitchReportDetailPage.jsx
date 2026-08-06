/**
 * StitchReportDetailPage.jsx
 * Full conversion of scan_report_detail_websec_surakshai_light Stitch screen.
 * Shows: Grade card + Metrics card + Actions card + Finding cards with terminal evidence.
 */
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

/* ── Helpers ─────────────────────────────────────────────────────── */
const GRADE_COLOR = { A: '#059669', B: '#10b981', C: '#b55d00', D: '#ef4444', F: '#ba1a1a' }
const GRADE_LABEL = { A: 'Excellent', B: 'Good', C: 'Fair', D: 'Needs Improvement', F: 'Critical Risk' }

const SEV_COLOR = {
  critical: '#ba1a1a',
  high:     '#b55d00',
  medium:   '#6b38d4',
  low:      '#059669',
  info:     '#767586',
}
const SEV_BG = {
  critical: 'rgba(186,26,26,0.08)',
  high:     'rgba(181,93,0,0.08)',
  medium:   'rgba(107,56,212,0.08)',
  low:      'rgba(16,185,129,0.08)',
  info:     'rgba(118,117,134,0.08)',
}
const SEV_ICON = { critical: 'error', high: 'warning', medium: 'info', low: 'check_circle', info: 'info' }

/* Circular gauge SVG */
function RiskGauge({ score }) {
  const pct = Math.min(100, score ?? 0)
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (pct / 100) * circumference
  const color = pct > 60 ? '#ba1a1a' : pct > 35 ? '#b55d00' : '#059669'
  return (
    <div style={{ position: 'relative', width: 96, height: 96 }}>
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(199,196,215,0.4)" strokeWidth="8" />
        <circle cx="50" cy="50" r="45" fill="none" stroke={color}
          strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="material-symbols-outlined" style={{ color, fontSize: 32 }}>security</span>
      </div>
    </div>
  )
}

/* Terminal evidence block */
function EvidenceBlock({ evidence }) {
  if (!evidence) return null
  return (
    <div className="code-block">
      <div className="code-block-header">
        <div className="code-block-dot" style={{ background: '#ef4444' }} />
        <div className="code-block-dot" style={{ background: '#f59e0b' }} />
        <div className="code-block-dot" style={{ background: '#10b981' }} />
        <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#767586', marginLeft: 8 }}>Evidence</span>
      </div>
      <pre className="code-block-content" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 240, overflowY: 'auto' }}>
        {evidence}
      </pre>
    </div>
  )
}

/* Individual finding card */
function FindingCard({ finding, index, onRemediate }) {
  const [expanded, setExpanded] = useState(index === 0)
  const sev = finding.severity?.toLowerCase() || 'info'
  const color = SEV_COLOR[sev] || '#767586'
  const bg    = SEV_BG[sev]   || 'rgba(118,117,134,0.08)'
  const icon  = SEV_ICON[sev] || 'info'

  return (
    <div
      className="glass-card"
      style={{ overflow: 'hidden', animation: `fade-in-up 0.5s ${index * 60}ms ease forwards`, opacity: 0 }}
    >
      {/* Card header */}
      <div
        style={{
          padding: '16px 24px',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          background: 'rgba(245,242,254,0.6)',
          borderBottom: '1px solid rgba(199,196,215,0.2)',
          cursor: 'pointer',
          position: 'relative',
          paddingLeft: 28,
        }}
        onClick={() => setExpanded(e => !e)}
      >
        {/* Severity accent strip */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: color, borderRadius: '0.75rem 0 0 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 4,
              background: bg, color, fontSize: 10, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              border: `1px solid ${color}30`,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
              {sev}
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#767586' }}>#{String(finding.id || index).padStart(4, '0')}</span>
          </div>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 17, fontWeight: 700, color: '#1b1b23' }}>
            {finding.title}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {onRemediate && (
            <button
              onClick={e => { e.stopPropagation(); onRemediate(finding) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                borderRadius: 8, background: 'rgba(70,72,212,0.08)', color: '#4648d4',
                border: '1px solid rgba(70,72,212,0.15)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>build</span>
              Remediate
            </button>
          )}
          <span className="material-symbols-outlined" style={{ color: '#767586', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            expand_more
          </span>
        </div>
      </div>

      {/* Card body — collapsible */}
      {expanded && (
        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {/* Left: Text info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, color: '#464554', fontSize: 15, lineHeight: 1.6 }}>
            <p>{finding.description}</p>

            {finding.what_it_means && (
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#1b1b23', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#4648d4' }}>visibility</span>
                  What it means
                </h4>
                <p style={{ fontSize: 14, color: '#767586' }}>{finding.what_it_means}</p>
              </div>
            )}

            {finding.remediation && (
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#1b1b23', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#4648d4' }}>healing</span>
                  How to fix it
                </h4>
                <p style={{ fontSize: 14, color: '#767586' }}>{finding.remediation}</p>
              </div>
            )}
          </div>

          {/* Right: Evidence */}
          {finding.evidence && (
            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#1b1b23', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#4648d4' }}>terminal</span>
                Evidence
              </h4>
              <EvidenceBlock evidence={finding.evidence} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Main Component ─────────────────────────────────────────────── */
export default function StitchReportDetailPage({
  scanId,
  onBack,
  getReport,
  getAiRemediation,
  exportJson,
  exportPdf,
}) {
  const [report, setReport]       = useState(null)
  const [loading, setLoading]     = useState(true)
  const [aiAdvice, setAiAdvice]   = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiOpen, setAiOpen]       = useState(false)

  useEffect(() => {
    if (!scanId) return
    setLoading(true)
    getReport(scanId)
      .then(setReport)
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [scanId])

  async function handleAiRemediation() {
    if (!report?.findings?.length) return
    setAiLoading(true); setAiOpen(true)
    try {
      const res = await getAiRemediation(report.findings)
      setAiAdvice(res.ai_advice || 'AI remediation unavailable. Set GEMINI_API_KEY in .env')
    } catch (e) { toast.error(e.message) }
    finally { setAiLoading(false) }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <span className="material-symbols-outlined animate-spin" style={{ fontSize: 36, color: '#4648d4' }}>progress_activity</span>
      </div>
    )
  }

  if (!report) return null

  const grade  = report.risk_grade || report.score_data?.grade || '?'
  const score  = report.risk_score ?? report.score_data?.score ?? 0
  const sev    = report.score_data?.by_severity || {}
  const findings = report.findings || []

  const gradeColor = GRADE_COLOR[grade] || '#767586'
  const gradeLabel = GRADE_LABEL[grade] || 'Unknown'

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 64px)', background: '#fcf8ff', overflow: 'hidden' }}>
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '70vw', height: '70vw', background: 'rgba(228,225,237,0.4)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '40%', left: '-20%', width: '50vw', height: '50vw', background: 'rgba(228,225,237,0.3)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 24px 80px 24px', position: 'relative', zIndex: 1 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, animation: 'fade-in-up 0.4s ease forwards' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
              borderRadius: 8, background: '#fff', border: '1px solid rgba(199,196,215,0.3)',
              color: '#464554', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(70,72,212,0.06)', transition: 'all 0.15s',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
            All Scans
          </button>
          <span style={{ color: '#c7c4d7' }}>/</span>
          <span style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontWeight: 600, color: '#1b1b23', fontSize: 16 }}>
            Reports &amp; Dashboard
          </span>
        </div>

        {/* ── Score Overview Section ── */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 40 }}>
          {/* Grade Card */}
          <div className="glass-card hover-scale" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', animation: 'fade-in-up 0.5s 50ms ease forwards', opacity: 0 }}>
            <div className="shimmer-border" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
            <div style={{ fontSize: 96, fontFamily: "'Plus Jakarta Sans', system-ui", fontWeight: 800, lineHeight: 1, color: gradeColor, letterSpacing: '-0.04em', filter: `drop-shadow(0 4px 16px ${gradeColor}40)` }}>
              {grade}
            </div>
            <div style={{
              marginTop: 12, padding: '6px 16px', borderRadius: 999,
              background: `${gradeColor}15`, color: gradeColor,
              fontSize: 13, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 6,
              border: `1px solid ${gradeColor}20`,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, animation: grade === 'F' || grade === 'D' ? 'pulse 2s infinite' : 'none' }}>
                {['A','B'].includes(grade) ? 'verified' : ['C'].includes(grade) ? 'info' : 'warning'}
              </span>
              {gradeLabel}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: '#767586' }}>
              {report.target} · {report.scan_type}
            </div>
          </div>

          {/* Metrics Card */}
          <div className="glass-card hover-scale" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', animation: 'fade-in-up 0.5s 100ms ease forwards', opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#767586', fontWeight: 700, marginBottom: 4 }}>Overall Risk Score</div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 32, fontWeight: 800, color: '#1b1b23', display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  {score}<span style={{ fontSize: 18, color: '#767586', fontWeight: 600 }}>/100</span>
                </div>
                <div style={{ fontSize: 12, color: '#767586', marginTop: 4 }}>Lower is better</div>
              </div>
              <RiskGauge score={score} />
            </div>

            {/* Severity breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {[['critical','Critical'], ['high','High'], ['medium','Medium'], ['low','Low']].map(([k,label]) => (
                <div key={k} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 4px',
                  borderRadius: 8, background: SEV_BG[k], border: `1px solid ${SEV_COLOR[k]}20`,
                }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 22, fontWeight: 800, color: SEV_COLOR[k] }}>
                    {sev[k] ?? 0}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: SEV_COLOR[k], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Card */}
          <div className="glass-card hover-scale" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center', animation: 'fade-in-up 0.5s 150ms ease forwards', opacity: 0 }}>
            <button
              onClick={handleAiRemediation}
              disabled={aiLoading}
              className="btn-stitch-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px 20px' }}
            >
              {aiLoading
                ? <><span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>progress_activity</span> Generating…</>
                : <><span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>auto_awesome</span> ✦ AI Remediation</>
              }
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <a href={exportPdf(scanId)} download className="btn-stitch-secondary" style={{ justifyContent: 'center', padding: '10px 8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>picture_as_pdf</span>
                Export PDF
              </a>
              <a href={exportJson(scanId)} download className="btn-stitch-secondary" style={{ justifyContent: 'center', padding: '10px 8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>data_object</span>
                Export JSON
              </a>
            </div>
            <div style={{ fontSize: 12, color: '#767586', textAlign: 'center', padding: '4px 0', borderTop: '1px solid rgba(199,196,215,0.3)', paddingTop: 10 }}>
              Scanned: {report.started_at ? new Date(report.started_at).toLocaleString('en-IN') : '—'}
            </div>
          </div>
        </section>

        {/* ── AI Remediation Panel ── */}
        {aiOpen && (
          <div className="glass-card" style={{ padding: '24px', marginBottom: 32, borderLeft: '4px solid #4648d4', animation: 'scale-in 0.3s ease forwards' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span className="material-symbols-outlined" style={{ color: '#4648d4', fontSize: 22, fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontWeight: 700, fontSize: 18, color: '#1b1b23' }}>AI-Generated Remediation Plan</h3>
              <button onClick={() => setAiOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#767586' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {aiLoading
              ? <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#767586' }}>
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: 20 }}>progress_activity</span>
                  Gemini AI is analyzing your findings…
                </div>
              : <pre style={{ whiteSpace: 'pre-wrap', fontSize: 14, color: '#464554', lineHeight: 1.8, fontFamily: 'inherit', margin: 0 }}>{aiAdvice}</pre>
            }
          </div>
        )}

        {/* ── Findings Section ── */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 26, fontWeight: 800, color: '#1b1b23' }}>Findings</h2>
            <span style={{
              padding: '4px 14px', borderRadius: 999,
              background: 'rgba(199,196,215,0.25)', color: '#464554',
              fontSize: 13, fontWeight: 600, border: '1px solid rgba(199,196,215,0.3)',
            }}>
              {findings.length} Total
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(199,196,215,0.4)', marginLeft: 8 }} />
          </div>

          {findings.length === 0 ? (
            <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#10b981', display: 'block', marginBottom: 12, fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <p style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontWeight: 700, fontSize: 18, color: '#1b1b23' }}>No issues found</p>
              <p style={{ color: '#767586', marginTop: 6 }}>Your site's security posture looks excellent!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {findings
                .sort((a, b) => {
                  const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 }
                  return (order[a.severity?.toLowerCase()] ?? 5) - (order[b.severity?.toLowerCase()] ?? 5)
                })
                .map((f, i) => (
                  <FindingCard key={f.id || i} finding={f} index={i} onRemediate={null} />
                ))
              }
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
