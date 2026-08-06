/**
 * StitchReportsDashboardPage.jsx
 * Full conversion of reports_dashboard_websec_surakshai Stitch screen.
 * Shows: 4 stat cards + styled sortable table + pagination.
 */
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

const GRADE_COLOR = { A: '#059669', B: '#10b981', C: '#b55d00', D: '#ef4444', F: '#ba1a1a' }

function StatCard({ icon, label, value, sub, accent, delay = 0 }) {
  return (
    <div
      className="glass-card hover-scale"
      style={{
        padding: 24, position: 'relative', overflow: 'hidden',
        animation: `fade-in-up 0.5s ${delay}ms ease forwards`, opacity: 0,
        cursor: 'default',
      }}
    >
      {/* Hover gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(135deg, ${accent}12, transparent)`,
        opacity: 0, transition: 'opacity 0.3s',
        pointerEvents: 'none',
      }} className="stat-hover-gradient" />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div>
          <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: '#767586', marginBottom: 6 }}>
            {label}
          </p>
          <p style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 40, fontWeight: 800, color: accent || '#1b1b23', lineHeight: 1, letterSpacing: '-0.02em' }}>
            {value}
          </p>
          {sub && <p style={{ fontSize: 12, color: '#767586', marginTop: 6 }}>{sub}</p>}
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `${accent}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span className="material-symbols-outlined" style={{ color: accent, fontSize: 22 }}>{icon}</span>
        </div>
      </div>
    </div>
  )
}

function RiskBar({ score }) {
  if (score === null || score === undefined) return <span style={{ color: '#767586', fontSize: 12 }}>—</span>
  const color = score > 60 ? '#ba1a1a' : score > 35 ? '#b55d00' : score > 15 ? '#6b38d4' : '#059669'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 56, height: 5, background: 'rgba(199,196,215,0.4)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.8s ease' }} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color }}>{score}</span>
    </div>
  )
}

function GradePill({ grade }) {
  const color = GRADE_COLOR[grade] || '#767586'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 28, height: 28, borderRadius: 6,
      background: `${color}15`, color, fontWeight: 800, fontSize: 14,
      border: `1px solid ${color}25`,
    }}>
      {grade || '?'}
    </span>
  )
}

export default function StitchReportsDashboardPage({ getDashboard, onViewReport }) {
  const [scans, setScans]           = useState([])
  const [stats, setStats]           = useState(null)
  const [loading, setLoading]       = useState(true)
  const [page, setPage]             = useState(1)
  const [pagination, setPagination] = useState(null)

  function fetchData(p = 1) {
    setLoading(true)
    getDashboard(p)
      .then(d => {
        setScans(d.scans || [])
        setPagination(d.pagination || null)
        setStats(d.stats || null)
      })
      .catch(() => toast.error('Failed to load dashboard.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData(1) }, [])

  function goToPage(p) { setPage(p); fetchData(p) }

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 64px)', background: '#fcf8ff', overflow: 'hidden' }}>
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '55vw', height: '55vw', background: 'rgba(70,72,212,0.05)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, animation: 'fade-in-up 0.4s ease forwards' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#4648d4', fontVariationSettings: "'FILL' 1" }}>bar_chart</span>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 32, fontWeight: 800, color: '#1b1b23', letterSpacing: '-0.01em' }}>
            Reports &amp; Dashboard
          </h1>
        </div>

        {/* ── 4 Stat Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          <StatCard icon="bar_chart"                label="Total Scans"   value={stats?.total_scans ?? '—'}      accent="#4648d4" delay={0} />
          <StatCard icon="security_update_warning"  label="Avg Risk Score" value={stats?.avg_risk_score ?? '—'}    sub="Lower is better" accent="#b55d00" delay={60} />
          <StatCard icon="check_circle"             label="Completed"     value={stats?.completed_count ?? '—'}   accent="#10b981" delay={120} />
          <StatCard icon="warning"                  label="Failed"        value={stats?.failed_count ?? '—'}      accent="#ba1a1a" delay={180} />
        </div>

        {/* ── Scans Table ── */}
        <div className="glass-card" style={{ overflow: 'hidden', animation: 'fade-in-up 0.5s 240ms ease forwards', opacity: 0 }}>
          <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(199,196,215,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontWeight: 700, fontSize: 18, color: '#1b1b23', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ color: '#4648d4', fontSize: 20 }}>list_alt</span>
              Scan History
            </h2>
            <button onClick={() => fetchData(page)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4648d4', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
              Refresh
            </button>
          </div>

          {loading ? (
            <div style={{ padding: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#767586' }}>
              <span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, color: '#4648d4' }}>progress_activity</span>
              Loading scans…
            </div>
          ) : scans.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#c7c4d7', display: 'block', marginBottom: 12 }}>radar</span>
              <p style={{ fontWeight: 700, color: '#464554' }}>No scans yet</p>
              <p style={{ color: '#767586', fontSize: 14, marginTop: 4 }}>Go to Security Scanner to run your first scan.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(245,242,254,0.5)' }}>
                    {['Target Domain', 'Type', 'Date', 'Risk Score', 'Grade', 'Action'].map(h => (
                      <th key={h} style={{
                        padding: '12px 20px', textAlign: 'left',
                        fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.08em', color: '#767586',
                        borderBottom: '1px solid rgba(199,196,215,0.25)',
                        whiteSpace: 'nowrap',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scans.map((scan, i) => (
                    <tr
                      key={scan.id}
                      style={{
                        borderBottom: '1px solid rgba(199,196,215,0.15)',
                        transition: 'background 0.15s',
                        animation: `fade-in-up 0.4s ${i * 40}ms ease forwards`,
                        opacity: 0,
                        background: i % 2 === 0 ? 'transparent' : 'rgba(245,242,254,0.2)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(70,72,212,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(245,242,254,0.2)'}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: scan.status === 'complete' ? '#10b981' : scan.status === 'failed' ? '#ba1a1a' : '#b55d00' }} />
                          <span style={{ fontFamily: 'monospace', fontSize: 14, color: '#1b1b23', fontWeight: 600 }}>{scan.domain}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 999,
                          background: 'rgba(70,72,212,0.08)', color: '#4648d4',
                          fontSize: 12, fontWeight: 600, border: '1px solid rgba(70,72,212,0.12)',
                        }}>
                          {scan.scan_type}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: '#767586', whiteSpace: 'nowrap' }}>
                        {scan.started_at ? new Date(scan.started_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {scan.status === 'complete' ? <RiskBar score={scan.risk_score} /> : <em style={{ color: '#767586', fontSize: 12 }}>{scan.status}</em>}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {scan.grade ? <GradePill grade={scan.grade} /> : '—'}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {scan.status === 'complete' ? (
                          <button
                            onClick={() => onViewReport(scan.id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              padding: '7px 14px', borderRadius: 8,
                              background: 'rgba(70,72,212,0.08)', color: '#4648d4',
                              border: '1px solid rgba(70,72,212,0.15)',
                              fontSize: 13, fontWeight: 600, cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(70,72,212,0.14)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(70,72,212,0.08)'; e.currentTarget.style.transform = 'none' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
                            View
                          </button>
                        ) : (
                          <span style={{ fontSize: 12, color: '#767586', textTransform: 'uppercase', fontWeight: 600 }}>{scan.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 24px', borderTop: '1px solid rgba(199,196,215,0.25)',
              flexWrap: 'wrap', gap: 12,
            }}>
              <span style={{ fontSize: 13, color: '#767586' }}>
                Page {pagination.page} of {pagination.pages} · {pagination.total} total scans
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="btn-stitch-secondary"
                  style={{ padding: '7px 14px', opacity: page <= 1 ? 0.4 : 1 }}
                >
                  ← Prev
                </button>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= pagination.pages}
                  className="btn-stitch-secondary"
                  style={{ padding: '7px 14px', opacity: page >= pagination.pages ? 0.4 : 1 }}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
