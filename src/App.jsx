import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Onboarding from './pages/Onboarding'

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

// Separate shell so we can read location for admin layout
function AppShell({ onboarded, onOnboardingComplete }) {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  // Admin routes: full-width, no BottomNav, bypass onboarding
  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    )
  }

  // Onboarding gate
  if (!onboarded) {
    return (
      <div className="max-w-md mx-auto min-h-[100dvh]">
        <Onboarding onComplete={onOnboardingComplete} />
      </div>
    )
  }

  // Main app
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-cream pb-16">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/peer-support" element={<PeerSupport />} />
        <Route path="/physical-fitness" element={<PhysicalFitness />} />
        <Route path="/mindset-resilience" element={<MindsetResilience />} />
        <Route path="/family-resources" element={<FamilyResources />} />
        <Route path="/news-events" element={<NewsEvents />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/get-help" element={<GetHelp />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default function App() {
  const [agency, setAgency] = useState(() => localStorage.getItem('bsw_agency'))

  function handleOnboardingComplete(selectedAgency) {
    localStorage.setItem('bsw_agency', selectedAgency)
    setAgency(selectedAgency)
  }

  return (
    <BrowserRouter>
      <AppShell onboarded={!!agency} onOnboardingComplete={handleOnboardingComplete} />
    </BrowserRouter>
  )
}
