/**
 * StitchSocDashboardPage.jsx
 * Converted from advanced_details_dashboard_websec_surakshai Stitch screen.
 * Shows: Global Security Score (with sparklines), Active Threats counter, System Uptime SLA bar,
 * and live terminal event stream for security operations.
 */
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

export default function StitchSocDashboardPage({ getSocOverview, onRunScan }) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSocOverview()
      .then(setData)
      .catch(() => toast.error('Failed to load SOC Overview data.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <span className="material-symbols-outlined animate-spin" style={{ fontSize: 36, color: '#4648d4' }}>progress_activity</span>
      </div>
    )
  }

  const score = data?.global_security_score ?? 88
  const activeThreats = data?.active_threats_count ?? 42
  const uptime = data?.uptime_pct ?? 99.9
  const logs = data?.logs || []

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 64px)', background: '#fcf8ff', overflow: 'hidden' }}>
      {/* Radial background blob */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '60vw', height: '60vw', background: 'radial-gradient(ellipse at top right, rgba(70,72,212,0.08), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '32px 24px 64px', position: 'relative', zIndex: 1 }}>

        {/* ── Top Header Bar ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 32, animation: 'fade-in-up 0.4s ease forwards' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(70,72,212,0.1)', color: '#4648d4', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>shield</span>
              SOC Executive Dashboard
            </div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 32, fontWeight: 800, color: '#1b1b23', letterSpacing: '-0.01em' }}>
              Security Operations Center
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: '6px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(199,196,215,0.4)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, color: '#464554' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
              SYS.OP.NORMAL
            </div>
            <button
              onClick={onRunScan}
              className="btn-stitch-primary"
              style={{ padding: '10px 20px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>play_arrow</span>
              Run Deep Scan
            </button>
          </div>
        </div>

        {/* ── Overview Cards Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 32 }}>

          {/* 1. Global Security Score */}
          <div className="glass-card hover-scale" style={{ padding: 24, position: 'relative', overflow: 'hidden', animation: 'fade-in-up 0.5s 50ms ease forwards', opacity: 0 }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, background: 'rgba(70,72,212,0.1)', borderRadius: '50%', filter: 'blur(30px)' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ padding: 8, borderRadius: 8, background: 'rgba(70,72,212,0.1)', color: '#4648d4' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>policy</span>
                </div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: '#767586' }}>Global Security Score</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 60, fontWeight: 800, color: '#1b1b23', lineHeight: 1, letterSpacing: '-0.03em' }}>
                {score}<span style={{ fontSize: 24, color: '#767586', fontWeight: 600 }}>%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 4, background: 'rgba(16,185,129,0.1)', color: '#059669', fontSize: 12, fontWeight: 700 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_upward</span>
                  +3.2%
                </div>
                <span style={{ fontSize: 10, color: '#767586', marginTop: 4 }}>vs last week</span>
              </div>
            </div>
          </div>

          {/* 2. Active Threats */}
          <div className="glass-card hover-scale" style={{ padding: 24, position: 'relative', overflow: 'hidden', animation: 'fade-in-up 0.5s 100ms ease forwards', opacity: 0 }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, background: 'rgba(186,26,26,0.1)', borderRadius: '50%', filter: 'blur(30px)' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ padding: 8, borderRadius: 8, background: 'rgba(186,26,26,0.1)', color: '#ba1a1a' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>gpp_bad</span>
                </div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: '#767586' }}>Active Threats</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 60, fontWeight: 800, color: '#ba1a1a', lineHeight: 1, letterSpacing: '-0.03em' }}>
                {activeThreats}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 4, background: 'rgba(186,26,26,0.1)', color: '#ba1a1a', fontSize: 12, fontWeight: 700 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_upward</span>
                  12 New
                </div>
                <span style={{ fontSize: 10, color: '#767586', marginTop: 4 }}>in last 24h</span>
              </div>
            </div>
          </div>

          {/* 3. System Uptime SLA */}
          <div className="glass-card hover-scale" style={{ padding: 24, position: 'relative', overflow: 'hidden', animation: 'fade-in-up 0.5s 150ms ease forwards', opacity: 0 }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, background: 'rgba(5,150,129,0.1)', borderRadius: '50%', filter: 'blur(30px)' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ padding: 8, borderRadius: 8, background: 'rgba(5,150,129,0.1)', color: '#059669' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>dns</span>
                </div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: '#767586' }}>System Status</span>
              </div>
              <span style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(16,185,129,0.15)', color: '#059669', fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>Operational</span>
            </div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 44, fontWeight: 800, color: '#1b1b23', marginBottom: 12 }}>
              {uptime}<span style={{ fontSize: 20, color: '#767586' }}>%</span>
            </div>
            <div style={{ width: '100%', height: 6, background: 'rgba(199,196,215,0.4)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ width: `${uptime}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: 3 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#767586' }}>
              <span>Uptime SLA</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>14d 03h 22m</span>
            </div>
          </div>
        </div>

        {/* ── Deep Scan & Live Log Feed Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20, animation: 'fade-in-up 0.5s 200ms ease forwards', opacity: 0 }}>

          {/* Deep Scan Live Log Terminal */}
          <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid rgba(199,196,215,0.3)', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #4648d4, #6b38d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>radar</span>
                </div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 18, fontWeight: 700, color: '#1b1b23' }}>Deep Scan Log Feed</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: 'rgba(70,72,212,0.1)', color: '#4648d4', fontFamily: 'monospace', fontSize: 11, fontWeight: 700 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4648d4', animation: 'ping 1.5s infinite' }} />
                ID: {data?.active_scan_id || 'SCN-9024'}
              </div>
            </div>

            {/* Terminal Feed */}
            <div className="code-block" style={{ flex: 1, padding: 16, background: '#1b1b23', color: '#f2effb', borderRadius: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {logs.map((log, i) => (
                  <div key={log.id || i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '8px 10px', borderRadius: 8, background: log.status === 'WARN' ? 'rgba(186,26,26,0.15)' : 'rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ color: log.status === 'WARN' ? '#ba1a1a' : log.status === 'SECURE' ? '#4648d4' : '#059669', fontFamily: 'monospace', fontWeight: 700 }}>▶</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>{log.title}</span>
                          <span style={{
                            padding: '1px 6px', borderRadius: 4, fontSize: 10, fontWeight: 800,
                            background: log.status === 'WARN' ? 'rgba(186,26,26,0.3)' : 'rgba(16,185,129,0.2)',
                            color: log.status === 'WARN' ? '#ffdad6' : '#10b981'
                          }}>
                            {log.status}
                          </span>
                        </div>
                        <p style={{ fontSize: 11, color: '#c7c4d7', marginTop: 2 }}>{log.category} verification inspect step</p>
                      </div>
                    </div>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#767586' }}>{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Intelligence Brief */}
          <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid rgba(199,196,215,0.3)', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6b38d4, #8455ef)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>psychology</span>
                  </div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 18, fontWeight: 700, color: '#1b1b23' }}>AI Threat Intelligence</h3>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: 999, background: 'rgba(107,56,212,0.1)', color: '#6b38d4', fontSize: 11, fontWeight: 700 }}>Live Insight</span>
              </div>

              <div style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(199,196,215,0.3)', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#767586', marginBottom: 6 }}>Latest Threat Detection</div>
                <p style={{ fontSize: 14, color: '#1b1b23', fontStyle: 'italic', fontWeight: 500, lineHeight: 1.6 }}>
                  "URGENT: Your account will be suspended in 24 hours. Click here to verify identity."
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                  <span style={{ padding: '2px 8px', borderRadius: 4, background: 'rgba(186,26,26,0.1)', color: '#ba1a1a', fontSize: 11, fontWeight: 700 }}>Urgency</span>
                  <span style={{ padding: '2px 8px', borderRadius: 4, background: 'rgba(186,26,26,0.1)', color: '#ba1a1a', fontSize: 11, fontWeight: 700 }}>Impersonation</span>
                  <span style={{ padding: '2px 8px', borderRadius: 4, background: 'rgba(70,72,212,0.1)', color: '#4648d4', fontSize: 11, fontWeight: 700 }}>Suspicious Link</span>
                </div>
              </div>
            </div>

            <div style={{ padding: 16, borderRadius: 12, background: 'rgba(107,56,212,0.08)', border: '1px solid rgba(107,56,212,0.15)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span className="material-symbols-outlined" style={{ color: '#6b38d4', fontSize: 20 }}>smart_toy</span>
              <p style={{ fontSize: 13, color: '#464554', lineHeight: 1.6 }}>
                <strong style={{ color: '#6b38d4' }}>AI Insight:</strong> Linguistic pattern matches known phishing campaign <code style={{ padding: '2px 6px', borderRadius: 4, background: 'rgba(107,56,212,0.15)', color: '#6b38d4', fontFamily: 'monospace', fontSize: 11 }}>Operation Red Spear</code>.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
