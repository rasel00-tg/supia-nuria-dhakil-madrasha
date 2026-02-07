import React, { useState, useEffect, createContext, useContext } from 'react'
import { HashRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { ArrowLeft } from 'lucide-react'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Notices from './pages/Notices'
import TeachersList from './pages/TeachersList'
import Gallery from './pages/Gallery'
import AdmissionInfo from './pages/AdmissionInfo'
import Login from './pages/Login'
import Register from './pages/Register'
import AiChat from './pages/AiChat'
import AiMemorial from './pages/AiMemorial'
import Admission from './pages/Admission'
import Routine from './pages/Routine'
import AdminDashboard from './pages/dashboards/AdminDashboard'
import TeacherDashboard from './pages/dashboards/TeacherDashboard'
import StudentDashboard from './pages/dashboards/StudentDashboard'

// Components
import Sidebar from './components/Sidebar'
import Preloader from './components/Preloader'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import AiFloatingButton from './components/AiFloatingButton'
import WelcomeScreen from './components/WelcomeScreen'

export const AuthContext = createContext()

const AppContent = ({ loading, user, role, isAuthChecking }) => {
    const location = useLocation()
    const isDashboard = location.pathname.startsWith('/student') ||
        location.pathname.startsWith('/teacher') ||
        location.pathname.startsWith('/admin')
    const isLoginPage = location.pathname === '/login'

    // Page Transition Loader Logic
    const [isPageLoading, setIsPageLoading] = useState(false);

    useEffect(() => {
        setIsPageLoading(true);
        const timer = setTimeout(() => {
            setIsPageLoading(false);
        }, 1000); // 1 second branding display
        return () => clearTimeout(timer);
    }, [location.pathname]);

    const showLoader = loading || isPageLoading;

    const getDashboardRoute = () => {
        if (!role) return '/login'
        if (role === 'teacher') return '/teacher'
        if (role === 'admin') return '/admin'
        return '/student'
    }

    return (
        <div className="relative min-h-screen flex flex-col">
            <ScrollToTop />
            {showLoader && <Preloader />}
            <Toaster position="top-right" />

            {/* Sidebar only for non-dashboard pages and not login, managing layout manually for dashboard if needed */}
            {!isDashboard && !isLoginPage && <Sidebar />}

            {/* Show "Go Back" button if on Dashboard Routes */}
            {isDashboard && (
                <div className="fixed top-4 left-4 z-[100] md:hidden">
                    <Link to="/" className="w-10 h-10 bg-white/80 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center text-slate-700 border border-slate-200">
                        <ArrowLeft size={20} />
                    </Link>
                </div>
            )}

            {/* Main Content Wrapper - Flex Grow to push footer down */}
            <div className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/notices" element={<Notices />} />
                    <Route path="/teachers" element={<TeachersList />} />
                    <Route path="/routine" element={<Routine />} />
                    <Route path="/admission" element={<Admission />} />
                    <Route path="/admission-info" element={<AdmissionInfo />} />
                    <Route path="/gallery" element={<Gallery />} />

                    {/* Redirect if already logged in */}
                    <Route
                        path="/login"
                        element={(!isAuthChecking && user) ? <Navigate to={getDashboardRoute()} replace /> : <Login />}
                    />

                    <Route path="/register" element={<Register />} />
                    <Route path="/ai-chat" element={<AiChat />} />
                    <Route path="/ai-memorial" element={<AiMemorial />} />

                    <Route
                        path="/admin/*"
                        element={(!isAuthChecking && role === 'admin') ? <AdminDashboard /> : (!isAuthChecking ? <Navigate to="/login" /> : null)}
                    />
                    <Route
                        path="/teacher/*"
                        element={(!isAuthChecking && role === 'teacher') ? <TeacherDashboard /> : (!isAuthChecking ? <Navigate to="/login" /> : null)}
                    />
                    <Route
                        path="/student/*"
                        element={(!isAuthChecking && role === 'student') ? <StudentDashboard /> : (!isAuthChecking ? <Navigate to="/login" /> : null)}
                    />
                </Routes>
            </div>

            {/* Hide AI Button on Dashboard Routes, but keep on Login. Hide Footer on Dashboard AND Login */}
            {!isDashboard && !isLoginPage && <Footer />}
        </div>
    )
}

const App = () => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)
    const [isAuthChecking, setIsAuthChecking] = useState(true)
    const [showWelcome, setShowWelcome] = useState(false)

    useEffect(() => {
        // Welcome Screen Logic - Show only once per session
        const hasVisited = sessionStorage.getItem('welcomeShown')
        if (!hasVisited) {
            setShowWelcome(true)
            sessionStorage.setItem('welcomeShown', 'true')
        }
    }, [])

    useEffect(() => {
        // Check for Demo Mode first
        const demoRole = localStorage.getItem('demo_role')
        if (demoRole === 'student') {
            setUser({ uid: 'demo_123', email: 'demo@student.com', displayName: 'Demo Student' })
            setRole('student')
            setIsAuthChecking(false)
            setLoading(false)
            return
        }
        if (demoRole === 'teacher') {
            setUser({ uid: 'demo_teacher_123', email: 'teacher@demo.com', displayName: 'Demo Teacher' })
            setRole('teacher')
            setIsAuthChecking(false)
            setLoading(false)
            return
        }
        if (demoRole === 'admin') {
            setUser({ uid: 'demo_admin_123', email: 'admin@demo.com', displayName: 'Demo Admin' })
            setRole('admin')
            setIsAuthChecking(false)
            setLoading(false)
            return
        }

        // Firebase Auth Listener
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser)
                await fetchProfile(currentUser.uid)
            } else {
                setUser(null)
                setRole(null)
            }
            setIsAuthChecking(false)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const fetchProfile = async (uid) => {
        try {
            // Updated Logic: Check 'users' collection first as per new requirement
            // This is the primary source of truth for Role-Based Access Control
            const userRef = doc(db, 'users', uid)
            const userSnap = await getDoc(userRef)

            if (userSnap.exists()) {
                const data = userSnap.data()
                if (data.role) {
                    setRole(data.role)
                    return
                }
            }

            // Fallback for backward compatibility (Legacy collections)

            // Check 'teachers' collection
            const teacherRef = doc(db, 'teachers', uid)
            const teacherSnap = await getDoc(teacherRef)
            if (teacherSnap.exists()) {
                setRole('teacher')
                return
            }

            // Check 'admins' collection
            const adminRef = doc(db, 'admins', uid)
            const adminSnap = await getDoc(adminRef)
            if (adminSnap.exists()) {
                setRole('admin')
                return
            }

            // Check 'students' collection
            const studentRef = doc(db, 'students', uid)
            const studentSnap = await getDoc(studentRef)
            if (studentSnap.exists()) {
                setRole('student')
                return
            }

            // Default to student if no role found but logged in
            setRole('student')

        } catch (err) {
            console.error('Error fetching profile:', err)
            // Fallback set to student to ensure UI loads even if DB fails
            setRole('student')
            // Don't log out user here, just degrade gracefully
        }
    }

    return (
        <AuthContext.Provider value={{ user, role, loading: isAuthChecking }}>
            <Router>
                <AppContent
                    loading={loading || isAuthChecking}
                    user={user}
                    role={role}
                    isAuthChecking={isAuthChecking}
                />
            </Router>
            {showWelcome && <WelcomeScreen onComplete={() => setShowWelcome(false)} />}
        </AuthContext.Provider>
    )
}

export default App
