/**
 * StitchScanningPage.jsx
 * Converted from Stitch by Google — scanning..._websec_surakshai_emerald_light screen.
 * Shown in ScannerPage while an active passive scan is running (SSE stream).
 *
 * Props:
 *   targetUrl   (string)  — the URL being scanned
 *   scanLog     (Array)   — SSE log items: [{ message, done }]
 *   scanning    (bool)    — true while scan is in progress
 *   scanId      (number)  — scan ID once started (for export links)
 *   redirectUrl (string)  — unused legacy field
 *   exportJson  (fn)      — exportJson(scanId) → URL string
 *   exportPdf   (fn)      — exportPdf(scanId) → URL string
 *   onNewScan   (fn)      — called when user clicks "Scan Another"
 *   onViewReport(fn)      — called with scanId when user clicks "View Full Report"
 */
import { useEffect, useRef } from 'react'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap');

  .sp-root {
    min-height: 100%;
    width: 100%;
    background: #0b0f19;
    color: #e2e8f0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 24px;
    overflow: hidden;
  }

  /* Scan line sweep animation */
  @keyframes sp-scanline {
    0%   { transform: translateY(-100%); opacity: 0; }
    50%  { opacity: 0.4; }
    100% { transform: translateY(800px); opacity: 0; }
  }
  .sp-scanline { animation: sp-scanline 4s linear infinite; }

  /* Pulse dot */
  @keyframes sp-ping {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(1.5); }
  }
  .sp-ping { animation: sp-ping 1.2s ease-in-out infinite; }

  /* Bounce trio */
  @keyframes sp-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  .sp-b0 { animation: sp-bounce 1s infinite; }
  .sp-b1 { animation: sp-bounce 1s 0.2s infinite; }
  .sp-b2 { animation: sp-bounce 1s 0.4s infinite; }

  /* Shimmer progress bar */
  @keyframes sp-shimmer { from{background-position:-200% 0} to{background-position:200% 0} }
  .sp-progress-bar {
    height: 3px;
    width: 50%;
    background: linear-gradient(90deg, #4648d4, #6b38d4, #4648d4);
    background-size: 200%;
    animation: sp-shimmer 2s linear infinite;
    box-shadow: 0 0 12px rgba(107,56,212,0.8);
  }

  /* Log item entrance */
  @keyframes sp-fade-up { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .sp-log-item { animation: sp-fade-up 0.4s ease forwards; }

  .sp-card {
    position: relative;
    background: rgba(27,27,35,0.9);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
    width: 100%;
    max-width: 800px;
  }

  .sp-target-bar {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 24px;
  }

  .sp-log-box {
    background: #0d0d14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 16px;
    height: 260px;
    overflow-y: auto;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .sp-log-box::-webkit-scrollbar { width: 4px; }
  .sp-log-box::-webkit-scrollbar-track { background: transparent; }
  .sp-log-box::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }

  .sp-btn-primary {
    padding: 12px 24px;
    border-radius: 10px;
    background: linear-gradient(135deg, #4648d4, #6b38d4);
    color: #fff;
    font-family: 'Plus Jakarta Sans', system-ui;
    font-weight: 700;
    font-size: 14px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 16px rgba(70,72,212,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .sp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(70,72,212,0.6); }

  .sp-btn-secondary {
    padding: 12px 20px;
    border-radius: 10px;
    background: rgba(255,255,255,0.06);
    color: #94a3b8;
    font-family: 'Inter', system-ui;
    font-weight: 600;
    font-size: 14px;
    border: 1px solid rgba(255,255,255,0.1);
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: background 0.2s, color 0.2s;
  }
  .sp-btn-secondary:hover { background: rgba(255,255,255,0.1); color: #e2e8f0; }
`

export default function StitchScanningPage({
  targetUrl = '',
  scanLog = [],
  scanning = true,
  scanComplete = false,
  scanId = null,
  redirectUrl = null,
  exportJson,
  exportPdf,
  onNewScan,
  onViewReport,
}) {
  const logBoxRef = useRef(null)

  // Auto-scroll log box as new items arrive
  useEffect(() => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight
    }
  }, [scanLog])

  const now = new Date()
  const timeStr = now.toTimeString().slice(0, 8)
  const isComplete = scanComplete || (!scanning && scanLog.length > 0)

  return (
    <>
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

      <div className="sp-root">
        {/* Background blobs */}
        <div style={{ position: 'absolute', top: '5%', right: '5%', width: 400, height: 400, background: 'rgba(70,72,212,0.12)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '5%', width: 500, height: 500, background: 'rgba(107,56,212,0.08)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />

        {/* Scanline sweep */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', opacity: 0.15, zIndex: 0 }}>
          <div className="sp-scanline" style={{ width: '100%', height: 2, background: '#4648d4', filter: 'blur(1px)' }} />
        </div>

        <div className="sp-card" style={{ zIndex: 1 }}>
          {/* Progress shimmer bar at top of card */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: '24px 24px 0 0', overflow: 'hidden' }}>
            {scanning && <div className="sp-progress-bar" />}
            {isComplete && <div style={{ width: '100%', height: '100%', background: '#10b981' }} />}
          </div>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 22, fontWeight: 800, color: '#e2e8f0', margin: 0, letterSpacing: '-0.01em' }}>
                {isComplete ? '✅ Scan Complete' : '⚡ Target Analysis'}
              </h2>
              <p style={{ fontSize: 13, color: '#767586', fontFamily: 'JetBrains Mono, monospace', marginTop: 4 }}>
                {isComplete ? '> All checks finished. Report is ready.' : '> Deep heuristic analysis in progress. Do not close this window.'}
              </p>
            </div>
            {scanning && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(107,56,212,0.15)', borderRadius: 99, border: '1px solid rgba(107,56,212,0.3)' }}>
                <div className="sp-ping" style={{ width: 8, height: 8, borderRadius: '50%', background: '#6b38d4', flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Scanning Active</span>
              </div>
            )}
            {isComplete && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(16,185,129,0.12)', borderRadius: 99, border: '1px solid rgba(16,185,129,0.3)' }}>
                <span style={{ color: '#10b981', fontSize: 13 }}>●</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Complete</span>
              </div>
            )}
          </div>

          {/* Target URL bar */}
          <div className="sp-target-bar">
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ color: '#767586', fontSize: 20 }}>radar</span>
            </div>
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#767586', marginBottom: 3 }}>Target URL</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: '#e2e8f0', fontWeight: 600, wordBreak: 'break-all' }}>{targetUrl || 'https://...'}</div>
            </div>
          </div>

          {/* Execution Log */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 16, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>Execution Log</h3>
            <span style={{ fontSize: 11, color: '#767586', fontFamily: 'JetBrains Mono, monospace' }}>{timeStr}</span>
          </div>

          <div ref={logBoxRef} className="sp-log-box">
            {scanLog.length === 0 && (
              <div style={{ color: '#464554', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div className="sp-b0" style={{ width: 6, height: 6, background: '#4648d4', borderRadius: '50%' }} />
                <div className="sp-b1" style={{ width: 6, height: 6, background: '#4648d4', borderRadius: '50%' }} />
                <div className="sp-b2" style={{ width: 6, height: 6, background: '#4648d4', borderRadius: '50%' }} />
                <span style={{ marginLeft: 8 }}>Initialising scan engine…</span>
              </div>
            )}

            {scanLog.map((item, i) => (
              <div key={i} className="sp-log-item" style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ color: '#464554', flexShrink: 0, minWidth: 70 }}>[{timeStr}]</span>
                <div>
                  {item.done ? (
                    <span style={{ color: '#4648d4', fontWeight: 600 }}>✓ [OK] {item.message}</span>
                  ) : (
                    <span style={{ color: '#6b38d4', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {'>'} {item.message}
                      <span style={{ display: 'flex', gap: 3 }}>
                        <div className="sp-b0" style={{ width: 5, height: 5, background: '#6b38d4', borderRadius: '50%' }} />
                        <div className="sp-b1" style={{ width: 5, height: 5, background: '#6b38d4', borderRadius: '50%' }} />
                        <div className="sp-b2" style={{ width: 5, height: 5, background: '#6b38d4', borderRadius: '50%' }} />
                      </span>
                    </span>
                  )}
                </div>
              </div>
            ))}

            {scanning && scanLog.length > 0 && (
              <div className="sp-log-item" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#464554' }}>
                <div className="sp-b0" style={{ width: 5, height: 5, background: '#4648d4', borderRadius: '50%' }} />
                <div className="sp-b1" style={{ width: 5, height: 5, background: '#4648d4', borderRadius: '50%' }} />
                <div className="sp-b2" style={{ width: 5, height: 5, background: '#4648d4', borderRadius: '50%' }} />
                <span style={{ marginLeft: 4 }}>Working…</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, flexWrap: 'wrap', gap: 12 }}>
            <button onClick={onNewScan} className="sp-btn-secondary" style={{ border: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
              Scan Another
            </button>

            {isComplete && scanId && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {scanId && exportJson && (
                  <a href={exportJson(scanId)} className="sp-btn-secondary" download>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
                    JSON
                  </a>
                )}
                {scanId && exportPdf && (
                  <a href={exportPdf(scanId)} className="sp-btn-secondary" download>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>picture_as_pdf</span>
                    PDF
                  </a>
                )}
                <button
                  onClick={() => onViewReport && onViewReport(scanId)}
                  className="sp-btn-primary"
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span>
                  View Full Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
