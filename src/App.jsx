import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import DashboardLayout from './components/DashboardLayout'

import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import Login from './pages/Login'
import Register from './pages/Register'

import DashboardHome from './pages/DashboardHome'
import Opportunities from './pages/Opportunities'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Lesson from './pages/Lesson'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import Certificate from './pages/Certificate'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  return children
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  const { user } = useAuth()

  // Determine which layout to show
  const isAppRoute = location.pathname.startsWith('/app')
  const isOnboarding = location.pathname === '/onboarding'
  const isCertificate = location.pathname.startsWith('/certificate')
  const isAuth = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/admin'
  const bare = isOnboarding || isCertificate || isAuth || isAppRoute

  return (
    <div className={`${!isAppRoute ? 'min-h-screen flex flex-col' : ''}`}>
      <ScrollToTop />
      {!bare && <Navbar />}
      <main className={`${!bare ? 'flex-1 pt-16' : ''}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/app" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/app" replace /> : <Register />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/certificate/:courseId" element={<Certificate />} />

          <Route path="/admin" element={<Admin />} />

          {/* Protected dashboard routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<CourseDetail />} />
            <Route path="courses/:id/lesson/:lessonId" element={<Lesson />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Legacy redirects */}
          <Route path="/dashboard" element={<Navigate to="/app" replace />} />
          <Route path="/courses" element={<Navigate to="/app/courses" replace />} />
          <Route path="/courses/:id" element={<Navigate to="/app/courses/:id" replace />} />
          <Route path="/opportunities" element={<Navigate to="/app/opportunities" replace />} />
          <Route path="/app/admin" element={<Navigate to="/admin" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {!bare && <Footer />}
    </div>
  )
}
