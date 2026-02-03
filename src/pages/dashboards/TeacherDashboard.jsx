import React, { useState, useEffect, useContext } from 'react'
import { auth, db } from '../../firebase'
import { signOut } from 'firebase/auth'
import {
    collection, query, where, getDocs, addDoc, doc, updateDoc,
    serverTimestamp, orderBy, getDoc, setDoc, limit
} from 'firebase/firestore'
import {
    Users, BookOpen, FileText, Calendar, LogOut,
    MessageSquare, Star, Send, Clock, AlertTriangle,
    Save, StickyNote, ClipboardList, PenTool, Layout, Award,
    MapPin, CheckCircle, Lock, Info, X, Home, GraduationCap,
    MoreHorizontal, ChevronRight
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { AuthContext } from '../../App'

const TeacherDashboard = () => {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)

    // Core Data
    const [teacherProfile, setTeacherProfile] = useState(null)
    const [students, setStudents] = useState([])

    // UI State
    const [activeTab, setActiveTab] = useState('students')
    const [loading, setLoading] = useState(true)
    const [selectedClass, setSelectedClass] = useState('class_6')
    const [showDevProfile, setShowDevProfile] = useState(false)
    const [selectedNote, setSelectedNote] = useState(null) // For viewing full note

    // Feature: Student Management & Warning System
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [studentWarnings, setStudentWarnings] = useState([])
    const [warningInput, setWarningInput] = useState('')

    // Feature: Assignments
    const [assignmentData, setAssignmentData] = useState({
        subject: '', chapter: '', page: '', title: '', details: ''
    })
    const [assignmentsHistory, setAssignmentsHistory] = useState([])

    // Feature: Notes
    const [noteInput, setNoteInput] = useState('')
    const [noteClass, setNoteClass] = useState('class_6')
    const [notes, setNotes] = useState([])

    // Feature: Attendance
    const [attendanceData, setAttendanceData] = useState({}) // studentId -> status
    const [attendanceStatus, setAttendanceStatus] = useState({
        isTaken: false,
        takenBy: '',
        takenByName: '',
        canEdit: true,
        editCount: 0
    })

    // CONSTANTS
    const ALL_CLASSES = [
        { value: 'class_1', label: 'Class 1' },
        { value: 'class_2', label: 'Class 2' },
        { value: 'class_3', label: 'Class 3' },
        { value: 'class_4', label: 'Class 4' },
        { value: 'class_5', label: 'Class 5' },
        { value: 'class_6', label: 'Class 6' },
        { value: 'class_7', label: 'Class 7' },
        { value: 'class_8', label: 'Class 8' },
        { value: 'class_9', label: 'Class 9' },
        { value: 'class_10', label: 'Class 10' },
    ]

    const isDemo = localStorage.getItem('demo_role') === 'teacher'

    // --- EFFECTS ---

    useEffect(() => {
        fetchInitialData()
    }, [user])

    useEffect(() => {
        if (activeTab === 'students' || activeTab === 'attendance') {
            fetchStudentsByClass(selectedClass)
        }
        if (activeTab === 'attendance') {
            checkAttendanceStatus()
        }
        if (activeTab === 'assignments_history') {
            fetchAssignments()
        }
    }, [selectedClass, activeTab])

    // Fetch warnings when a student is selected
    useEffect(() => {
        if (selectedStudent) {
            fetchStudentWarnings(selectedStudent.id)
        }
    }, [selectedStudent])


    // --- DATA FETCHING ---

    const fetchInitialData = async () => {
        if (!user) return
        setLoading(true)

        if (isDemo) {
            setTeacherProfile({ full_name: 'আব্দুল করিম (Demo)', subject: 'গণিত' })
            setLoading(false)
            return
        }

        try {
            const teacherRef = doc(db, 'teachers', user.uid)
            const teacherSnap = await getDoc(teacherRef)
            if (teacherSnap.exists()) {
                setTeacherProfile(teacherSnap.data())
            } else {
                setTeacherProfile({ full_name: 'শিক্ষক', subject: 'সাধারণ' })
            }
            fetchNotes() // Initial fetch
        } catch (error) {
            console.error(error)
            toast.error('প্রোফাইল লোড হয়নি')
        } finally {
            setLoading(false)
        }
    }

    const fetchStudentsByClass = async (className) => {
        if (isDemo) {
            setStudents([
                { id: '1', full_name: 'আব্দুল্লাহ', roll: '01', class: className, father_name: 'আব্দুর রহমান', phone: '01700000000', address: 'টেকনাফ' },
                { id: '2', full_name: 'রাহিম', roll: '02', class: className, father_name: 'করিম উল্লাহ', phone: '01800000000', address: 'কক্সবাজার' },
                { id: '3', full_name: 'করিম', roll: '03', class: className, father_name: 'জাফর আলম', phone: '01900000000', address: 'চট্টগ্রাম' },
                { id: '4', full_name: 'সাকিব', roll: '04', class: className, father_name: 'আহমেদ', phone: '01600000000', address: 'ঢাকা' }
            ])
            return
        }

        try {
            const q = query(collection(db, 'students'), where('class', '==', className))
            const querySnapshot = await getDocs(q)
            const studentsList = []
            querySnapshot.forEach((doc) => {
                studentsList.push({ id: doc.id, ...doc.data() })
            })
            setStudents(studentsList)
        } catch (error) {
            console.error(error)
        }
    }

    // Attendance Logic
    const checkAttendanceStatus = async () => {
        setAttendanceStatus({ isTaken: false, takenBy: '', takenByName: '', canEdit: true, editCount: 0 })
        const dateStr = new Date().toISOString().split('T')[0]
        const docId = `${dateStr}_${selectedClass}`

        if (isDemo) return

        try {
            const summaryRef = doc(db, 'attendance_summaries', docId)
            const summarySnap = await getDoc(summaryRef)

            if (summarySnap.exists()) {
                const data = summarySnap.data()
                const isTaken = true
                const takenBy = data.teacherId
                const isMyAttendance = takenBy === user.uid
                const canEdit = isMyAttendance && (data.editCount || 0) < 1

                setAttendanceStatus({
                    isTaken: true,
                    takenBy: takenBy,
                    takenByName: data.teacherName,
                    canEdit: canEdit,
                    editCount: data.editCount || 0
                })
            }
        } catch (error) {
            console.error("Attendance Check Error:", error)
        }
    }

    const submitAttendance = async () => {
        if (isDemo) {
            toast.success('হাজিরা গ্রহণ সম্পন্ন হয়েছে (Demo)')
            setAttendanceData({})
            return
        }

        // Logic Check: Prevent unauthorized submissions
        if (attendanceStatus.isTaken && !attendanceStatus.canEdit) {
            toast.error('আজকের হাজিরা সম্পন্ন হয়ে গেছে এবং লক করা হয়েছে।')
            return
        }

        const dateStr = new Date().toISOString().split('T')[0]
        const summaryId = `${dateStr}_${selectedClass}`

        try {
            // 1. Save Student Records (Using setDoc with merge to effectively upsert/overwrite)
            const batchPromises = Object.keys(attendanceData).map(async (studentId) => {
                if (studentId === 'viewStats') return

                // Create a unique ID for the daily attendance record per student to prevent duplicates
                const recordId = `${dateStr}_${studentId}`
                const recordRef = doc(db, 'attendance', recordId)

                await setDoc(recordRef, {
                    studentId,
                    status: attendanceData[studentId],
                    date: dateStr,
                    teacherId: user.uid,
                    class: selectedClass,
                    timestamp: serverTimestamp()
                }, { merge: true })
            })
            await Promise.all(batchPromises)

            // 2. Update Summary (Locking Mechanism)
            const summaryRef = doc(db, 'attendance_summaries', summaryId)
            const summarySnap = await getDoc(summaryRef)

            if (summarySnap.exists()) {
                await updateDoc(summaryRef, {
                    editCount: (summarySnap.data().editCount || 0) + 1,
                    lastUpdated: serverTimestamp()
                })
            } else {
                await setDoc(summaryRef, {
                    teacherId: user.uid,
                    teacherName: teacherProfile?.full_name || 'Unknown Teacher',
                    class: selectedClass,
                    date: dateStr,
                    editCount: 0,
                    createdAt: serverTimestamp()
                })
            }

            toast.success('হাজিরা সেভ করা হয়েছে')
            setAttendanceData({})
            checkAttendanceStatus()
        } catch (error) {
            console.error(error)
            toast.error('হাজিরা আপডেটে সমস্যা হয়েছে')
        }
    }

    const fetchAssignments = async () => {
        if (isDemo) {
            setAssignmentsHistory([
                { id: '1', title: 'Demo HW', subject: 'Math', chapter: '1', details: 'Details...', date: '2026-02-01', class: selectedClass }
            ])
            return
        }
        try {
            const q = query(
                collection(db, 'assignments'),
                where('teacherId', '==', user.uid),
                where('class', '==', selectedClass),
                orderBy('createdAt', 'desc')
            )
            const querySnapshot = await getDocs(q)
            const list = []
            querySnapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }))
            setAssignmentsHistory(list)
        } catch (error) {
            // Fallback
            const q2 = query(collection(db, 'assignments'), where('teacherId', '==', user.uid), orderBy('createdAt', 'desc'))
            const snap = await getDocs(q2)
            const list = []
            snap.forEach(d => {
                if (d.data().class === selectedClass) list.push({ id: d.id, ...d.data() })
            })
            setAssignmentsHistory(list)
        }
    }

    const handleAssignmentSubmit = async (e) => {
        e.preventDefault()
        if (isDemo) {
            toast.success('অ্যাসাইনমেন্ট পাঠানো হয়েছে! (Demo)')
            setAssignmentData({ subject: '', chapter: '', page: '', title: '', details: '' })
            return
        }
        try {
            await addDoc(collection(db, 'assignments'), {
                ...assignmentData,
                teacherId: user.uid,
                teacherName: teacherProfile?.full_name || 'Teacher',
                class: selectedClass,
                createdAt: serverTimestamp(),
                date: new Date().toLocaleDateString('bn-BD')
            })
            toast.success('অ্যাসাইনমেন্ট পাঠানো হয়েছে!')
            setAssignmentData({ subject: '', chapter: '', page: '', title: '', details: '' })
            if (activeTab === 'assignments_history') fetchAssignments()
        } catch (error) {
            toast.error('সমস্যা হয়েছে!')
        }
    }

    const fetchNotes = async () => {
        if (isDemo) {
            setNotes([{ id: '1', content: 'Demo Note with details content...', class: 'class_6', createdAt: { toDate: () => new Date() } }])
            return
        }
        try {
            const q = query(collection(db, 'teacher_notes'), where('teacherId', '==', user.uid), orderBy('createdAt', 'desc'))
            const querySnapshot = await getDocs(q)
            const list = []
            querySnapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }))
            setNotes(list)
        } catch (error) {
            console.error(error)
        }
    }

    const saveNote = async () => {
        if (!noteInput.trim()) return
        if (isDemo) {
            setNotes([{ id: Date.now(), content: noteInput, class: noteClass, createdAt: { toDate: () => new Date() } }, ...notes])
            setNoteInput('')
            toast.success('নোট সেভ করা হয়েছে (Demo)')
            return
        }
        try {
            await addDoc(collection(db, 'teacher_notes'), {
                content: noteInput,
                class: noteClass,
                teacherId: user.uid,
                createdAt: serverTimestamp()
            })
            setNoteInput('')
            fetchNotes()
            toast.success('নোট সেভ করা হয়েছে')
        } catch (error) {
            toast.error('নোট সেভ করা যায়নি')
        }
    }

    // --- STUDENT MONITORING ---
    const fetchStudentWarnings = async (studentId) => {
        if (isDemo) {
            setStudentWarnings([
                { id: 1, text: 'ক্লাসে মনোযোগ নেই', date: '2026-01-20', teacherName: 'হাসান স্যার' }
            ])
            return
        }
        try {
            const q = query(collection(db, 'student_warnings'), where('studentId', '==', studentId), orderBy('createdAt', 'desc'))
            const snap = await getDocs(q)
            const list = []
            snap.forEach(d => list.push({ id: d.id, ...d.data() }))
            setStudentWarnings(list)
        } catch (e) { console.error(e) }
    }

    const submitWarning = async () => {
        if (!warningInput.trim()) return
        if (isDemo) {
            setStudentWarnings([{ id: Date.now(), text: warningInput, date: 'Just now', teacherName: 'Demo Teacher' }, ...studentWarnings])
            setWarningInput('')
            toast.success('সতর্কবার্তা পাঠানো হয়েছে (Demo)')
            return
        }
        try {
            await addDoc(collection(db, 'student_warnings'), {
                studentId: selectedStudent.id,
                text: warningInput,
                teacherId: user.uid,
                teacherName: teacherProfile?.full_name || 'Unknown',
                createdAt: serverTimestamp(),
                date: new Date().toLocaleDateString('bn-BD')
            })
            toast.success('সতর্কবার্তা পাঠানো হয়েছে')
            setWarningInput('')
            fetchStudentWarnings(selectedStudent.id)
        } catch (e) {
            toast.error('সমস্যা হয়েছে')
        }
    }

    const submitRating = async () => {
        if (isDemo) {
            toast.success('রেটিং প্রদান করা হয়েছে (Demo)')
            return
        }
        // Logic: Check last rating date
        const canRate = true // simplified for now, need field integration
        if (canRate) {
            try {
                // Update student doc
                const studentRef = doc(db, 'students', selectedStudent.id)
                await updateDoc(studentRef, {
                    lastRatingDate: serverTimestamp(),
                    rating: (Math.random() * 5).toFixed(1) // Example logic, normally specific value
                })
                toast.success('রেটিং সফল হয়েছে')
            } catch (e) { toast.error('এরর') }
        }
    }

    const handleLogout = async () => {
        if (isDemo) {
            localStorage.removeItem('demo_role')
            navigate('/login')
            window.location.reload()
            return
        }
        await signOut(auth)
        navigate('/login')
    }

    // --- RENDER HELPERS ---

    // Developer Profile Modal
    const DeveloperModal = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDevProfile(false)} className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="bg-white rounded-3xl p-8 max-w-sm w-full relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-slate-900 to-slate-800"></div>
                <div className="relative z-10 -mt-10 mb-4">
                    <div className="w-24 h-24 bg-white rounded-full p-2 mx-auto shadow-xl">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Developer" alt="Dev" className="w-full h-full rounded-full bg-slate-100" />
                    </div>
                </div>
                <h3 className="text-2xl font-black text-slate-800">Md. Developer</h3>
                <p className="text-emerald-600 font-bold mb-6">Full Stack Developer</p>
                <div className="space-y-3 text-slate-500 text-sm mb-6">
                    <p className="flex items-center justify-center gap-2"><MapPin size={16} /> Dhaka, Bangladesh</p>
                    <p className="flex items-center justify-center gap-2"><MessageSquare size={16} /> dev@example.com</p>
                </div>
                <button onClick={() => setShowDevProfile(false)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
                    বন্ধ করুন
                </button>
            </motion.div>
        </motion.div>
    )

    // Notes Detail Modal
    const NoteModal = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedNote(null)} className="fixed inset-0 bg-black/60 z-[90] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="bg-white rounded-[40px] p-8 max-w-lg w-full relative">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <span className="text-xs font-black uppercase bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{selectedNote.class?.replace('_', ' ') || 'General'}</span>
                        <h3 className="text-xl font-black text-slate-800 mt-2">নোট বিস্তারিত</h3>
                    </div>
                    <button onClick={() => setSelectedNote(null)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100"><X size={20} /></button>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 max-h-[60vh] overflow-y-auto">
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">{selectedNote.content}</p>
                </div>
                <div className="mt-6 text-right text-xs font-bold text-slate-400">
                    Created: {selectedNote.createdAt?.toDate ? selectedNote.createdAt.toDate().toLocaleString() : 'Just now'}
                </div>
            </motion.div>
        </motion.div>
    )

    // Student Full Modal (Acts as New Page)
    const StudentFullModal = () => (
        <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-0 bg-slate-50 z-[80] overflow-y-auto">
            <div className="max-w-4xl mx-auto min-h-screen bg-white shadow-2xl relative">
                <button onClick={() => setSelectedStudent(null)} className="fixed top-6 right-6 md:top-10 md:right-10 z-[90] p-3 bg-white/80 backdrop-blur shadow-lg rounded-full hover:bg-slate-100 transition-all border border-slate-200">
                    <X size={24} className="text-slate-600" />
                </button>

                {/* Header Profile */}
                <div className="bg-slate-900 text-white p-10 md:p-14 rounded-b-[50px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="relative z-10 text-center">
                        <div className="w-28 h-28 bg-white/10 backdrop-blur md:w-32 md:h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-black text-white border-4 border-white/20">
                            {selectedStudent.full_name?.[0]}
                        </div>
                        <h2 className="text-3xl font-black mb-2">{selectedStudent.full_name}</h2>
                        <div className="flex justify-center gap-3 text-sm font-bold text-slate-300">
                            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10">Roll: {selectedStudent.roll}</span>
                            <span className="bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/20 text-emerald-300 uppercase">{selectedStudent.class}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-10 space-y-10 pb-32">
                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-xl font-black text-slate-800 border-l-4 border-emerald-500 pl-3">ব্যক্তিগত তথ্য</h3>
                            <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <InfoRow label="পিতার নাম" value={selectedStudent.father_name || 'N/A'} />
                                <InfoRow label="মোবাইল" value={selectedStudent.phone || 'N/A'} />
                                <InfoRow label="ঠিকানা" value={selectedStudent.address || 'N/A'} />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-xl font-black text-slate-800 border-l-4 border-amber-500 pl-3">একাডেমিক অ্যাকশন</h3>
                            <div className="space-y-4">
                                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                                    <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2"><AlertTriangle size={18} /> সতর্কবার্তা প্রদান</h4>
                                    <textarea
                                        value={warningInput}
                                        onChange={e => setWarningInput(e.target.value)}
                                        className="w-full p-3 bg-white rounded-xl text-sm border border-amber-200 outline-none focus:ring-2 focus:ring-amber-500/20 mb-3"
                                        placeholder="সতর্কবার্তা লিখুন..."
                                        rows="3"
                                    />
                                    <button onClick={submitWarning} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm transition-colors">
                                        পাঠান
                                    </button>
                                </div>
                                <button onClick={submitRating} className="w-full py-4 bg-slate-900 text-white rounded-3xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl">
                                    <Star className="text-yellow-400" fill="currentColor" /> রেটিং প্রদান করুন (6 Months)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Warning History */}
                    <div>
                        <h3 className="text-xl font-black text-slate-800 mb-6">সতর্কবার্তা হিস্ট্রি</h3>
                        <div className="space-y-4">
                            {studentWarnings.map(w => (
                                <div key={w.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
                                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl h-fit"><AlertTriangle size={20} /></div>
                                    <div>
                                        <p className="text-slate-700 font-bold text-sm mb-1">{w.text}</p>
                                        <p className="text-xs text-slate-400 font-bold">By {w.teacherName} • {w.date}</p>
                                    </div>
                                </div>
                            ))}
                            {studentWarnings.length === 0 && <p className="text-slate-400 text-center py-4 font-bold">কোনো সতর্কবার্তা নেই</p>}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )

    const InfoRow = ({ label, value }) => (
        <div className="flex justify-between items-center border-b border-slate-200 last:border-0 pb-3 last:pb-0">
            <span className="text-sm font-bold text-slate-400">{label}</span>
            <span className="text-sm font-black text-slate-700">{value}</span>
        </div>
    )

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-bengali pb-24 md:pb-0">
            {/* Modals */}
            <AnimatePresence>
                {showDevProfile && <DeveloperModal />}
                {selectedNote && <NoteModal />}
                {selectedStudent && <StudentFullModal />}
            </AnimatePresence>

            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-72 bg-slate-900 text-white p-6 flex-col shadow-2xl relative z-20 h-screen sticky top-0">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/20">
                        {teacherProfile?.full_name?.[0] || 'T'}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight line-clamp-1">{teacherProfile?.full_name || 'Loading...'}</h3>
                        <p className="text-emerald-400 text-xs font-medium">বিষয়: {teacherProfile?.subject || 'N/A'}</p>
                    </div>
                </div>

                <nav className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <NavItem icon={<Users />} label="শিক্ষার্থী তালিকা" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
                    <NavItem icon={<PenTool />} label="অ্যাসাইনমেন্ট" active={activeTab === 'assignments'} onClick={() => setActiveTab('assignments')} />
                    <NavItem icon={<Clock />} label="অ্যাসাইনমেন্ট হিস্ট্রি" active={activeTab === 'assignments_history'} onClick={() => { setActiveTab('assignments_history'); fetchAssignments(); }} />
                    <NavItem icon={<ClipboardList />} label="হাজিরা" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
                    <NavItem icon={<StickyNote />} label="ব্যক্তিগত নোট" active={activeTab === 'notes'} onClick={() => { setActiveTab('notes'); fetchNotes(); }} />
                </nav>

                <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
                    <button onClick={handleLogout} className="flex items-center gap-3 text-rose-400 hover:text-rose-300 transition-colors w-full px-4 py-3 rounded-xl hover:bg-slate-800 font-bold text-sm">
                        <LogOut size={18} /> লগআউট
                    </button>
                    <button onClick={() => setShowDevProfile(true)} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full px-4 py-2 rounded-xl hover:bg-slate-800 text-xs font-bold justify-center">
                        Developer Profile
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen relative scroll-smooth pb-20 md:pb-0">
                {/* Mobile Top Bar */}
                <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-white text-sm">
                            {teacherProfile?.full_name?.[0] || 'T'}
                        </div>
                        <h2 className="font-bold text-slate-800 text-sm">ড্যাশবোর্ড</h2>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowDevProfile(true)} className="p-2 bg-slate-100 rounded-full"><Info size={20} className="text-slate-600" /></button>
                        <button onClick={handleLogout}><LogOut size={20} className="text-rose-500" /></button>
                    </div>
                </div>

                <div className="p-4 md:p-8 max-w-6xl mx-auto pb-32">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* --- TAB: STUDENTS --- */}
                            {activeTab === 'students' && (
                                <div className="space-y-6">
                                    <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-800">শিক্ষার্থী তালিকা</h2>
                                            <p className="text-slate-500 font-bold mt-1">
                                                TOTAL STUDENTS: <span className="text-emerald-600">{students.length}</span>
                                            </p>
                                        </div>
                                        {/* Responsive Dropdown Fix */}
                                        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200 w-full md:w-auto">
                                            <span className="text-xs font-black text-slate-400 uppercase pl-2 whitespace-nowrap">Class:</span>
                                            <select
                                                value={selectedClass}
                                                onChange={(e) => setSelectedClass(e.target.value)}
                                                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer w-full md:w-40 text-sm truncate"
                                            >
                                                {ALL_CLASSES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {loading ? <p>Loading...</p> : students.map(student => (
                                            <div key={student.id} onClick={() => setSelectedStudent(student)} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-100 transition-all cursor-pointer group hover:-translate-y-1">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 font-black group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                                        {student.full_name?.[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 line-clamp-1">{student.full_name}</h4>
                                                        <div className="flex gap-2 mt-1">
                                                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Roll: {student.roll}</span>
                                                            <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded uppercase">{student.class || selectedClass}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {!loading && students.length === 0 && (
                                            <div className="col-span-3 text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                                                <Users size={40} className="mx-auto text-slate-300 mb-3" />
                                                <p className="text-slate-400 font-bold">এই ক্লাসে কোনো শিক্ষার্থী নেই</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* --- TAB: ASSIGNMENTS --- */}
                            {activeTab === 'assignments' && (
                                <div className="max-w-2xl mx-auto bg-white p-8 rounded-[40px] shadow-lg shadow-emerald-900/5 border border-slate-100">
                                    <h2 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-2">
                                        <PenTool className="text-emerald-500" /> নতুন অ্যাসাইনমেন্ট
                                    </h2>
                                    <p className="text-slate-500 font-bold text-sm mb-6">Target Class: <span className="text-emerald-600 uppercase">{selectedClass.replace('_', ' ')}</span></p>

                                    <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-xs font-bold flex items-center gap-2">
                                        <AlertTriangle size={16} /> খেয়াল করুন: আপনি বর্তমানে {selectedClass} এর জন্য অ্যাসাইনমেন্ট তৈরি করছেন।
                                    </div>

                                    <form onSubmit={handleAssignmentSubmit} className="space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">বিষয়</label>
                                                <input required type="text" value={assignmentData.subject} onChange={e => setAssignmentData({ ...assignmentData, subject: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 border-2 border-transparent focus:border-emerald-500 transition-all" placeholder="যেমন: গণিত" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">অধ্যায়</label>
                                                <input required type="text" value={assignmentData.chapter} onChange={e => setAssignmentData({ ...assignmentData, chapter: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 border-2 border-transparent focus:border-emerald-500 transition-all" placeholder="অধ্যায় নং..." />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">পৃষ্ঠা নং</label>
                                                <input required type="text" value={assignmentData.page} onChange={e => setAssignmentData({ ...assignmentData, page: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 border-2 border-transparent focus:border-emerald-500 transition-all" placeholder="পৃষ্ঠা..." />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">শিরোনাম</label>
                                                <input required type="text" value={assignmentData.title} onChange={e => setAssignmentData({ ...assignmentData, title: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 border-2 border-transparent focus:border-emerald-500 transition-all" placeholder="ছোট শিরোনাম..." />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">বিস্তারিত</label>
                                            <textarea required value={assignmentData.details} onChange={e => setAssignmentData({ ...assignmentData, details: e.target.value })} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 border-2 border-transparent focus:border-emerald-500 transition-all h-32 resize-none" placeholder="শিক্ষার্থীদের জন্য বিস্তারিত নির্দেশনা..." />
                                        </div>
                                        <button type="submit" className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-colors shadow-xl shadow-emerald-500/30 active:scale-[0.98]">
                                            সাবমিট করুন
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* --- TAB: HISTORY --- */}
                            {activeTab === 'assignments_history' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                        <h2 className="text-2xl font-black text-slate-800">অ্যাসাইনমেন্ট হিস্ট্রি</h2>
                                        <div className="w-32 md:w-40">
                                            <select
                                                value={selectedClass}
                                                onChange={(e) => setSelectedClass(e.target.value)}
                                                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-700 outline-none cursor-pointer w-full text-xs md:text-sm"
                                            >
                                                {ALL_CLASSES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid gap-4">
                                        {assignmentsHistory.map((assign) => (
                                            <div key={assign.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between items-start gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="font-black text-lg text-slate-800">{assign.title}</h4>
                                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-black uppercase">{assign.class?.replace('_', ' ')}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-500 font-bold">বিষয়: <span className="text-emerald-600">{assign.subject}</span> • অধ্যায়: {assign.chapter}</p>
                                                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">{assign.details}</p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-black">{assign.date}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* --- TAB: NOTES --- */}
                            {activeTab === 'notes' && (
                                <div className="space-y-6">
                                    <div className="bg-amber-50 p-6 md:p-8 rounded-[32px] border border-amber-100 relative overflow-hidden">
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <h2 className="text-xl font-black text-amber-900 flex items-center gap-2"><StickyNote className="text-amber-600" /> নোটবুক</h2>
                                                <select
                                                    value={noteClass}
                                                    onChange={(e) => setNoteClass(e.target.value)}
                                                    className="bg-white/50 border border-amber-200 rounded-xl px-3 py-1 font-bold text-amber-800 text-xs md:text-sm outline-none cursor-pointer"
                                                >
                                                    {ALL_CLASSES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                                </select>
                                            </div>

                                            <textarea
                                                value={noteInput}
                                                onChange={(e) => setNoteInput(e.target.value)}
                                                className="w-full p-4 bg-white rounded-2xl font-normal text-slate-700 outline-none focus:ring-4 focus:ring-amber-400/20 h-32 shadow-sm mb-4 border-none placeholder:text-slate-300"
                                                placeholder="লিখুন..."
                                            />
                                            <div className="flex justify-end">
                                                <button onClick={saveNote} className="px-8 py-3 bg-amber-500 text-white font-black rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-2">
                                                    <Save size={18} /> সেভ করুন
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {notes.map(note => (
                                            <div key={note.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group hover:border-amber-100 transition-colors">
                                                <div className="flex justify-between items-start mb-2 gap-2">
                                                    <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{note.class?.replace('_', ' ') || 'General'}</span>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setSelectedNote(note)} className="text-emerald-500 hover:text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded">বিস্তারিত</button>
                                                    </div>
                                                </div>
                                                <p className="text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis font-medium text-sm leading-relaxed">{note.content}</p>
                                                <span className="block mt-4 text-[10px] text-slate-300 font-bold text-right">
                                                    {note.createdAt?.toDate ? note.createdAt.toDate().toLocaleDateString() : 'Just now'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* --- TAB: ATTENDANCE --- */}
                            {activeTab === 'attendance' && (
                                <div className="space-y-6">
                                    <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-100">
                                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                            <div className="w-full md:w-auto">
                                                <h2 className="text-2xl font-black text-slate-800">হাজিরা গ্রহণ</h2>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                                        <Users size={16} /> মোট: {students.length}
                                                    </div>
                                                    <div className="h-4 w-px bg-slate-200"></div>
                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                                        <Calendar size={16} /> {new Date().toLocaleDateString('bn-BD')}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 w-full md:w-auto">
                                                <select
                                                    value={selectedClass}
                                                    onChange={(e) => setSelectedClass(e.target.value)}
                                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none cursor-pointer w-full md:w-auto"
                                                >
                                                    {ALL_CLASSES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                                </select>
                                                <button
                                                    onClick={() => setAttendanceData(prev => ({ ...prev, viewStats: !prev.viewStats }))}
                                                    className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors whitespace-nowrap"
                                                >
                                                    {attendanceData.viewStats ? 'হাজিরা শীট' : 'রিপোর্ট'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* STATUS MESSAGE AREA */}
                                        <div className="mt-6">
                                            {attendanceStatus.isTaken && !attendanceStatus.canEdit && (
                                                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 font-bold">
                                                    <Lock size={20} />
                                                    <div>
                                                        <p>আজকের হাজিরা সম্পন্ন হয়েছে।</p>
                                                        <p className="text-xs opacity-70">Taken by: {attendanceStatus.takenByName}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {!attendanceData.viewStats ? (
                                        <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm relative">
                                            {(!attendanceStatus.canEdit && attendanceStatus.isTaken) && <div className="absolute inset-0 bg-white/50 z-10 cursor-not-allowed" />}

                                            <table className="w-full text-left">
                                                <thead className="bg-slate-50 border-b border-slate-100">
                                                    <tr>
                                                        <th className="p-4 md:p-6 font-black text-slate-500 text-sm">শিক্ষার্থী</th>
                                                        <th className="p-4 md:p-6 font-black text-slate-500 text-sm text-center">স্ট্যাটাস</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {students.map(student => (
                                                        <tr key={student.id} className="hover:bg-slate-50/50">
                                                            <td className="p-4 md:p-6 font-bold text-slate-700 flex items-center gap-3">
                                                                <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-100 rounded-full flex items-center justify-center text-xs md:text-sm font-black text-slate-400">
                                                                    {student.full_name?.[0]}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm md:text-base">{student.full_name}</p>
                                                                    <p className="text-[10px] text-slate-400 font-black uppercase">Roll: {student.roll}</p>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 md:p-6 text-center">
                                                                {/* Simple Mobile Friendly Toggle */}
                                                                <div className="flex justify-center gap-2">
                                                                    <button onClick={() => setAttendanceData({ ...attendanceData, [student.id]: 'present' })} className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center transition-all ${attendanceData[student.id] === 'present' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>P</button>
                                                                    <button onClick={() => setAttendanceData({ ...attendanceData, [student.id]: 'absent' })} className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center transition-all ${attendanceData[student.id] === 'absent' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}>A</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            {(attendanceStatus.canEdit || !attendanceStatus.isTaken) && students.length > 0 && (
                                                <div className="p-6 border-t border-slate-100 bg-slate-50 sticky bottom-0 z-20 flex justify-end">
                                                    <button onClick={submitAttendance} className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-colors shadow-xl">
                                                        হাজিরা সাবমিট করুন
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="grid gap-4">
                                                {students.slice(0, 5).map((student, i) => (
                                                    <div key={student.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : 'bg-emerald-400'}`}>
                                                                #{i + 1}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-black text-slate-800">{student.full_name}</h4>
                                                                <p className="text-xs text-slate-400 font-bold">Total Present: 95%</p>
                                                            </div>
                                                        </div>
                                                        <Award size={24} className={`${i === 0 ? 'text-amber-400' : 'text-slate-200'}`} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Fixed */}
                <div className="fixed bottom-0 w-full md:pl-72 z-30 pointer-events-none hidden md:block">
                    <div className="bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between text-slate-500 gap-4 pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center gap-3">
                            <img src={logo} className="w-8 h-8 opacity-80" alt="Logo" />
                            <div>
                                <h4 className="font-bold text-slate-800 text-xs">সুফিয়া নূরীয়া দাখিল মাদ্রাসা</h4>
                                <p className="text-[10px] font-bold">টেকনাফ, কক্সবাজার</p>
                            </div>
                        </div>
                        <div className="text-center md:text-right text-[10px] font-bold flex items-center gap-2">
                            <span>Developed by</span>
                            <button onClick={() => setShowDevProfile(true)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors">
                                Your Name
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Bottom Navigation */}
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50 md:hidden flex justify-around items-center px-2 py-2 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                    <MobileNavItem icon={<Users />} label="Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
                    <MobileNavItem icon={<Clock />} label="History" active={activeTab === 'assignments_history'} onClick={() => { setActiveTab('assignments_history'); fetchAssignments(); }} />
                    <MobileNavItem icon={<ClipboardList />} label="Attend" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
                    <MobileNavItem icon={<StickyNote />} label="Notes" active={activeTab === 'notes'} onClick={() => { setActiveTab('notes'); fetchNotes(); }} />
                </div>
            </main>
        </div>
    )
}

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
    >
        {React.cloneElement(icon, { size: 18 })} {label}
    </button>
)

const MobileNavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${active ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'}`}
    >
        {React.cloneElement(icon, { size: 20 })}
        <span className="text-[10px] font-bold mt-1">{label}</span>
    </button>
)

export default TeacherDashboard
