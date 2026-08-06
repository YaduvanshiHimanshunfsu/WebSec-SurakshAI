/**
 * StitchLinkIntelligencePage.jsx
 * Converted from advanced_link_intelligence_websec_surakshai_light Stitch screen.
 * Deep packet inspection & URL analysis featuring:
 *   - Redirection Chain Hop Tracker (visual line showing HTTP 301, 302, 200 hops)
 *   - Technical Footprint (Domain age, WHOIS registrar, SSL cert depth, IP geolocation)
 */
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function StitchLinkIntelligencePage({ analyseUrl }) {
  const [url, setUrl]         = useState('http://secure-login-update.com/auth')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)

  async function handleAnalyze(e) {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    try {
      const res = await analyseUrl(url.trim())
      setResult(res)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const hops = result?.redirection_chain || [
    { url: url || 'http://secure-login-update.com/auth', status_code: 301, reason: 'HTTP 301 Moved Permanently' },
    { url: 'https://bit.ly/3xY9zQ', status_code: 302, reason: 'HTTP 302 Found' },
    { url: 'https://auth-fake-update.com/login', status_code: 200, reason: 'Final Target (HTTP 200 OK)' },
  ]

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 64px)', background: '#fcf8ff', overflow: 'hidden' }}>
      {/* Background blobs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'rgba(70,72,212,0.06)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'rgba(186,26,26,0.04)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '32px 24px 64px', position: 'relative', zIndex: 1 }}>

        {/* ── Input Hero Section ── */}
        <div className="glass-card" style={{ padding: 32, marginBottom: 32, position: 'relative', overflow: 'hidden', animation: 'fade-in-up 0.4s ease forwards' }}>
          <div className="shimmer-border" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2 }} />

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#4648d4' }}>link</span>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 32, fontWeight: 800, color: '#1b1b23' }}>Link Intelligence</h1>
            </div>
            <p style={{ fontSize: 16, color: '#767586', maxWidth: 640 }}>
              Deep packet inspection and behavioral analysis for URLs. Unveil true destinations, HTTP redirection chains, and hidden technical footprints.
            </p>
          </div>

          <form onSubmit={handleAnalyze} style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 14, top: 14, color: '#767586', fontSize: 20 }}>search</span>
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Enter URL to analyze..."
                style={{
                  width: '100%', height: 48, paddingLeft: 44, paddingRight: 16,
                  borderRadius: 10, border: '1.5px solid rgba(199,196,215,0.4)',
                  background: '#fff', fontSize: 14, fontFamily: 'monospace', color: '#1b1b23', outline: 'none',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-stitch-primary"
              style={{ height: 48, padding: '0 24px' }}
            >
              {loading ? (
                <><span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>progress_activity</span> Analyzing...</>
              ) : (
                <><span className="material-symbols-outlined" style={{ fontSize: 18 }}>radar</span> Analyze Link</>
              )}
            </button>
          </form>
        </div>

        {/* ── Redirection Chain (Hop Tracker) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, animation: 'fade-in-up 0.5s 100ms ease forwards', opacity: 0 }}>

          {/* Hop Tracker Card */}
          <div className="glass-card" style={{ padding: 24, gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 20, fontWeight: 700, color: '#1b1b23', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: '#b55d00', fontSize: 22 }}>route</span>
                Redirection Chain
              </h2>
              <span style={{ padding: '4px 12px', borderRadius: 999, background: 'rgba(199,196,215,0.25)', color: '#464554', fontSize: 12, fontWeight: 700 }}>
                {hops.length} Hops Detected
              </span>
            </div>

            {/* Hop Nodes list connected by vertical line */}
            <div style={{ position: 'relative', paddingLeft: 12 }}>
              {/* Vertical line connecting hops */}
              <div style={{
                position: 'absolute', left: 28, top: 20, bottom: 20, width: 2,
                background: 'linear-gradient(180deg, rgba(70,72,212,0.3), rgba(186,26,26,0.6))', zIndex: 0
              }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', zIndex: 1 }}>
                {hops.map((hop, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: i === hops.length - 1 ? 'rgba(186,26,26,0.1)' : 'rgba(70,72,212,0.1)',
                      border: i === hops.length - 1 ? '1px solid rgba(186,26,26,0.3)' : '1px solid rgba(70,72,212,0.3)',
                      color: i === hops.length - 1 ? '#ba1a1a' : '#4648d4',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: 13,
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                        {i === 0 ? 'input' : i === hops.length - 1 ? 'gpp_bad' : 'turn_right'}
                      </span>
                    </div>

                    <div className="glass-card" style={{ flex: 1, padding: 14, background: '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: '#1b1b23', wordBreak: 'break-all' }}>
                          {hop.url}
                        </span>
                        <span style={{
                          padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                          background: hop.status_code === 200 ? 'rgba(16,185,129,0.1)' : 'rgba(181,93,0,0.1)',
                          color: hop.status_code === 200 ? '#059669' : '#b55d00',
                        }}>
                          HTTP {hop.status_code}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: '#767586', marginTop: 4 }}>
                        {hop.reason}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technical Footprint Card */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 20, fontWeight: 700, color: '#1b1b23', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <span className="material-symbols-outlined" style={{ color: '#4648d4', fontSize: 22 }}>fingerprint</span>
              Technical Footprint
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['Domain Age', result?.whois?.created_at ? 'Registered 2024 (Fresh Domain)' : '14 days old (High Risk)'],
                ['WHOIS Registrar', result?.whois?.registrar || 'NameCheap, Inc.'],
                ['TLS Protocol', result?.tls?.version || 'TLS 1.3 Active'],
                ['SSL Expiration', result?.tls?.days_left ? `${result.tls.days_left} days remaining` : '84 days remaining'],
                ['IP Location', 'United States (US) · AS13335'],
              ].map(([k, val]) => (
                <div key={k} style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(199,196,215,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#767586' }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1b1b23' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
