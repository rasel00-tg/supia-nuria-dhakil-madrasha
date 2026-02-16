import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User, AlertCircle, ArrowLeft, Clock, ShieldAlert, ArrowRight, CheckCircle } from 'lucide-react'
import logo from '../assets/logo.png'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'

// Custom Popup Component for Login
const LoginPopup = ({ isOpen, title, message, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center relative overflow-hidden border border-white/50"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />

                            <div className="w-20 h-20 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <CheckCircle size={40} className="text-emerald-500" />
                            </div>

                            <h3 className="text-2xl font-black text-slate-800 mb-2">{title}</h3>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">{message}</p>

                            <button onClick={onClose} className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95">
                                ড্যাশবোর্ডে প্রবেশ করুন
                            </button>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

const Login = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState(null)
    const [showForgotModal, setShowForgotModal] = useState(false)
    const [showSecurityDetails, setShowSecurityDetails] = useState(false)

    // Popup State
    const [popup, setPopup] = useState({ isOpen: false, title: '', message: '', targetPath: '' })

    // Lockout State
    const [failedAttempts, setFailedAttempts] = useState(0)
    const [isLocked, setIsLocked] = useState(false)
    const [lockoutEndTime, setLockoutEndTime] = useState(null)
    const [timeLeft, setTimeLeft] = useState(null)

    // Initialize state
    React.useEffect(() => {
        const storedAttempts = parseInt(localStorage.getItem('loginFailedAttempts') || '0')
        const storedLockoutTime = localStorage.getItem('loginLockoutEndTime')

        setFailedAttempts(storedAttempts)

        if (storedLockoutTime) {
            const endTime = parseInt(storedLockoutTime)
            if (Date.now() < endTime) {
                setIsLocked(true)
                setLockoutEndTime(endTime)
            } else {
                localStorage.removeItem('loginLockoutEndTime')
                localStorage.setItem('loginFailedAttempts', '0')
                setFailedAttempts(0)
                setIsLocked(false)
            }
        }
    }, [])

    // Timer Logic
    React.useEffect(() => {
        let interval
        if (isLocked && lockoutEndTime) {
            interval = setInterval(() => {
                const now = Date.now()
                const diff = lockoutEndTime - now
                if (diff <= 0) {
                    setIsLocked(false)
                    setLockoutEndTime(null)
                    setTimeLeft(null)
                    setFailedAttempts(0)
                    localStorage.removeItem('loginLockoutEndTime')
                    localStorage.setItem('loginFailedAttempts', '0')
                    clearInterval(interval)
                } else {
                    const minutes = Math.floor((diff / 1000 / 60) % 60)
                    const seconds = Math.floor((diff / 1000) % 60)
                    setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
                }
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isLocked, lockoutEndTime])

    const handleFailedAttempt = () => {
        const newAttempts = failedAttempts + 1
        setFailedAttempts(newAttempts)
        localStorage.setItem('loginFailedAttempts', newAttempts.toString())

        if (newAttempts >= 5) {
            const lockoutDuration = 60 * 60 * 1000 // 1 hour
            const endTime = Date.now() + lockoutDuration
            setIsLocked(true)
            setLockoutEndTime(endTime)
            localStorage.setItem('loginLockoutEndTime', endTime.toString())
            setError('অতিরিক্ত ভুল পাসওয়ার্ডের কারণে অ্যাকাউন্ট ১ ঘন্টার জন্য লক করা হয়েছে।')
        } else {
            setError(`পাসওয়ার্ড ভুল হয়েছে। (চেষ্টা ${newAttempts}/5)`)
        }
    }

    const handlePopupClose = () => {
        setPopup({ ...popup, isOpen: false })
        navigate(popup.targetPath)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isLocked) return

        setLoading(true)
        setError(null)

        try {
            // Mobile number normalization
            let email = formData.email
            if (/^\d{11}$/.test(email) || !email.includes('@')) {
                email = email + '@student.com'
            }

            // 1. Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, formData.password)
            const user = userCredential.user

            // Reset attempts on success
            setFailedAttempts(0)
            localStorage.setItem('loginFailedAttempts', '0')
            localStorage.removeItem('loginLockoutEndTime')

            // 2. Role Logic
            const userRef = doc(db, 'users', user.uid)
            const userSnap = await getDoc(userRef)
            const adminRef = doc(db, 'admins', user.uid)
            const adminSnap = await getDoc(adminRef)
            const teacherRef = doc(db, 'teachers', user.uid)
            const teacherSnap = await getDoc(teacherRef)

            let finalRole = 'student' // Default fallback
            let displayName = user.displayName || 'User'

            if (adminSnap.exists()) {
                finalRole = 'admin'
                displayName = adminSnap.data()?.full_name || 'Admin'
            } else if (teacherSnap.exists()) {
                finalRole = 'teacher'
                displayName = teacherSnap.data()?.full_name || 'Teacher'
            } else if (userSnap.exists()) {
                const userData = userSnap.data()
                if (userData.role) finalRole = userData.role.toLowerCase().trim()
                displayName = userData.full_name || 'Student'
            }

            // Show Welcome Popup
            let roleTitle = 'শিক্ষার্থী'
            if (finalRole === 'admin') roleTitle = 'এডমিন'
            if (finalRole === 'teacher') roleTitle = 'শিক্ষক'

            let welcomeMsg = `প্রিয় ${roleTitle} ${displayName}, আসসালামু আলাইকুম। আপনাকে প্যানেলে স্বাগতম।`
            if (finalRole === 'student') {
                welcomeMsg = `প্রিয় শিক্ষার্থী ${displayName}, আসসালামু আলাইকুম। আপনাকে স্বাগতম।`
            }

            setPopup({
                isOpen: true,
                title: 'স্বাগতম!',
                message: welcomeMsg,
                targetPath: `/${finalRole}`
            })

            setLoading(false)

            setLoading(false)

        } catch (err) {
            console.error("Login Error:", err)

            // Try Teacher Login (Manual Auth - Fallback for Password Resets)
            try {
                const q = query(
                    collection(db, 'teachers'),
                    where('email', '==', formData.email),
                    where('password', '==', formData.password)
                )
                const querySnapshot = await getDocs(q)

                if (!querySnapshot.empty) {
                    const teacherData = querySnapshot.docs[0].data()

                    setPopup({
                        isOpen: true,
                        title: 'স্বাগতম!',
                        message: `প্রিয় শিক্ষক ${teacherData.full_name}, আসসালামু আলাইকুম। আপনাকে প্যানেলে স্বাগতম।`,
                        targetPath: '/teacher'
                    })
                    setLoading(false)
                    return
                }
            } catch (subErr) {
                console.error("Teacher Auth Error:", subErr)
            }

            // Try Nurani Student Login (Manual Auth)
            try {
                const q = query(
                    collection(db, 'nurani_students'),
                    where('login_mobile', '==', formData.email), // Assuming user entered mobile in email field
                    where('password', '==', formData.password)
                )
                const querySnapshot = await getDocs(q)

                if (!querySnapshot.empty) {
                    const studentData = querySnapshot.docs[0].data()

                    setPopup({
                        isOpen: true,
                        title: 'স্বাগতম!',
                        message: `প্রিয় শিক্ষার্থী ${studentData.name}, আসসালামু আলাইকুম। আপনাকে স্বাগতম।`,
                        targetPath: '/nurani-department' // Redirect to Public View as per instructions
                    })
                    setLoading(false)
                    return // Stop execution here
                }
            } catch (subErr) {
                console.error("Nurani Auth Error:", subErr)
            }

            // Try General Student (4th-10th) Login (Manual Auth for Admin added students)
            try {
                const q = query(
                    collection(db, 'students'),
                    where('login_mobile', '==', formData.email),
                    where('password', '==', formData.password)
                )
                const querySnapshot = await getDocs(q)

                if (!querySnapshot.empty) {
                    const studentData = querySnapshot.docs[0].data()

                    setPopup({
                        isOpen: true,
                        title: 'স্বাগতম!',
                        message: `প্রিয় শিক্ষার্থী ${studentData.full_name || studentData.name}, আসসালামু আলাইকুম। আপনাকে স্বাগতম।`,
                        targetPath: '/student'
                    })
                    setLoading(false)
                    return
                }
            } catch (subErr) {
                console.error("Student Auth Error:", subErr)
            }

            handleFailedAttempt()
            const msg = err.code === 'auth/network-request-failed'
                ? 'ইন্টারনেট সংযোগ পরীক্ষা করুন।'
                : 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।'

            if (!isLocked) setError(msg)
            setLoading(false)
        }
    }

    if (showSecurityDetails) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-screen bg-slate-50 relative overflow-hidden font-bengali p-6 md:p-12 flex flex-col items-center justify-center text-center"
            >
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-500/5 rounded-full blur-[100px] -ml-32 -mb-32" />

                <div className="max-w-2xl relative z-10 bg-white p-8 md:p-12 rounded-[40px] shadow-2xl space-y-8 border border-red-100">
                    <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                        <ShieldAlert size={40} />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">সতর্কবার্তা ও আইনি নির্দেশনা</h2>
                        <div className="w-24 h-1.5 bg-red-500 mx-auto rounded-full" />
                    </div>

                    <div className="text-left bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 text-slate-700 font-medium leading-relaxed space-y-4 shadow-inner">
                        <p className="font-bold text-red-600 text-lg">⚠️ কঠোরভাবে নিষিদ্ধ:</p>
                        <p>
                            এই ওয়েবসাইটে অননুমোদিত প্রবেশ, ভুল তথ্য প্রদান, তথ্য বিকৃতি, হ্যাকিংয়ের চেষ্টা, ভুয়া আবেদন, অথবা যে কোনো প্রকার অপব্যবহার আইনত দণ্ডনীয় অপরাধ হিসেবে গণ্য হবে।
                        </p>
                        <p className="text-slate-500 italic text-sm">
                            <span className="text-red-500 font-bold">🔴 বিশেষ দ্রষ্টব্য:</span> যে কেউ ইচ্ছাকৃতভাবে বা অনিচ্ছাকৃতভাবে সিস্টেমে ক্ষতি সাধনের চেষ্টা করলে, মিথ্যা বা ভুল তথ্য সাবমিট করলে, অন্যের তথ্য ব্যবহার বা পরিবর্তনের চেষ্টা করলে, নিরাপত্তা ভঙ্গের চেষ্টা করলে—তার বিরুদ্ধে প্রযোজ্য আইন অনুযায়ী কঠোর আইনানুগ ব্যবস্থা গ্রহণ করা হবে।
                        </p>
                    </div>

                    <button
                        onClick={() => setShowSecurityDetails(false)}
                        className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto shadow-xl shadow-slate-900/20 active:scale-95"
                    >
                        <ArrowLeft size={20} />
                        ফিরে যান
                    </button>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden font-bengali">
            <LoginPopup isOpen={popup.isOpen} title={popup.title} message={popup.message} onClose={handlePopupClose} />

            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -ml-32 -mb-32" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] md:rounded-[40px] shadow-2xl shadow-emerald-900/10 p-6 md:p-10 w-full max-w-md relative z-10 border border-white mb-8"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-4 hover:scale-105 transition-transform">
                        <img src={logo} alt="Logo" className="w-20 h-20 md:w-24 md:h-24 mx-auto object-contain drop-shadow-xl" />
                    </Link>
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 whitespace-nowrap mb-2">সুফিয়া নূরীয়া দাখিল মাদ্রাসা</h2>
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 inline-block w-full">
                        <p className="text-rose-500 font-bold text-xs flex items-center justify-center gap-1.5 leading-tight">
                            <AlertCircle size={14} className="shrink-0" />
                            মাদ্রাসা কর্তৃক প্রোফাইল ভেরিফাই না থাকলে অ্যাকাউন্ট লগইন হবে না
                        </p>
                    </div>
                </div>

                {/* Status Messages */}
                {isLocked && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-2 shadow-lg shadow-rose-100">
                        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-2"><Clock size={24} /></div>
                        <h4 className="text-rose-700 font-black text-sm">অ্যাকাউন্ট সাময়িকভাবে লক করা হয়েছে।</h4>
                        <p className="text-rose-600 font-bold text-lg animate-pulse">অপেক্ষা করুন: {timeLeft} মিনিট</p>
                    </motion.div>
                )}
                {error && !isLocked && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 font-bold text-sm">
                        <AlertCircle size={18} /> {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">আইডি / ইমেইল</label>
                        <div className="relative group">
                            <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isLocked ? 'text-slate-300' : 'text-slate-400 group-focus-within:text-emerald-500'}`} size={20} />
                            <input
                                type="text"
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="এখানে নাম/আইডি দিন"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                disabled={isLocked}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">পাসওয়ার্ড</label>
                        <div className="relative group">
                            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isLocked ? 'text-slate-300' : 'text-slate-400 group-focus-within:text-emerald-500'}`} size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-12 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="কমপক্ষে ৬ সংখ্যার পাসওয়ার্ড দিন"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                disabled={isLocked}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50" disabled={isLocked}>
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-500 hover:text-slate-700">
                            <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" disabled={isLocked} />
                            মনে রাখুন
                        </label>
                        <button type="button" onClick={() => setShowForgotModal(true)} className="text-emerald-600 hover:text-emerald-700 hover:underline disabled:opacity-50" disabled={isLocked}>পাসওয়ার্ড ভুলে গেছেন?</button>
                    </div>

                    <div className="space-y-3 mt-4">
                        <button
                            type="submit"
                            disabled={loading || isLocked}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none flex items-center justify-center gap-3"
                        >
                            {isLocked ? 'লগইন বন্ধ আছে' : (loading ? <><span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span> চেক করা হচ্ছে...</> : 'লগইন করুন')}
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors"><ArrowLeft size={16} /> হোম পেজে ফিরে যান</Link>
                    </div>
                </form>

                <AnimatePresence>
                    {showForgotModal && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForgotModal(false)} className="fixed inset-0 bg-slate-900/60 z-50 backdrop-blur-sm" />
                            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-[32px] p-8 z-50 shadow-2xl text-center">
                                <img src={logo} alt="Logo" className="w-16 h-16 object-contain mx-auto mb-4" />
                                <h3 className="text-xl font-black text-slate-900 mb-2">পাসওয়ার্ড পুনরুদ্ধার</h3>
                                <p className="text-slate-500 text-xs font-bold mb-6">আপনার অ্যাকাউন্টের পাসওয়ার্ড পুনরুদ্ধার করতে নিচের নির্দেশনা অনুসরণ করুন।</p>

                                <div className="text-left bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 mb-8">
                                    <p className="text-slate-700 text-sm font-bold flex items-start gap-2">
                                        <span className="text-emerald-500 mt-1">●</span>
                                        সরাসরি অফিসে যোগাযোগ করুন।
                                    </p>
                                    <p className="text-slate-700 text-sm font-bold flex items-start gap-2">
                                        <span className="text-emerald-500 mt-1">●</span>
                                        আপনার স্টুডেন্ট আইডি ও সঠিক তথ্য প্রদান করুন।
                                    </p>
                                    <p className="text-slate-700 text-sm font-bold flex items-start gap-2">
                                        <span className="text-emerald-500 mt-1">●</span>
                                        অথবা এডমিন প্যানেলে যোগাযোগ করুন।
                                    </p>
                                </div>

                                <button onClick={() => setShowForgotModal(false)} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-900/20">ঠিক আছে, বুঝেছি</button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Security Notice Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-md bg-white/50 backdrop-blur-md border border-white/50 rounded-[32px] p-6 text-center space-y-3 relative z-10"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">
                    <ShieldAlert size={12} />
                    গুরুত্বপূর্ণ সতর্কবার্তা
                </div>
                <p className="text-slate-600 font-bold text-sm leading-relaxed">
                    সুফিয়া নূরীয়া দাখিল মাদ্রাসা–এর অফিসিয়াল ওয়েবসাইটটি শুধুমাত্র নির্ধারিত শিক্ষার্থী, অভিভাবক ও সংশ্লিষ্ট কর্তৃপক্ষের বৈধ ব্যবহারের জন্য সংরক্ষিত।
                </p>
                <button
                    onClick={() => setShowSecurityDetails(true)}
                    className="text-slate-900 hover:text-emerald-600 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1 transition-colors group"
                >
                    বিস্তারিত
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </motion.div>
        </div>
    )
}

export default Login
