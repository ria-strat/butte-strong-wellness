import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import BottomNav from './components/BottomNav'

import Login from './pages/Login'
import Home from './pages/Home'
import PeerSupport from './pages/PeerSupport'
import PhysicalFitness from './pages/PhysicalFitness'
import MindsetResilience from './pages/MindsetResilience'
import FamilyResources from './pages/FamilyResources'
import NewsEvents from './pages/NewsEvents'
import About from './pages/About'
import Feedback from './pages/Feedback'
import GetHelp from './pages/GetHelp'
import Resources from './pages/Resources'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

// Full-screen loading spinner shown while session is being checked
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
  const { session, loading } = useAuth()
  const isAdmin = location.pathname.startsWith('/admin')

  // Still checking session — show spinner to avoid flash
  if (loading) return <LoadingScreen />

  // Admin routes: bypass auth gate (AdminDashboard handles its own auth + role check)
  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin"           element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    )
  }

  // Not logged in → login page or redirect to it
  if (!session) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*"      element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // Logged in → full app
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-cream pb-16">
      <Routes>
        <Route path="/"                  element={<Home />} />
        <Route path="/peer-support"      element={<PeerSupport />} />
        <Route path="/physical-fitness"  element={<PhysicalFitness />} />
        <Route path="/mindset-resilience" element={<MindsetResilience />} />
        <Route path="/family-resources"  element={<FamilyResources />} />
        <Route path="/news-events"       element={<NewsEvents />} />
        <Route path="/about"             element={<About />} />
        <Route path="/feedback"          element={<Feedback />} />
        <Route path="/get-help"          element={<GetHelp />} />
        <Route path="/resources"         element={<Resources />} />
        {/* Logged-in users hitting /login go to home */}
        <Route path="/login"             element={<Navigate to="/" replace />} />
        <Route path="*"                  element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  )
}
