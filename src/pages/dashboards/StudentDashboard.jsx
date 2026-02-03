import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Book, Award, Bell, User, Calendar, ClipboardCheck, LogOut, CheckCircle, ChevronRight, Calculator, FileText, Check } from 'lucide-react'
import { AuthContext } from '../../App'
import logo from '../../assets/logo.png'
import { auth, db } from '../../firebase'
import { collection, query, orderBy, limit, onSnapshot, getDocs, where, updateDoc, doc, arrayUnion } from 'firebase/firestore'

const StudentDashboard = () => {
    const navigate = useNavigate()
    const { user, role } = useContext(AuthContext)
    const [activeTab, setActiveTab] = useState('dashboard')
    const [selectedHomework, setSelectedHomework] = useState(null)
    const [homeworkList, setHomeworkList] = useState([])
    const [noticeList, setNoticeList] = useState([])
    const [resultList, setResultList] = useState([])
    const [userProfile, setUserProfile] = useState(null)

    // Demo bypass or real auth logout
    const handleLogout = async () => {
        if (localStorage.getItem('demo_role')) {
            localStorage.removeItem('demo_role')
            window.location.href = '/'
            return
        }
        await auth.signOut()
        navigate('/login')
    }

    const markAsSeen = async (hwId) => {
        // Optimistic UI update
        setHomeworkList(prev => prev.map(hw => hw.id === hwId ? { ...hw, status: 'seen' } : hw))

        // If real user (not demo), update Firestore
        if (user?.uid && !localStorage.getItem('demo_role')) {
            try {
                const hwRef = doc(db, 'assignments', hwId)
                await updateDoc(hwRef, {
                    seenBy: arrayUnion(user.uid)
                })
            } catch (err) {
                console.error("Error marking seen:", err)
            }
        }
    }

    useEffect(() => {
        // Fetch User Profile (Class info needed for filtering)
        const fetchUserData = async () => {
            // If demo, use mock profile
            if (localStorage.getItem('demo_role')) {
                setUserProfile({ class: '১০ম', fullName: 'Demo Student', roll: '05' })
                // Set mock data for demo
                setNoticeList([
                    { id: 101, title: 'আগামীকালের ক্লাস স্থগিত', date: '2026-02-01', type: 'Urgent' },
                    { id: 102, title: 'Barshik Krira Protijogita 2026 Registration', date: '2026-01-28', type: 'General' },
                ])
                setHomeworkList([
                    { id: 1, subject: 'বাংলা', teacher: 'আব্দুল করিম', content: 'অধ্যায়-৪ রিডিং', date: '2026-02-01', status: 'unseen' },
                    { id: 2, subject: 'ইংরেজি', teacher: 'Md. Hasan', content: 'Chapter 5 Exercise', date: '2026-02-01', status: 'seen' }
                ])
                setResultList([
                    { id: 1, name: 'আব্দুল্লাহ আল মামুন', gpa: '5.00', rank: 1 },
                    { id: 6, name: 'ডেমো স্টুডেন্ট', gpa: '4.60', rank: 12, isMe: true }
                ])
                return
            }

            if (user?.uid) {
                // Real Firebase Data Fetching
                try {
                    // Notices (Real-time)
                    const qNotices = query(collection(db, 'notices'), orderBy('date', 'desc'), limit(5))
                    const unsubNotices = onSnapshot(qNotices, (snapshot) => {
                        setNoticeList(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
                    })

                    // Homeworks (Real-time) - renamed to Assignments
                    const qHomework = query(collection(db, 'assignments'), orderBy('createdAt', 'desc'), limit(10))
                    const unsubHomework = onSnapshot(qHomework, (snapshot) => {
                        const hwData = snapshot.docs.map(d => {
                            const data = d.data()
                            const isSeen = data.seenBy?.includes(user.uid)
                            return {
                                id: d.id,
                                ...data,
                                teacher: data.teacherName || 'Teacher',
                                subject: data.subject || 'General',
                                content: data.title + ' - ' + (data.details || ''),
                                status: isSeen ? 'seen' : 'unseen'
                            }
                        })
                        setHomeworkList(hwData)
                    })

                    // Results (Static fetch for now as it changes less often)
                    // Ideally filtered by current exam/class
                    const qResults = query(collection(db, 'results'), orderBy('gpa', 'desc'), limit(10))
                    const resultsSnap = await getDocs(qResults)
                    const resData = resultsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
                    setResultList(resData)

                    return () => {
                        unsubNotices()
                        unsubHomework()
                    }

                } catch (error) {
                    console.error("Error fetching dashboard data:", error)
                }
            }
        }

        fetchUserData()
    }, [user])

    // --- SUB-COMPONENTS ---
    const HomeworkModal = ({ hw, onClose }) => {
        if (!hw) return null
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative" onClick={e => e.stopPropagation()}>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200"><CheckCircle size={20} className="text-slate-400" /></button>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Book size={24} /></div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800">{hw.subject}</h3>
                            <p className="text-sm font-bold text-slate-500">শিক্ষক: {hw.teacher}</p>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6 space-y-2">
                        <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">হোমওয়ার্কের বিবরণ</h4>
                        <p className="text-slate-700 font-medium text-lg leading-relaxed">{hw.content}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Calendar size={14} /> {hw.date}</span>
                        {hw.status === 'unseen' ? (
                            <button onClick={() => { markAsSeen(hw.id); onClose() }} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2">
                                <Check size={18} /> Seen
                            </button>
                        ) : (
                            <span className="px-4 py-2 bg-slate-100 text-slate-500 font-bold rounded-xl flex items-center gap-2 cursor-default"><CheckCircle size={18} /> Seen</span>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 font-bengali text-slate-800">
            {/* --- HEADER --- */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                        <div>
                            <h1 className="font-black text-lg md:text-xl text-slate-800 leading-none">সুফিয়া নূরীয়া</h1>
                            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Student Portal</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="font-black text-sm text-slate-700">{user?.displayName || userProfile?.fullName || 'Student'}</span>
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{userProfile?.class || 'General'}</span>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-sm transition-colors border border-rose-100">
                            <LogOut size={16} /> <span className="hidden md:inline">লগআউট</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8">

                {/* --- WELCOME BANNER --- */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[32px] p-8 md:p-12 text-white shadow-2xl shadow-slate-900/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-4xl font-black mb-2">শিক্ষার্থী একাউন্ট, স্বাগতম!</h2>
                        <h3 className="text-xl md:text-2xl font-medium text-emerald-400 mb-6">{user?.displayName || 'Student'}</h3>
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
                                <User size={18} className="text-emerald-400" />
                                <span className="font-bold text-sm">Class: {userProfile?.class || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- LEFT COLUMN: NOTICES & HW --- */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Notices */}
                        <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black flex items-center gap-2"><Bell className="text-amber-500" size={24} /> নোটিশ বোর্ড</h3>
                                <Link to="/notices" className="text-sm font-bold text-slate-400 hover:text-emerald-600">সব দেখুন</Link>
                            </div>
                            <div className="space-y-4">
                                {noticeList.length === 0 ? <p className="text-slate-400 text-sm font-bold">কোনো নোটিশ নেই</p> : noticeList.map((notice, idx) => (
                                    <div key={notice.id} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all group cursor-pointer">
                                        <div className="flex flex-col items-center justify-center w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-100 shrink-0 group-hover:border-amber-200 group-hover:bg-amber-50 transition-colors">
                                            <span className="text-xs font-black text-slate-400 uppercase">{new Date(notice.date).toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-lg font-black text-slate-800">{new Date(notice.date).getDate()}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1 block">Notice #{idx + 1} • {notice.type || 'General'}</span>
                                            <h4 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1">{notice.title}</h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Homework Section */}
                        <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black flex items-center gap-2"><Book className="text-blue-500" size={24} /> আজকের হোমওয়ার্ক</h3>
                                <div className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{homeworkList.filter(h => h.status === 'unseen').length} Unseen</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {homeworkList.length === 0 ? <p className="text-slate-400 text-sm font-bold col-span-2">কোনো হোমওয়ার্ক নেই</p> : homeworkList.map(hw => (
                                    <div key={hw.id} className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${hw.status === 'unseen' ? 'bg-blue-50 border-blue-100 hover:shadow-lg hover:shadow-blue-500/10' : 'bg-slate-50 border-slate-100 opacity-70 hover:opacity-100'}`} onClick={() => setSelectedHomework(hw)}>
                                        {hw.status === 'unseen' && <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-black uppercase text-slate-400 tracking-wider date-text">{hw.date}</span>
                                            {hw.status === 'seen' && <CheckCircle size={16} className="text-emerald-500" />}
                                        </div>
                                        <h4 className="text-lg font-black text-slate-800 mb-1">{hw.subject}</h4>
                                        <p className="text-xs font-bold text-slate-500 mb-3">Tutor: {hw.teacher}</p>
                                        <button className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">বিস্তারিত দেখুন <ChevronRight size={12} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: RESULTS & HISTORY --- */}
                    <div className="space-y-8">
                        {/* Result Highlight */}
                        <div className="bg-gradient-to-b from-emerald-500 to-teal-700 rounded-[32px] p-8 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <Award size={48} className="mb-4 text-emerald-200" />
                            <h3 className="text-2xl font-black mb-1">ফলাফল তালিকা</h3>
                            <p className="text-emerald-100 text-sm font-medium mb-6">Class 10 • Latest Exams</p>


                            <div className="space-y-3">
                                {resultList.length === 0 ? <p className="text-xs text-white/50">এখনো ফলাফল প্রকাশ হয়নি</p> : resultList.slice(0, 5).map((res, idx) => (
                                    <div key={res.id || idx} className="flex items-center justify-between text-sm py-2 px-3 hover:bg-white/10 rounded-lg transition-colors cursor-default">
                                        <div className="flex items-center gap-3">
                                            <span className={`font-black w-6 text-center ${idx === 0 ? 'text-yellow-300 scale-125' : 'text-emerald-100'}`}>#{res.rank || idx + 1}</span>
                                            <span className="font-bold">{res.name}</span>
                                        </div>
                                        <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-xs">{res.gpa}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-6 py-3 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-colors text-sm">
                                সম্পূর্ণ ফলাফল দেখুন
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Homework Detailed Modal */}
            <AnimatePresence>
                {selectedHomework && <HomeworkModal hw={selectedHomework} onClose={() => setSelectedHomework(null)} />}
            </AnimatePresence>
        </div>
    )
}

export default StudentDashboard
