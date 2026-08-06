/**
 * StitchScannerPage.jsx
 * Full conversion of security_scanner_websec_surakshai_1 Stitch screen.
 * Shows: Radar icon + glassmorphism scan card + scan type chips + recent ops list.
 */
import { useState } from 'react'
import { toast } from 'react-hot-toast'

const ACCENT = {
  critical: { bg: 'rgba(186,26,26,0.1)', color: '#ba1a1a', icon: 'error' },
  high:     { bg: 'rgba(181,93,0,0.1)',  color: '#b55d00', icon: 'warning' },
  medium:   { bg: 'rgba(107,56,212,0.1)', color: '#6b38d4', icon: 'info'   },
  low:      { bg: 'rgba(16,185,129,0.1)', color: '#059669', icon: 'check_circle' },
}

function GradeChip({ score, grade }) {
  const colors = { A: '#059669', B: '#10b981', C: '#b55d00', D: '#ef4444', F: '#ba1a1a' }
  return (
    <span style={{
      padding: '2px 10px', borderRadius: 999,
      background: `${colors[grade] || '#767586'}20`,
      color: colors[grade] || '#767586',
      fontSize: 13, fontWeight: 700, border: `1px solid ${colors[grade] || '#767586'}30`,
    }}>
      {grade || '?'} · {score ?? '?'}/100
    </span>
  )
}

export default function StitchScannerPage({
  onScanStart,         // fn(url) → Promise — starts scan
  recentScans = [],    // last N scans from dashboard
  onViewReport,        // fn(scanId) — navigate to report
}) {
  const [url, setUrl]           = useState('')
  const [scanning, setScanning] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    let trimmed = url.trim()
    if (!trimmed) {
      trimmed = 'https://example.com'
      setUrl('https://example.com')
    } else if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = 'https://' + trimmed
    }
    setScanning(true)
    try {
      await onScanStart(trimmed)
    } catch (err) {
      toast.error(err.message)
      setScanning(false)
    }
  }

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 64px)', overflow: 'hidden', background: '#fcf8ff' }}>
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', background: 'rgba(70,72,212,0.07)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '50%', background: 'rgba(107,56,212,0.06)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 64px', position: 'relative', zIndex: 1 }}>
        {/* ── Page Header ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 40, animation: 'fade-in-up 0.5s ease forwards' }}>
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#1b1b23', marginBottom: 12 }}>
              Security Scanner
            </h1>
            <p style={{ fontSize: 18, color: '#767586', maxWidth: 560, lineHeight: 1.6 }}>
              Initiate deep analysis of web properties. Detect vulnerabilities, phishing vectors, and structural anomalies in real-time.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#767586', fontWeight: 600 }}>System Status</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'ping 1.5s ease infinite', boxShadow: '0 0 0 rgba(16,185,129,0.4)' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#10b981' }}>All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* ── Scan Input Card ── */}
        <div
          className="glass-card"
          style={{
            padding: '40px 32px',
            marginBottom: 32,
            position: 'relative',
            overflow: 'hidden',
            animation: 'fade-in-up 0.5s 80ms ease forwards',
            opacity: 0,
          }}
        >
          {/* Shimmer top border */}
          <div className="shimmer-border" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2 }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            {/* Radar icon */}
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              <div style={{
                position: 'absolute', inset: 0,
                border: '2px dashed rgba(70,72,212,0.5)',
                borderRadius: '50%',
                animation: 'spin 10s linear infinite',
              }} />
              <div style={{
                width: '100%', height: '100%',
                background: 'rgba(70,72,212,0.1)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#4648d4' }}>radar</span>
              </div>
            </div>

            <h2 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 24, fontWeight: 700, color: '#1b1b23' }}>
              New Scan Directive
            </h2>

            {/* URL Input */}
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 760, position: 'relative' }}>
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Enter target URL, IP address, or domain (e.g. https://example.com)"
                disabled={scanning}
                style={{
                  width: '100%', height: 72, paddingLeft: 24, paddingRight: 180,
                  borderRadius: 12, border: '1.5px solid rgba(199,196,215,0.4)',
                  background: '#fcf8ff', color: '#1b1b23',
                  fontSize: 16, fontFamily: 'inherit',
                  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxShadow: '0 1px 6px rgba(70,72,212,0.06)',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(70,72,212,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(70,72,212,0.1)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(199,196,215,0.4)'; e.currentTarget.style.boxShadow = '0 1px 6px rgba(70,72,212,0.06)' }}
              />
              <button
                type="submit"
                disabled={scanning}
                className="btn-stitch-primary"
                style={{
                  position: 'absolute', right: 8, top: 8, bottom: 8,
                  padding: '0 24px', borderRadius: 8, minWidth: 160,
                  opacity: scanning ? 0.6 : 1, cursor: scanning ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg, #4648d4, #6b38d4)',
                  boxShadow: '0 4px 16px rgba(70,72,212,0.4)',
                }}
              >
                {scanning ? (
                  <>
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>progress_activity</span>
                    Analyzing…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>search</span>
                    Analyze Target
                  </>
                )}
              </button>
            </form>

            {/* Quick option chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#767586', fontWeight: 600 }}>Scan Modules:</span>
              {['TLS/SSL Certificate', 'Security Headers', 'SPF · DMARC · DKIM', 'WHOIS Domain Age', 'Phishing Databases', 'Cookie Security'].map(chip => (
                <span key={chip} style={{
                  padding: '6px 14px', borderRadius: 999,
                  background: 'rgba(199,196,215,0.25)',
                  color: '#464554', fontSize: 12, fontWeight: 600,
                  border: '1px solid rgba(199,196,215,0.4)',
                }}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent Operations ── */}
        {recentScans.length > 0 && (
          <div style={{ animation: 'fade-in-up 0.5s 160ms ease forwards', opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 20, fontWeight: 700, color: '#1b1b23', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: '#4648d4', fontSize: 22 }}>history</span>
                Recent Operations
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentScans.slice(0, 5).map(scan => {
                const gradeColor = { A: '#059669', B: '#10b981', C: '#b55d00', D: '#ef4444', F: '#ba1a1a' }
                const g = scan.grade || 'F'
                const iconBg = scan.status === 'complete' ? (scan.risk_score < 30 ? 'rgba(16,185,129,0.1)' : scan.risk_score < 60 ? 'rgba(181,93,0,0.1)' : 'rgba(186,26,26,0.1)') : 'rgba(199,196,215,0.3)'
                const iconColor = scan.status === 'complete' ? (scan.risk_score < 30 ? '#10b981' : scan.risk_score < 60 ? '#b55d00' : '#ba1a1a') : '#767586'
                return (
                  <div key={scan.id} className="glass-card hover-scale" style={{ padding: '14px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer' }}
                    onClick={() => scan.status === 'complete' && onViewReport && onViewReport(scan.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ color: iconColor, fontSize: 22 }}>
                          {scan.status === 'complete' ? 'task_alt' : scan.status === 'failed' ? 'error' : 'pending'}
                        </span>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 600, color: '#1b1b23' }}>{scan.domain}</div>
                        <div style={{ fontSize: 12, color: '#767586', marginTop: 2 }}>
                          {scan.scan_type} · {scan.started_at ? new Date(scan.started_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {scan.status === 'complete' && <GradeChip score={scan.risk_score} grade={scan.grade} />}
                      {scan.status === 'complete' && (
                        <button
                          onClick={e => { e.stopPropagation(); onViewReport && onViewReport(scan.id) }}
                          style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(70,72,212,0.08)', color: '#4648d4', fontSize: 13, fontWeight: 600, border: '1px solid rgba(70,72,212,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
                          View
                        </button>
                      )}
                      {scan.status !== 'complete' && (
                        <span style={{ fontSize: 12, color: '#767586', textTransform: 'uppercase', fontWeight: 600 }}>{scan.status}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {recentScans.length === 0 && (
          <div className="glass-card" style={{ padding: '40px 24px', textAlign: 'center', animation: 'fade-in-up 0.5s 160ms ease forwards', opacity: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#c7c4d7', display: 'block', marginBottom: 16 }}>radar</span>
            <p style={{ fontWeight: 700, color: '#464554', fontSize: 16 }}>No scans yet</p>
            <p style={{ color: '#767586', fontSize: 14, marginTop: 6 }}>Enter a URL above to run your first passive scan.</p>
          </div>
        )}
      </div>
    </div>
  )
}
