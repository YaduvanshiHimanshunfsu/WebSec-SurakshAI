/**
 * WebSec-SurakshAI — Main Application (v4 — Full Stitch Design Suite)
 *
 * Full SPA with complete Stitch navigation & modules:
 *   - StitchLoginPage           — login screen
 *   - StitchLayout              — shared nav shell (Header + Drawer triggers)
 *   - StitchScannerPage         — security scanner
 *   - StitchScanningPage        — live scan progress (SSE)
 *   - StitchSocDashboardPage    — SOC Operations executive dashboard
 *   - StitchLinkIntelligencePage— Link Intelligence & Redirection Hop Tracker
 *   - StitchReportDetailPage    — individual scan report with findings & evidence
 *   - StitchReportsDashboardPage— reports list + aggregate stats
 *   - StitchAiAnalyzerPage      — AI scam analyzer (message/url/email)
 *   - StitchNotificationsDrawer — System Notifications slide-out drawer
 *   - StitchMfaPage             — MFA 6-digit verification security gate
 *
 * Author: Himanshu Yadav, National Forensic Sciences University, Tripura Campus
 */

import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import {
  analyseMessage, analyseUrl, analyseEmail, startPassiveScan,
  getDashboard, getReport, getAiRemediation, exportJson, exportPdf,
  apiLogin, apiLogout, getSocOverview, getNotifications, verifyMfa
} from './lib/api'

import StitchLoginPage            from './StitchLoginPage'
import StitchLayout               from './StitchLayout'
import StitchScannerPage          from './StitchScannerPage'
import StitchScanningPage         from './StitchScanningPage'
import StitchSocDashboardPage     from './StitchSocDashboardPage'
import StitchLinkIntelligencePage from './StitchLinkIntelligencePage'
import StitchAiAnalyzerPage       from './StitchAiAnalyzerPage'
import StitchReportDetailPage     from './StitchReportDetailPage'
import StitchReportsDashboardPage  from './StitchReportsDashboardPage'
import StitchNotificationsDrawer  from './StitchNotificationsDrawer'
import StitchMfaPage              from './StitchMfaPage'

// ─── App Root ─────────────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed]               = useState(false)
  const [checkingAuth, setCheckingAuth]   = useState(true)
  const [currentTab, setCurrentTab]       = useState('scanner')
  const [selectedReportId, setSelectedReportId] = useState(null)
  const [notifOpen, setNotifOpen]         = useState(false)

  // Scanner state (lifted so ScannerPage + ScanningPage share it)
  const [scanUrl, setScanUrl]         = useState('')
  const [scanning, setScanning]       = useState(false)
  const [scanId, setScanId]           = useState(null)
  const [scanLog, setScanLog]         = useState([])
  const [scanComplete, setScanComplete] = useState(false)
  const [recentScans, setRecentScans] = useState([])

  // ── Auth check on mount ──
  useEffect(() => {
    fetch('/api/auth/check', { credentials: 'include' })
      .then(r => { if (r.ok) setAuthed(true) })
      .catch(() => {})
      .finally(() => setCheckingAuth(false))
  }, [])

  // ── Prefetch recent scans for scanner "Recent Operations" list ──
  useEffect(() => {
    if (!authed) return
    getDashboard(1)
      .then(d => setRecentScans(d.scans || []))
      .catch(() => {})
  }, [authed])

  // ── Login ──
  async function handleLogin(password) {
    try {
      await apiLogin(password)
      setAuthed(true)
    } catch (e) {
      throw e
    }
  }

  // ── Logout ──
  async function handleLogout() {
    await apiLogout().catch(() => {})
    setAuthed(false)
    setCurrentTab('scanner')
    setSelectedReportId(null)
    setScanLog([]); setScanId(null); setScanComplete(false); setScanning(false)
  }

  // ── Start passive scan ──
  async function handleScanStart(url) {
    setScanLog([]); setScanId(null); setScanComplete(false)
    setScanUrl(url); setScanning(true)

    const data = await startPassiveScan(url)
    const id = data.scan_id
    setScanId(id)

    // Subscribe to SSE stream
    const evtSrc = new EventSource(`/passive/stream/${id}`)
    evtSrc.onmessage = (e) => {
      const msg = JSON.parse(e.data)
      if (msg.complete) {
        evtSrc.close()
        setScanning(false)
        setScanComplete(true)
        getDashboard(1).then(d => setRecentScans(d.scans || [])).catch(() => {})
      } else {
        setScanLog(prev => [...prev, msg])
      }
    }
    evtSrc.onerror = () => {
      evtSrc.close(); setScanning(false)
      toast.error('Scan stream disconnected. Check the backend.')
    }
  }

  // ── View a specific report ──
  function handleViewReport(scanId) {
    setSelectedReportId(scanId)
    setCurrentTab('reports')
    setScanLog([]); setScanComplete(false); setScanId(null); setScanning(false)
  }

  // ── Tab change clears report selection ──
  function handleTabChange(tab) {
    setCurrentTab(tab)
    if (tab !== 'reports') setSelectedReportId(null)
  }

  // ── Loading / auth gate ──
  if (checkingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fcf8ff' }}>
        <span className="material-symbols-outlined animate-spin" style={{ fontSize: 40, color: '#4648d4' }}>progress_activity</span>
      </div>
    )
  }

  if (!authed) {
    return (
      <>
        <StitchLoginPage onLogin={handleLogin} />
        <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Inter, system-ui', fontSize: 14, borderRadius: 10 } }} />
      </>
    )
  }

  // ── Main app (authenticated) ──
  return (
    <>
      <StitchLayout
        currentTab={currentTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        onToggleNotifications={() => setNotifOpen(o => !o)}
        unreadCount={2}
      >
        {/* ── Security Scanner Tab ── */}
        {currentTab === 'scanner' && !scanning && !scanComplete && (
          <StitchScannerPage
            onScanStart={handleScanStart}
            recentScans={recentScans}
            onViewReport={handleViewReport}
          />
        )}

        {/* ── Live Scanning Progress ── */}
        {currentTab === 'scanner' && (scanning || scanComplete) && (
          <StitchScanningPage
            targetUrl={scanUrl}
            scanLog={scanLog}
            scanning={scanning}
            scanComplete={scanComplete}
            scanId={scanId}
            exportJson={exportJson}
            exportPdf={exportPdf}
            onViewReport={handleViewReport}
            onNewScan={() => {
              setScanLog([]); setScanComplete(false)
              setScanId(null); setScanning(false); setScanUrl('')
            }}
          />
        )}

        {/* ── SOC Operations Dashboard ── */}
        {currentTab === 'soc' && (
          <StitchSocDashboardPage
            getSocOverview={getSocOverview}
            onRunScan={() => setCurrentTab('scanner')}
          />
        )}

        {/* ── Link Intelligence & Hop Tracker ── */}
        {currentTab === 'link-intel' && (
          <StitchLinkIntelligencePage
            analyseUrl={analyseUrl}
          />
        )}

        {/* ── AI Scam Analyzer Tab ── */}
        {currentTab === 'ai' && (
          <StitchAiAnalyzerPage
            analyseMessage={analyseMessage}
            analyseUrl={analyseUrl}
            analyseEmail={analyseEmail}
          />
        )}

        {/* ── Reports Dashboard ── */}
        {currentTab === 'reports' && !selectedReportId && (
          <StitchReportsDashboardPage
            getDashboard={getDashboard}
            onViewReport={(id) => setSelectedReportId(id)}
          />
        )}

        {/* ── Report Detail Page ── */}
        {currentTab === 'reports' && selectedReportId && (
          <StitchReportDetailPage
            scanId={selectedReportId}
            getReport={getReport}
            getAiRemediation={getAiRemediation}
            exportJson={exportJson}
            exportPdf={exportPdf}
            onBack={() => setSelectedReportId(null)}
          />
        )}

        {/* ── MFA Verification Gate View ── */}
        {currentTab === 'mfa' && (
          <StitchMfaPage
            onVerifySuccess={async (code) => {
              await verifyMfa(code)
              setCurrentTab('soc')
            }}
            onCancel={() => setCurrentTab('scanner')}
          />
        )}
      </StitchLayout>

      {/* ── Slide-Out Notifications Drawer ── */}
      <StitchNotificationsDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        getNotifications={getNotifications}
        onViewReport={handleViewReport}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'Inter, system-ui',
            fontSize: 14,
            borderRadius: 10,
            background: '#1b1b23',
            color: '#f2effb',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#f2effb' } },
          error:   { iconTheme: { primary: '#ba1a1a', secondary: '#f2effb' } },
        }}
      />
    </>
  )
}
