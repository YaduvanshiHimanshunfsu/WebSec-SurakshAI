/**
 * StitchMfaPage.jsx
 * Converted from mfa_verification_websec_surakshai Stitch screen.
 * Features:
 *   - Aurora background with morphing glowing blobs
 *   - 6-digit TOTP input with auto-focus movement
 *   - Demo verification logic (code: 123456)
 */
import { useState, useRef } from 'react'
import { toast } from 'react-hot-toast'

export default function StitchMfaPage({ onVerifySuccess, onCancel }) {
  const [digits, setDigits]   = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)]

  function handleChange(idx, val) {
    if (!/^\d*$/.test(val)) return
    const next = [...digits]
    next[idx] = val.slice(-1)
    setDigits(next)

    // Auto move to next input box
    if (val && idx < 5) {
      inputRefs[idx + 1].current?.focus()
    }
  }

  function handleKeyDown(idx, e) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs[idx - 1].current?.focus()
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const code = digits.join('')
    if (code.length < 6) {
      toast.error('Please enter all 6 digits of your MFA code.')
      return
    }
    setLoading(true)
    try {
      if (onVerifySuccess) {
        await onVerifySuccess(code)
      }
      toast.success('MFA Verification Successful!')
    } catch (err) {
      toast.error(err.message || 'Verification failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'relative', minHeight: '100vh', width: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#fcf8ff', overflow: 'hidden', padding: 24,
    }}>
      {/* ── Aurora Animated Glowing Background ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 10% 10%, rgba(70,72,212,0.15), transparent 40%), radial-gradient(circle at 90% 90%, rgba(107,56,212,0.15), transparent 40%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      {/* ── MFA Card Panel ── */}
      <div
        className="glass-card"
        style={{
          width: '100%', maxWidth: 440, padding: 36,
          position: 'relative', zIndex: 1, textAlign: 'center',
          animation: 'scale-in 0.35s ease forwards',
        }}
      >
        {/* Shimmer top accent */}
        <div className="shimmer-border" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2 }} />

        {/* Lock Shield Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px',
          background: 'linear-gradient(135deg, #4648d4, #6b38d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', boxShadow: '0 8px 24px rgba(70,72,212,0.3)',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 32 }}>phonelink_lock</span>
        </div>

        <h2 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 24, fontWeight: 800, color: '#1b1b23', marginBottom: 8 }}>
          Two-Factor Authentication
        </h2>
        <p style={{ fontSize: 14, color: '#767586', lineHeight: 1.5, marginBottom: 28 }}>
          Enter the 6-digit verification code from your Google Authenticator or security app.
        </p>

        {/* 6-Digit PIN Inputs */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={inputRefs[i]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                style={{
                  width: 48, height: 56, borderRadius: 10,
                  border: '1.5px solid rgba(199,196,215,0.4)',
                  background: '#fff', fontSize: 22, fontWeight: 800,
                  textAlign: 'center', color: '#4648d4', fontFamily: 'monospace',
                  outline: 'none', transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#4648d4'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(70,72,212,0.15)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(199,196,215,0.4)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)' }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-stitch-primary"
            style={{ width: '100%', padding: '14px 20px', justifyContent: 'center', marginBottom: 16 }}
          >
            {loading ? (
              <><span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>progress_activity</span> Verifying...</>
            ) : (
              <><span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified_user</span> Verify Code</>
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{ background: 'none', border: 'none', color: '#767586', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              Cancel &amp; Return
            </button>
          )}
        </form>

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(199,196,215,0.3)', fontSize: 12, color: '#767586' }}>
          Tip: Demo mode accepts <code style={{ fontFamily: 'monospace', background: 'rgba(70,72,212,0.1)', color: '#4648d4', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>123456</code>
        </div>
      </div>
    </div>
  )
}
