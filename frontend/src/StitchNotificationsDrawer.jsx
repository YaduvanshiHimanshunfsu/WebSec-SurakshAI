/**
 * StitchNotificationsDrawer.jsx
 * Converted from system_notifications_websec_surakshai Stitch screen.
 * Slide-out drawer showing real-time security alerts, severity pills, and action shortcuts.
 */
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

export default function StitchNotificationsDrawer({ open, onClose, getNotifications, onViewReport }) {
  const [items, setItems]       = useState([])
  const [filter, setFilter]     = useState('all')
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    getNotifications()
      .then(res => setItems(res.notifications || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [open])

  if (!open) return null

  const filtered = items.filter(item => {
    if (filter === 'critical') return item.severity === 'critical'
    if (filter === 'warning') return item.severity === 'warning'
    return true
  })

  function handleMarkAllRead() {
    setItems(prev => prev.map(i => ({ ...i, read: true })))
    toast.success('All notifications marked as read.')
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(27,27,35,0.4)',
          backdropFilter: 'blur(4px)',
          animation: 'fade-in 0.2s ease forwards',
        }}
      />

      {/* Slide-out Drawer Panel */}
      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: 440, height: '100%',
        background: 'rgba(252,248,255,0.95)', backdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(199,196,215,0.6)',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column',
        animation: 'slide-in-right 0.3s ease forwards',
      }}>

        {/* Drawer Header */}
        <div style={{ padding: 24, borderBottom: '1px solid rgba(199,196,215,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(70,72,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4648d4' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
            </div>
            <div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 18, fontWeight: 800, color: '#1b1b23' }}>System Notifications</h2>
              <span style={{ fontSize: 12, color: '#767586' }}>Real-time Security Alerts</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#767586', padding: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>

        {/* Filter Pills & Mark Read Bar */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(199,196,215,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'critical', 'warning'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '4px 12px', borderRadius: 999, border: 'none', cursor: 'pointer',
                  background: filter === f ? '#4648d4' : 'rgba(199,196,215,0.25)',
                  color: filter === f ? '#fff' : '#464554',
                  fontSize: 12, fontWeight: 700, textTransform: 'capitalize',
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4648d4', fontSize: 12, fontWeight: 600 }}>
            Mark all read
          </button>
        </div>

        {/* Notification List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, color: '#767586' }}>
              <span className="material-symbols-outlined animate-spin" style={{ fontSize: 24, color: '#4648d4' }}>progress_activity</span>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#767586' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#c7c4d7', display: 'block', marginBottom: 8 }}>notifications_off</span>
              <p style={{ fontWeight: 600 }}>No notifications found</p>
            </div>
          ) : (
            filtered.map((item, i) => {
              const isCrit = item.severity === 'critical'
              const isWarn = item.severity === 'warning'
              const bg = isCrit ? 'rgba(186,26,26,0.06)' : isWarn ? 'rgba(181,93,0,0.06)' : 'rgba(255,255,255,0.7)'
              const border = isCrit ? 'rgba(186,26,26,0.2)' : isWarn ? 'rgba(181,93,0,0.2)' : 'rgba(199,196,215,0.4)'
              const color = isCrit ? '#ba1a1a' : isWarn ? '#b55d00' : '#4648d4'

              return (
                <div
                  key={item.id || i}
                  className="glass-card"
                  style={{
                    padding: 16, background: bg, borderColor: border,
                    position: 'relative', opacity: item.read ? 0.7 : 1,
                  }}
                >
                  {!item.read && (
                    <span style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: '50%', background: color }} />
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{
                      padding: '2px 6px', borderRadius: 4, background: `${color}15`, color,
                      fontSize: 10, fontWeight: 800, textTransform: 'uppercase'
                    }}>
                      {item.severity}
                    </span>
                    <span style={{ fontSize: 11, color: '#767586' }}>{item.category}</span>
                  </div>
                  <h4 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 14, fontWeight: 700, color: '#1b1b23', marginBottom: 4 }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: 13, color: '#464554', lineHeight: 1.5, marginBottom: 8 }}>
                    {item.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#767586' }}>
                    <span>{item.timestamp}</span>
                    {onViewReport && (
                      <button
                        onClick={() => { onClose(); onViewReport(1) }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4648d4', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        View Report →
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

      </div>
    </div>
  )
}
