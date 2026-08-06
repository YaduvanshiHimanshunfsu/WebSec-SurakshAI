/**
 * StitchLoginPage.jsx
 * Imported from Stitch by Google — login_websec_surakshai screen.
 * Faithfully converted from code.html to a React functional component.
 * Uses Web Animations API (matches Stitch output) + scoped CSS-in-JS.
 * Zero extra npm dependencies.
 *
 * Props:
 *   username, setUsername   — controlled text input
 *   password, setPassword   — controlled password input
 *   onLogin(e)              — async form-submit handler (parent handles fetch)
 *   loading                 — bool, shows spinner when true
 */
import { useState, useEffect, useRef } from 'react'

const PARTICLE_COLORS = [
  '#4648d4','#6b38d4','#6063ee','#e9ddff','#10b981','#06b6d4','#f59e0b',
]

export default function StitchLoginPage({ onLogin, loading }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const cardRef      = useRef(null)
  const staggersRef  = useRef([])
  const blob1Ref     = useRef(null)
  const blob2Ref     = useRef(null)
  const blob3Ref     = useRef(null)
  const rainbowRef   = useRef(null)
  const typeRef      = useRef(null)
  const particlesRef = useRef(null)
  const str1Ref      = useRef(null)
  const str2Ref      = useRef(null)
  const str3Ref      = useRef(null)
  const strLblRef    = useRef(null)
  const eyeRef       = useRef(null)
  const pwdInputRef  = useRef(null)
  const submitRef    = useRef(null)
  const toastRef     = useRef(null)

  useEffect(() => {
    // Card entrance
    requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.opacity = '1'
        cardRef.current.style.transform = 'translateY(0)'
      }
      staggersRef.current.forEach((el, i) => {
        if (!el) return
        setTimeout(() => {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        }, 100 + i * 80)
      })
    })

    // Blob animations
    const ab = (ref, dur, kf) => ref.current?.animate(kf, { duration: dur, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' })
    ab(blob1Ref, 20000, [{ transform:'translate(0,0) scale(1)' },{ transform:'translate(20%,10%) scale(1.2)' },{ transform:'translate(-10%,20%) scale(0.9)' }])
    ab(blob2Ref, 25000, [{ transform:'translate(0,0) scale(1)' },{ transform:'translate(-30%,15%) scale(1.1)' },{ transform:'translate(10%,-10%) scale(1)' }])
    ab(blob3Ref, 18000, [{ transform:'translate(0,0) rotate(0deg)' },{ transform:'translate(15%,-20%) rotate(180deg)' }])

    // Rainbow border
    rainbowRef.current?.animate([{ filter:'hue-rotate(0deg)' },{ filter:'hue-rotate(360deg)' }], { duration:6000, iterations:Infinity })

    // Typewriter
    const phrases = ['Web Security','Scam Detection','Phishing Analysis']
    let pi=0, ci=0, del=false, timer
    function type() {
      if (!typeRef.current) return
      const p = phrases[pi]
      typeRef.current.innerText = del ? p.slice(0,ci-1)+' |' : p.slice(0,ci+1)+' |'
      if (del) ci--; else ci++
      let speed = del ? 50 : 100
      if (!del && ci===p.length) { speed=2000; del=true }
      else if (del && ci===0) { del=false; pi=(pi+1)%phrases.length; speed=500 }
      timer = setTimeout(type, speed)
    }
    type()

    // Particles
    const orbs = [], cont = particlesRef.current
    if (cont) {
      for (let i=0; i<12; i++) {
        const el = document.createElement('div')
        const sz = 6 + Math.random()*12
        Object.assign(el.style, {
          position:'absolute', borderRadius:'50%', pointerEvents:'none',
          width:sz+'px', height:sz+'px',
          background: PARTICLE_COLORS[i%PARTICLE_COLORS.length],
          opacity:(0.25+Math.random()*0.3).toFixed(2),
          left:Math.random()*100+'%', top:Math.random()*100+'%',
          willChange:'transform',
        })
        cont.appendChild(el)
        const swayX = (Math.random()-0.5)*60
        el.animate([{ transform:'translate(0,0)' },{ transform:`translate(${swayX}px,-120px)` }],
          { duration:8000+Math.random()*12000, delay:Math.random()*8000, iterations:Infinity, direction:'alternate', easing:'ease-in-out' })
        orbs.push(el)
      }
    }
    return () => { clearTimeout(timer); orbs.forEach(o=>o.remove()) }
  }, [])

  function checkStrength(val) {
    const [s1,s2,s3,lbl] = [str1Ref.current,str2Ref.current,str3Ref.current,strLblRef.current]
    if (!s1) return
    ;[s1,s2,s3].forEach(s=>s.style.backgroundColor='transparent')
    if (!val) { if (lbl) { lbl.textContent='Strength: None'; lbl.style.color='' } return }
    let str=0
    if (val.length>5) str++
    if (/[A-Z]/.test(val)&&/[0-9]/.test(val)) str++
    if (/[^A-Za-z0-9]/.test(val)&&val.length>8) str++
    if (str===1) { s1.style.backgroundColor='#ef4444'; if(lbl){lbl.textContent='Strength: Weak';lbl.style.color='#ef4444'} }
    else if (str===2) { s1.style.backgroundColor='#f59e0b'; s2.style.backgroundColor='#f59e0b'; if(lbl){lbl.textContent='Strength: Medium';lbl.style.color='#f59e0b'} }
    else if (str===3) { [s1,s2,s3].forEach(s=>s.style.backgroundColor='#10b981'); if(lbl){lbl.textContent='Strength: Strong';lbl.style.color='#10b981'} }
    else { s1.style.backgroundColor='#ef4444'; if(lbl){lbl.textContent='Strength: Weak';lbl.style.color='#ef4444'} }
  }

  function toggleEye() {
    const inp=pwdInputRef.current, ic=eyeRef.current
    if (!inp||!ic) return
    if (inp.type==='password') { inp.type='text'; ic.textContent='visibility_off' }
    else { inp.type='password'; ic.textContent='visibility' }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (loading || isSubmitting) return
    setIsSubmitting(true)
    try {
      await onLogin(password, username)
    } catch (err) {
      if (toastRef.current) {
        const t = document.createElement('div')
        t.style.cssText = 'background:#1b1b23;border:1px solid #ba1a1a;border-radius:10px;padding:12px 18px;font-size:13px;color:#ffdad6;box-shadow:0 4px 20px rgba(0,0,0,.3);pointer-events:auto'
        t.textContent = '❌ ' + (err.message || 'Incorrect passphrase.')
        toastRef.current.appendChild(t)
        setTimeout(() => t.remove(), 3500)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
    .sl-root{font-family:'Inter',system-ui,sans-serif;background:#fcf8ff;min-height:100vh;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center;padding:48px 16px}
    .sl-blob{position:absolute;border-radius:9999px;mix-blend-mode:multiply}
    .sl-card-wrap{position:relative;width:100%;max-width:440px;z-index:10;opacity:0;transform:translateY(32px);transition:opacity .6s cubic-bezier(.22,1,.36,1),transform .6s cubic-bezier(.22,1,.36,1)}
    .sl-rainbow{position:absolute;inset:-2px;border-radius:18px;z-index:-1;background:linear-gradient(135deg,#4648d4,#6b38d4,#b55d00);opacity:.7;filter:blur(2px)}
    .sl-card{position:relative;background:rgba(252,248,255,.72);backdrop-filter:blur(24px) saturate(180%);border:1.5px solid #e4e1ed;border-radius:16px;padding:32px;box-shadow:0 0 0 1px rgba(255,255,255,.6) inset,0 8px 32px rgba(70,72,212,.12),0 32px 80px rgba(107,56,212,.06),0 2px 4px rgba(0,0,0,.04);overflow:hidden}
    .sl-stagger{opacity:0;transform:translateY(16px);transition:opacity .6s cubic-bezier(.34,1.56,.64,1),transform .6s cubic-bezier(.34,1.56,.64,1)}
    .sl-ping{position:absolute;inset:0;border-radius:9999px;border:1px solid rgba(255,255,255,.2);animation:sl-ping 2s cubic-bezier(0,0,.2,1) infinite;opacity:.2}
    @keyframes sl-ping{75%,100%{transform:scale(1.5);opacity:0}}
    .sl-input-wrap{position:relative}
    .sl-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#767586;font-size:20px;transition:color .2s;pointer-events:none;user-select:none}
    .sl-input-wrap:focus-within .sl-icon{color:#4648d4}
    .sl-input{width:100%;background:rgba(255,255,255,.5);border:1.5px solid #c7c4d7;border-radius:8px;padding:12px 44px;font-family:'Inter',system-ui;font-size:14px;color:#1b1b23;outline:none;transition:border-color .2s,box-shadow .2s,background .2s}
    .sl-input::placeholder{color:#767586}
    .sl-input:focus{border-color:#4648d4;background:#fff;box-shadow:0 0 0 3px rgba(70,72,212,.15)}
    .sl-eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#767586;font-size:20px;padding:0;line-height:1;transition:color .15s}
    .sl-eye:hover{color:#4648d4}
    .sl-str-bar{height:6px;background:#e4e1ed;border-radius:99px;overflow:hidden;display:flex;gap:4px;margin-top:6px}
    .sl-str-seg{flex:1;height:100%;border-radius:99px;background:transparent;transition:background-color .3s ease}
    .sl-btn{width:100%;padding:14px;border-radius:8px;background:linear-gradient(135deg,#4648d4,#6b38d4);color:#fff;font-family:'Plus Jakarta Sans',system-ui;font-size:15px;font-weight:700;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;position:relative;overflow:hidden;box-shadow:0 4px 16px rgba(70,72,212,.35),0 2px 4px rgba(0,0,0,.08);transition:transform .2s,box-shadow .2s,opacity .2s}
    .sl-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 24px rgba(70,72,212,.5)}
    .sl-btn:active:not(:disabled){transform:translateY(1px) scale(.99);box-shadow:0 2px 8px rgba(70,72,212,.25)}
    .sl-btn:disabled{opacity:.75;cursor:not-allowed}
    .sl-btn .sl-shine{position:absolute;inset:0;background:rgba(255,255,255,.15);transform:translateY(100%);transition:transform .3s ease}
    .sl-btn:hover:not(:disabled) .sl-shine{transform:translateY(0)}
    .sl-btn.sl-loading{background:linear-gradient(135deg,#4648d4,#6b38d4,#4648d4);background-size:200%;animation:sl-shimmer 1.5s linear infinite}
    @keyframes sl-shimmer{from{background-position:-200%}to{background-position:200%}}
    @keyframes sl-spin{to{transform:rotate(360deg)}}
    .sl-spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:sl-spin .8s linear infinite;flex-shrink:0}
    .sl-grad-text{background:linear-gradient(135deg,#4648d4,#6b38d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .sl-badge{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:9999px;font-size:11px;font-weight:600;font-family:'Inter',system-ui}
    .sl-badge-p{background:rgba(70,72,212,.1);color:#4648d4;border:1px solid rgba(70,72,212,.25)}
    .sl-badge-s{background:rgba(16,185,129,.08);color:#059669;border:1px solid rgba(16,185,129,.2)}
    .sl-label{display:flex;align-items:center;justify-content:space-between;font-family:'Inter',system-ui;font-size:13px;font-weight:600;color:#1b1b23;margin-bottom:6px}
    .sl-label a{font-size:12px;font-weight:400;color:#767586;text-decoration:none;transition:color .15s}
    .sl-label a:hover{color:#4648d4}
    .sl-divider{height:1px;background:linear-gradient(90deg,transparent,#c7c4d7,transparent);margin:20px 0}
    @media(max-width:480px){.sl-card{padding:24px 20px}.sl-card-wrap{max-width:calc(100vw - 32px)}}
  `

  return (
    <>
      <style>{CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

      <div className="sl-root">
        {/* Background */}
        <div style={{ position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0 }}>
          <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',opacity:.03,mixBlendMode:'overlay' }} xmlns="http://www.w3.org/2000/svg">
            <filter id="sl-noise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter>
            <rect width="100%" height="100%" filter="url(#sl-noise)"/>
          </svg>
          <div ref={blob1Ref} className="sl-blob" style={{ top:'-20%',left:'-10%',width:600,height:600,background:'#6063ee',opacity:.4,filter:'blur(80px)' }}/>
          <div ref={blob2Ref} className="sl-blob" style={{ top:'10%',right:'-10%',width:400,height:400,background:'#e9ddff',opacity:.5,filter:'blur(100px)' }}/>
          <div ref={blob3Ref} className="sl-blob" style={{ bottom:'-20%',left:'20%',width:500,height:500,background:'#ffdcc5',opacity:.4,filter:'blur(120px)' }}/>
          <div ref={particlesRef} style={{ position:'absolute',inset:0 }}/>
        </div>

        {/* Card */}
        <div ref={cardRef} className="sl-card-wrap">
          <div ref={rainbowRef} className="sl-rainbow"/>
          <div className="sl-card">

            {/* Logo & title */}
            <div ref={el=>staggersRef.current[0]=el} className="sl-stagger" style={{ display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',gap:12,marginBottom:24 }}>
              <div style={{ position:'relative',width:64,height:64,borderRadius:'50%',background:'linear-gradient(135deg,#4648d4,#6b38d4)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 24px rgba(70,72,212,.4)' }}>
                <span className="material-symbols-outlined" style={{ color:'#fff',fontSize:32 }}>security</span>
                <div className="sl-ping"/>
              </div>
              <h1 className="sl-grad-text" style={{ fontFamily:"'Plus Jakarta Sans',system-ui",fontSize:28,fontWeight:800,letterSpacing:'-0.02em',margin:0 }}>WebSec-SurakshAI</h1>
              <div style={{ display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center' }}>
                <span className="sl-badge sl-badge-p"><span className="material-symbols-outlined" style={{ fontSize:13 }}>smart_toy</span>AI-Powered</span>
                <span className="sl-badge sl-badge-s"><span className="material-symbols-outlined" style={{ fontSize:13 }}>school</span>NFSU Tripura</span>
              </div>
              <p ref={typeRef} style={{ fontFamily:'Inter,system-ui',fontSize:13,color:'#464554',minHeight:20,margin:0 }}/>
            </div>

            <div ref={el=>staggersRef.current[1]=el} className="sl-stagger sl-divider"/>

            {/* Form */}
            <form ref={el=>staggersRef.current[2]=el} className="sl-stagger" onSubmit={handleSubmit} style={{ display:'flex',flexDirection:'column',gap:16 }}>
              {/* Username */}
              <div>
                <label className="sl-label" htmlFor="sl-user">
                  <span style={{ display:'flex',alignItems:'center',gap:6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize:15,color:'#4648d4' }}>badge</span>
                    Agent ID / Email
                  </span>
                </label>
                <div className="sl-input-wrap">
                  <span className="sl-icon material-symbols-outlined">badge</span>
                  <input id="sl-user" type="text" className="sl-input" placeholder="agent@surakshai.gov" value={username} onChange={e=>setUsername(e.target.value)} required autoComplete="username"/>
                </div>
              </div>
              {/* Password */}
              <div>
                <label className="sl-label" htmlFor="sl-pwd">
                  <span style={{ display:'flex',alignItems:'center',gap:6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize:15,color:'#4648d4' }}>lock</span>
                    Secure Passphrase
                  </span>
                  <a href="#" onClick={e => { e.preventDefault(); if (toastRef.current) { const t = document.createElement('div'); t.style.cssText = 'background:#fff;border:1.5px solid #e4e1ed;border-radius:10px;padding:12px 18px;font-size:13px;color:#1b1b23;box-shadow:0 4px 20px rgba(0,0,0,.1);pointer-events:auto'; t.textContent = '🔒 Contact your admin to reset the passphrase.'; toastRef.current.appendChild(t); setTimeout(() => t.remove(), 3500); } }}>Forgot?</a>
                </label>
                <div className="sl-input-wrap">
                  <span className="sl-icon material-symbols-outlined">lock</span>
                  <input ref={pwdInputRef} id="sl-pwd" type="password" className="sl-input" placeholder="••••••••" value={password} onChange={e=>{ setPassword(e.target.value); checkStrength(e.target.value) }} required autoComplete="current-password"/>
                  <button type="button" className="sl-eye" onClick={toggleEye} tabIndex={-1}>
                    <span ref={eyeRef} className="material-symbols-outlined">visibility</span>
                  </button>
                </div>
                <div className="sl-str-bar">
                  <div ref={str1Ref} className="sl-str-seg"/>
                  <div ref={str2Ref} className="sl-str-seg"/>
                  <div ref={str3Ref} className="sl-str-seg"/>
                </div>
                <span ref={strLblRef} style={{ fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em',color:'#767586' }}>Strength: None</span>
              </div>
              {/* Submit */}
              <button ref={submitRef} type="submit" className={`sl-btn${loading?' sl-loading':''}`} disabled={loading}>
                <div className="sl-shine"/>
                <span style={{ position:'relative',zIndex:1,display:'flex',alignItems:'center',gap:8 }}>
                  {loading
                    ? <><div className="sl-spinner"/>Authenticating…</>
                    : <>Enter Dashboard<span className="material-symbols-outlined" style={{ fontSize:18 }}>arrow_forward</span></>}
                </span>
              </button>
            </form>

            {/* Footer */}
            <div ref={el=>staggersRef.current[3]=el} className="sl-stagger" style={{ marginTop:20,textAlign:'center' }}>
              <p style={{ fontFamily:'Inter,system-ui',fontSize:11,color:'#767586',display:'flex',alignItems:'center',justifyContent:'center',gap:4,flexWrap:'wrap' }}>
                <span className="material-symbols-outlined" style={{ fontSize:14 }}>encrypted</span>
                Developed by Himanshu Yadav · NFSU Tripura Campus
              </p>
            </div>
          </div>
        </div>

        <div ref={toastRef} style={{ position:'fixed',top:24,right:24,display:'flex',flexDirection:'column',gap:10,zIndex:9999,pointerEvents:'none' }}/>
      </div>
    </>
  )
}
