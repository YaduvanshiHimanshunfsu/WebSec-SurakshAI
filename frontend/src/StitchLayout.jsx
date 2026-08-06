/**
 * StitchLayout.jsx — Shared navigation shell
 * Matches the Stitch header design used across all screens:
 *   - Fixed top bar with glassmorphism
 *   - Logo + NFSU subtitle
 *   - Material Symbols nav links
 *   - Mobile hamburger menu
 */
import { useState } from 'react'

const NAV_ITEMS = [
  { id: 'scanner',    label: 'Security Scanner', icon: 'search_check' },
  { id: 'soc',        label: 'SOC Dashboard',    icon: 'policy'       },
  { id: 'link-intel', label: 'Link Intelligence',icon: 'link'         },
  { id: 'ai',         label: 'AI Scam Analyzer', icon: 'auto_awesome'  },
  { id: 'reports',    label: 'Reports',           icon: 'bar_chart'     },
]

export default function StitchLayout({ children, currentTab, onTabChange, onLogout, onToggleNotifications, unreadCount = 2 }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#fcf8ff', fontFamily: "'Inter', system-ui" }}>
      {/* ── Fixed Header ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 64,
        background: 'rgba(228,225,237,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(199,196,215,0.6)',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          maxWidth: 1380, margin: '0 auto', width: '100%',
          padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, cursor: 'pointer' }} onClick={() => onTabChange('scanner')}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#4648d4',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(70,72,212,0.35)',
            }}>
              <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 20 }}>shield</span>
            </div>
            <div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontWeight: 800, fontSize: 16, color: '#1b1b23', lineHeight: 1.2 }}>
                WebSec-SurakshAI
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#767586' }}>
                NFSU · Tripura Campus
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 12px', borderRadius: 8,
                  border: currentTab === item.id ? '1px solid rgba(70,72,212,0.25)' : '1px solid transparent',
                  background: currentTab === item.id ? 'rgba(96,99,238,0.15)' : 'transparent',
                  color: currentTab === item.id ? '#4648d4' : '#767586',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (currentTab !== item.id) e.currentTarget.style.color = '#1b1b23' }}
                onMouseLeave={e => { if (currentTab !== item.id) e.currentTarget.style.color = '#767586' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right: Notifications + MFA + Logout + Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Notification Bell */}
            <button
              onClick={onToggleNotifications}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(199,196,215,0.4)',
                color: '#464554', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative', transition: 'all 0.15s',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>notifications</span>
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: 4, right: 4, width: 8, height: 8,
                  borderRadius: '50%', background: '#ba1a1a', border: '2px solid #fff'
                }} />
              )}
            </button>

            {/* MFA Security Gate Button */}
            <button
              onClick={() => onTabChange('mfa')}
              title="Two-Factor Security Gate"
              style={{
                padding: '6px 10px', borderRadius: 8,
                background: currentTab === 'mfa' ? 'rgba(70,72,212,0.15)' : 'transparent',
                border: '1px solid rgba(199,196,215,0.4)',
                color: currentTab === 'mfa' ? '#4648d4' : '#767586',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
              className="hidden-mobile"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>phonelink_lock</span>
              2FA
            </button>

            <button
              onClick={onLogout}
              style={{
                padding: '6px 12px', borderRadius: 8,
                background: 'transparent', border: '1px solid rgba(199,196,215,0.4)',
                color: '#767586', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              className="hidden-mobile"
            >
              Logout
            </button>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(96,99,238,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ color: '#4648d4', fontSize: 18 }}>person</span>
            </div>
            {/* Mobile hamburger */}
            <button
              className="show-mobile"
              onClick={() => setMobileOpen(o => !o)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1b1b23' }}
            >
              <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Dropdown ── */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
          background: 'rgba(228,225,237,0.97)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(199,196,215,0.6)',
          padding: '12px 16px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { onTabChange(item.id); setMobileOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 14px', borderRadius: 8, width: '100%',
                border: 'none', textAlign: 'left',
                background: currentTab === item.id ? 'rgba(96,99,238,0.15)' : 'transparent',
                color: currentTab === item.id ? '#4648d4' : '#464554',
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
          <hr style={{ border: 'none', borderTop: '1px solid rgba(199,196,215,0.4)', margin: '4px 0' }} />
          <button onClick={onLogout} style={{ padding: '10px 14px', color: '#ba1a1a', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 15 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'middle', marginRight: 8 }}>logout</span>
            Logout
          </button>
        </div>
      )}

      {/* ── Page Content ── */}
      <main style={{ paddingTop: 64, minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
