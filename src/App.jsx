import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import { initOneSignal } from './lib/onesignal'
import BottomNav from './components/BottomNav'

import Login         from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import Onboarding    from './pages/Onboarding'
import Privacy       from './pages/Privacy'
import DeleteAccount from './pages/DeleteAccount'
import Home          from './pages/Home'
import PeerSupport   from './pages/PeerSupport'
import PhysicalFitness    from './pages/PhysicalFitness'
import MindsetResilience  from './pages/MindsetResilience'
import FamilyResources    from './pages/FamilyResources'
import NewsEvents    from './pages/NewsEvents'
import About         from './pages/About'
import Feedback      from './pages/Feedback'
import GetHelp       from './pages/GetHelp'
import Resources     from './pages/Resources'
import AdminLogin    from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

function LoadingScreen() {
  return (
    <div className="min-h-[100dvh] bg-navy flex items-center justify-center">
      <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24"
        fill="none" stroke="#C9A84C" strokeWidth="2.5">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
    </div>
  )
}

function AppShell() {
  const location = useLocation()
  const { session, loading, recoveryMode, profile, profileLoading } = useAuth()
  const isAdmin = location.pathname.startsWith('/admin')

  // Wait for session + profile to resolve before deciding what to show
  if (loading || profileLoading) return <LoadingScreen />

  // Admin routes: their own auth + role check inside AdminDashboard
  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin"           element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    )
  }

  // Privacy policy + account deletion are always public (required by app stores)
  if (location.pathname === '/privacy' || location.pathname === '/delete-account') {
    return (
      <Routes>
        <Route path="/privacy"        element={<Privacy />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
      </Routes>
    )
  }

  // Password recovery mode: Supabase fires this when user clicks the reset email link
  if (recoveryMode) {
    return <Routes><Route path="*" element={<ResetPassword />} /></Routes>
  }

  // Not logged in
  if (!session) {
    return (
      <Routes>
        <Route path="/login"          element={<Login />} />
        <Route path="/privacy"        element={<Privacy />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="*"               element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // Logged in but no agency selected yet → complete onboarding first
  if (!profile?.agency) {
    return <Onboarding />
  }

  // Fully authenticated + profile complete → main app
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-cream pb-16">
      <Routes>
        <Route path="/"                   element={<Home />} />
        <Route path="/peer-support"       element={<PeerSupport />} />
        <Route path="/physical-fitness"   element={<PhysicalFitness />} />
        <Route path="/mindset-resilience" element={<MindsetResilience />} />
        <Route path="/family-resources"   element={<FamilyResources />} />
        <Route path="/news-events"        element={<NewsEvents />} />
        <Route path="/about"              element={<About />} />
        <Route path="/feedback"           element={<Feedback />} />
        <Route path="/get-help"           element={<GetHelp />} />
        <Route path="/resources"          element={<Resources />} />
        <Route path="/privacy"            element={<Privacy />} />
        <Route path="/delete-account"     element={<DeleteAccount />} />
        <Route path="/login"              element={<Navigate to="/" replace />} />
        <Route path="*"                   element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default function App() {
  useEffect(() => { initOneSignal() }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  )
}
