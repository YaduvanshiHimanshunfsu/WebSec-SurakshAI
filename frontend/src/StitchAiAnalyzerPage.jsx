/**
 * StitchAiAnalyzerPage.jsx
 * Full conversion of ai_scam_analyzer + scam_detected Stitch screens.
 * Unified card with URL/Message/Email tabs → shows result inline.
 */
import { useState } from 'react'
import { toast } from 'react-hot-toast'

/* ── Confidence Ring ──────────────────────────────────────────── */
function ConfidenceRing({ pct, color }) {
  const r = 15.9155
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(100, pct) / 100) * circ
  return (
    <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
      <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3.5" />
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round"
          strokeDasharray={`${Math.min(100, pct)}, 100`}
          style={{ animation: 'dash 1.5s ease-out forwards' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'white', fontWeight: 800, fontSize: 16, fontFamily: "'Plus Jakarta Sans', system-ui" }}>{pct}%</span>
      </div>
    </div>
  )
}

/* ── Verdict Result Panel ─────────────────────────────────────── */
function VerdictPanel({ result, mode, onReset }) {
  const verdict   = result?.verdict || result?.risk_level || 'UNKNOWN'
  const isScam    = ['SCAM', 'CRITICAL', 'HIGH'].includes(verdict)
  const isSusp    = verdict === 'SUSPICIOUS' || verdict === 'MEDIUM'
  const isSafe    = ['SAFE', 'LOW', 'NONE'].includes(verdict)
  const confidence = result?.confidence ?? result?.score ?? 0
  const flags     = result?.red_flags || result?.flags || []
  const summary   = result?.summary || result?.ai_note || ''
  const hindiSummary = result?.hindi_summary || ''

  const VERDICT_MAP = {
    SCAM:       { bg: '#ba1a1a', label: 'Likely Scam Detected',     icon: 'gpp_bad',       pill: 'High Severity' },
    CRITICAL:   { bg: '#ba1a1a', label: 'Critical Risk Detected',    icon: 'gpp_bad',       pill: 'Critical'      },
    HIGH:       { bg: '#b55d00', label: 'High Risk Detected',        icon: 'warning',       pill: 'High Risk'     },
    SUSPICIOUS: { bg: '#b55d00', label: 'Suspicious — Verify First', icon: 'search_check',  pill: 'Medium Risk'   },
    MEDIUM:     { bg: '#b55d00', label: 'Suspicious Activity',       icon: 'search_check',  pill: 'Medium Risk'   },
    SAFE:       { bg: '#059669', label: 'No Obvious Scam Signals',   icon: 'verified_user', pill: 'Looks Safe'    },
    LOW:        { bg: '#059669', label: 'Low Risk',                  icon: 'verified_user', pill: 'Low Risk'      },
    NONE:       { bg: '#059669', label: 'No Threats Detected',       icon: 'verified_user', pill: 'Clean'         },
  }
  const v = VERDICT_MAP[verdict] || { bg: '#767586', label: verdict, icon: 'info', pill: 'Unknown' }

  return (
    <div style={{ animation: 'scale-in 0.35s ease forwards' }}>
      {/* Back button */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={onReset} className="btn-stitch-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
          Analyze Another
        </button>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 32, color: isScam ? '#ba1a1a' : isSusp ? '#b55d00' : '#059669', fontVariationSettings: "'FILL' 1" }}>
          {v.icon}
        </span>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 28, fontWeight: 800, color: '#1b1b23', letterSpacing: '-0.01em' }}>Analysis Complete</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Verdict card */}
          <div style={{
            borderRadius: 16, padding: 24, background: v.bg,
            position: 'relative', overflow: 'hidden',
            boxShadow: `0 8px 32px ${v.bg}40`,
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: 'rgba(255,255,255,0.08)', borderRadius: '50%', filter: 'blur(20px)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.8)', fontWeight: 700, marginBottom: 6 }}>Verdict</div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 22, fontWeight: 800, color: 'white', lineHeight: 1.2 }}>{v.label}</h3>
                </div>
                <span className="material-symbols-outlined" style={{ fontSize: 44, color: 'white', fontVariationSettings: "'FILL' 1" }}>{v.icon}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', background: 'rgba(255,255,255,0.12)', borderRadius: 12, backdropFilter: 'blur(8px)' }}>
                <ConfidenceRing pct={Math.round(confidence)} color={v.bg} />
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Confidence Score</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    <span style={{ padding: '3px 10px', borderRadius: 6, background: 'white', color: v.bg, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>priority_high</span>
                      {v.pill}
                    </span>
                    {result?.category && (
                      <span style={{ padding: '3px 10px', borderRadius: 6, background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 11, fontWeight: 600 }}>
                        {result.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hindi summary */}
          {hindiSummary && (
            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12, borderBottom: '1px solid rgba(199,196,215,0.3)', marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(70,72,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ color: '#4648d4', fontSize: 20 }}>g_translate</span>
                </div>
                <h4 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontWeight: 700, color: '#1b1b23', fontSize: 16 }}>सरल हिंदी में समझें</h4>
              </div>
              <p style={{ fontSize: 14, color: '#464554', lineHeight: 1.7 }}>{hindiSummary}</p>
            </div>
          )}

          {/* Metadata */}
          {result?.analysis_engine && (
            <div className="glass-card" style={{ padding: 16 }}>
              {[
                ['Analysis Engine', result.analysis_engine],
                ['Scan Type', result.scan_type || mode],
                ['Processing Time', result.processing_time ? `${result.processing_time}ms` : null],
              ].filter(([,v]) => v).map(([k,val]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(199,196,215,0.2)' }}>
                  <span style={{ fontSize: 12, color: '#767586', fontWeight: 600 }}>{k}</span>
                  <span style={{ fontSize: 12, color: '#1b1b23', fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Summary */}
          {summary && (
            <div className="glass-card" style={{ padding: 20 }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#767586', marginBottom: 12 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#4648d4' }}>description</span>
                Analysis Summary
              </h4>
              <p style={{ fontSize: 14, color: '#464554', lineHeight: 1.7 }}>{summary}</p>
            </div>
          )}

          {/* Red flags */}
          {flags.length > 0 && (
            <div className="glass-card" style={{ padding: 20 }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#767586', marginBottom: 14 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#ba1a1a' }}>flag</span>
                Red Flags Detected ({flags.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {flags.map((flag, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px',
                    borderRadius: 8, background: 'rgba(186,26,26,0.06)', border: '1px solid rgba(186,26,26,0.12)',
                    fontSize: 13, color: '#1b1b23',
                  }}>
                    <span className="material-symbols-outlined" style={{ color: '#ba1a1a', fontSize: 16, flexShrink: 0, marginTop: 1, fontVariationSettings: "'FILL' 1" }}>error</span>
                    <span style={{ lineHeight: 1.5 }}>
                      {typeof flag === 'object' ? (flag.description || flag.phrase || JSON.stringify(flag)) : flag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result?.recommendations?.length > 0 && (
            <div className="glass-card" style={{ padding: 20 }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#767586', marginBottom: 14 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#059669' }}>lightbulb</span>
                Recommended Actions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.recommendations.map((rec, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: i < result.recommendations.length-1 ? '1px solid rgba(199,196,215,0.2)' : 'none' }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', color: '#059669', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i+1}</span>
                    <span style={{ fontSize: 13, color: '#464554', lineHeight: 1.5 }}>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safe message */}
          {isSafe && !flags.length && (
            <div style={{ padding: 24, borderRadius: 16, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#059669', display: 'block', marginBottom: 10, fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <p style={{ fontWeight: 700, color: '#1b1b23', fontSize: 16 }}>No Scam Signals Found</p>
              <p style={{ color: '#767586', fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
                Stay cautious with any financial requests or requests for personal information, even from seemingly safe sources.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Main Analyzer Page ───────────────────────────────────────── */
const MODES = [
  { id: 'message', label: 'Text / SMS', icon: 'chat' },
  { id: 'url',     label: 'URL / Link', icon: 'link' },
  { id: 'email',   label: 'Email',      icon: 'mail' },
]

export default function StitchAiAnalyzerPage({ analyseMessage, analyseUrl, analyseEmail }) {
  const [mode, setMode]       = useState('message')
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [emailFields, setEmailFields] = useState({ subject: '', sender: '', body: '' })

  async function handleAnalyze(e) {
    e.preventDefault()
    setLoading(true); setResult(null)
    try {
      let res
      if (mode === 'message') {
        if (!input.trim()) { toast.error('Please enter a message to analyze.'); setLoading(false); return }
        res = await analyseMessage(input)
      } else if (mode === 'url') {
        if (!input.trim()) { toast.error('Please enter a URL to analyze.'); setLoading(false); return }
        res = await analyseUrl(input)
      } else {
        if (!emailFields.body.trim()) { toast.error('Please enter the email body.'); setLoading(false); return }
        res = await analyseEmail(emailFields.subject, emailFields.sender, emailFields.body)
      }
      setResult(res)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (result) return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px', position: 'relative', zIndex: 1 }}>
      <VerdictPanel result={result} mode={mode} onReset={() => { setResult(null); setInput(''); setEmailFields({ subject: '', sender: '', body: '' }) }} />
    </div>
  )

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 64px)', overflow: 'hidden', background: '#fcf8ff' }}>
      {/* Decorative blob */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: 0.2 }}>
        <div style={{ width: '80vw', height: '80vw', maxWidth: 800, maxHeight: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(70,72,212,0.1), rgba(107,56,212,0.08), transparent)', filter: 'blur(80px)', animation: 'pulse 8s ease-in-out infinite' }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fade-in-up 0.5s ease forwards' }}>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#1b1b23', marginBottom: 16 }}>
            Analyze with{' '}
            <span style={{ background: 'linear-gradient(135deg, #4648d4, #6b38d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              SurakshAI
            </span>
          </h1>
          <p style={{ fontSize: 18, color: '#767586', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
            Paste suspicious URLs, emails, or messages. Our AI model dissects intent, origin, and known threat patterns in real-time.
          </p>
        </div>

        {/* Analyzer Card */}
        <div className="glass-card" style={{ width: '100%', maxWidth: 760, padding: 28, position: 'relative', overflow: 'hidden', animation: 'fade-in-up 0.5s 80ms ease forwards', opacity: 0 }}>
          {/* Shimmer top border */}
          <div className="shimmer-border" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2 }} />

          {/* Mode tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, padding: '4px', background: 'rgba(199,196,215,0.2)', borderRadius: 10 }}>
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); setInput('') }}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '9px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: mode === m.id ? 'white' : 'transparent',
                  color: mode === m.id ? '#4648d4' : '#767586',
                  fontSize: 14, fontWeight: 600,
                  boxShadow: mode === m.id ? '0 1px 6px rgba(70,72,212,0.12)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'email' ? (
              <>
                <input
                  type="text"
                  placeholder="Email subject line"
                  value={emailFields.subject}
                  onChange={e => setEmailFields(f => ({ ...f, subject: e.target.value }))}
                  style={{ padding: '12px 16px', borderRadius: 10, border: '1.5px solid rgba(199,196,215,0.4)', background: '#fff', fontSize: 15, color: '#1b1b23', outline: 'none', fontFamily: 'inherit' }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(70,72,212,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(199,196,215,0.4)'}
                />
                <input
                  type="text"
                  placeholder="Sender email address"
                  value={emailFields.sender}
                  onChange={e => setEmailFields(f => ({ ...f, sender: e.target.value }))}
                  style={{ padding: '12px 16px', borderRadius: 10, border: '1.5px solid rgba(199,196,215,0.4)', background: '#fff', fontSize: 15, color: '#1b1b23', outline: 'none', fontFamily: 'inherit' }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(70,72,212,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(199,196,215,0.4)'}
                />
                <textarea
                  rows={5}
                  placeholder="Paste full email body here…"
                  value={emailFields.body}
                  onChange={e => setEmailFields(f => ({ ...f, body: e.target.value }))}
                  style={{ padding: '14px 16px', borderRadius: 10, border: '1.5px solid rgba(199,196,215,0.4)', background: '#fff', fontSize: 15, color: '#1b1b23', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(70,72,212,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(199,196,215,0.4)'}
                />
              </>
            ) : (
              <textarea
                rows={4}
                placeholder={mode === 'url' ? 'Paste a URL or link here for analysis…' : 'Paste an SMS, WhatsApp message, or suspicious text here…'}
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{ padding: '14px 16px', borderRadius: 10, border: '1.5px solid rgba(199,196,215,0.4)', background: '#fff', fontSize: 15, color: '#1b1b23', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(70,72,212,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(199,196,215,0.4)'}
              />
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <span style={{ fontSize: 12, color: '#767586' }}>
                {mode === 'message' ? '💬 SMS, WhatsApp, social media messages' : mode === 'url' ? '🔗 Any suspicious link or URL' : '📧 Full email content analysis'}
              </span>
              <button
                type="submit"
                disabled={loading}
                className="btn-stitch-primary"
                style={{ padding: '12px 28px', minWidth: 160, justifyContent: 'center' }}
              >
                {loading
                  ? <><span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>progress_activity</span> Analyzing…</>
                  : <><span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>auto_awesome</span> Analyze Now</>
                }
              </button>
            </div>
          </form>
        </div>

        {/* Trust indicators */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', marginTop: 40, animation: 'fade-in-up 0.5s 160ms ease forwards', opacity: 0 }}>
          {[['verified_user', 'Rule-based AI Engine'], ['speed', 'Real-time Analysis'], ['lock', 'No Data Stored'], ['translate', 'Hindi Explanation']].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#767586' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#4648d4' }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
