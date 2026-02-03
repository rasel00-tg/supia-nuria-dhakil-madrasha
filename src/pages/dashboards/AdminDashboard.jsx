import React, { useState, useEffect } from 'react'
import { db } from '../../firebase'
import {
    collection, query, where, getDocs, updateDoc, doc, deleteDoc, addDoc, serverTimestamp, orderBy, getDoc, setDoc
} from 'firebase/firestore'
import {
    Users, Bell, CheckCircle, XCircle, LayoutDashboard, Megaphone,
    Trash2, Clock, ShieldCheck, FileText, Send, Loader, UserPlus,
    Settings, LogOut, Menu, X, Undo, Phone, MapPin, Award, UserCheck, Smartphone
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import logo from '../../assets/logo.png'
import { DeveloperProfile } from '../../components/Footer'

const AdminDashboard = () => {
    const navigate = useNavigate()


    // UI State
    const [activeTab, setActiveTab] = useState('dashboard')
    const [loading, setLoading] = useState(false)
    const [showSidebar, setShowSidebar] = useState(false)

    // Stats
    const [stats, setStats] = useState({ pending: 0, students: 0, teachers: 0, notices: 0 })
    const [admissionForms, setAdmissionForms] = useState([])
    const [notices, setNotices] = useState([])
    const [usersList, setUsersList] = useState({ teachers: [], students: [] })

    // Forms
    const [newNotice, setNewNotice] = useState({ title: '', content: '' })
    const [newTeacher, setNewTeacher] = useState({ name: '', email: '', subject: '' })
    const [globalSettings, setGlobalSettings] = useState({
        superMobile: '', presidentMobile: '', successStory: ''
    })

    // Undo Logic
    const [undoState, setUndoState] = useState({ show: false, timer: null, item: null, collection: '' })

    useEffect(() => {
        fetchStats()
    }, [activeTab])

    const fetchStats = async () => {
        try {
            // Real-time pending count
            const qAdm = query(collection(db, 'admissions'), where('status', '==', 'pending'))
            const admSnap = await getDocs(qAdm)

            // Other Approximate counts
            setStats({
                pending: admSnap.size,
                students: 120, // Mock or fetch actual
                teachers: 15,
                notices: 10
            })

            if (activeTab === 'admissions') {
                const list = []
                admSnap.forEach(d => list.push({ ...d.data(), id: d.id }))
                setAdmissionForms(list)
            }
            if (activeTab === 'users') fetchUsers()
            if (activeTab === 'notices') fetchNotices()
            if (activeTab === 'settings') fetchSettings()

        } catch (e) {
            console.error(e)
        }
    }

    const fetchUsers = async () => {
        const tSnap = await getDocs(collection(db, 'teachers'))
        const sSnap = await getDocs(collection(db, 'students'))
        const tList = []; const sList = []
        tSnap.forEach(d => tList.push({ id: d.id, ...d.data() }))
        sSnap.forEach(d => sList.push({ id: d.id, ...d.data() }))
        setUsersList({ teachers: tList, students: sList })
    }

    const fetchNotices = async () => {
        const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        const list = []
        snap.forEach(d => list.push({ ...d.data(), id: d.id }))
        setNotices(list)
    }

    const fetchSettings = async () => {
        try {
            const snap = await getDoc(doc(db, 'settings', 'general'))
            if (snap.exists()) setGlobalSettings(snap.data())
        } catch (e) { }
    }

    // --- Actions ---

    // Admission with Reason (Prompt)
    const handleAdmissionAction = async (id, action, studentData = null) => {
        let reason = ''
        if (action === 'rejected') {
            reason = prompt("বাতিল করার কারণ লিখুন:")
            if (!reason) return // Cancel if no reason
        }

        try {
            await updateDoc(doc(db, 'admissions', id), {
                status: action,
                rejectionReason: reason || ''
            })

            if (action === 'accepted' && studentData) {
                await addDoc(collection(db, 'students'), {
                    ...studentData,
                    full_name: studentData.student_name_bn,
                    class: studentData.admission_class,
                    createdAt: serverTimestamp(),
                    role: 'student'
                })
                toast.success('শিক্ষার্থী গৃহীত ও এনরোল হয়েছে')
            } else {
                toast.success('আবেদন বাতিল করা হয়েছে')
            }
            fetchStats()
        } catch (e) { toast.error('Error') }
    }

    // Undo Delete
    const handleDeleteWithUndo = (item, collectionName, onDeleteSuccess) => {
        if (window.confirm(`Delete ${item.full_name || item.title}?`)) {
            // Optimistic UI update
            onDeleteSuccess(item.id)

            // Timer
            const timer = setTimeout(async () => {
                await deleteDoc(doc(db, collectionName, item.id))
                toast.success('Permanently Deleted')
                setUndoState({ show: false, timer: null, item: null, col: '' })
            }, 5000)

            setUndoState({ show: true, timer, item, collection: collectionName })
        }
    }

    const handleUndo = () => {
        clearTimeout(undoState.timer)
        toast.success('Restored!')
        // Refresh to restore UI
        fetchStats()
        setUndoState({ show: false, timer: null, item: null, collection: '' })
    }

    const handleAddTeacher = async (e) => {
        e.preventDefault()
        await addDoc(collection(db, 'teachers'), { ...newTeacher, createdAt: serverTimestamp() })
        toast.success('Teacher Added')
        setNewTeacher({ name: '', email: '', subject: '' })
        fetchUsers()
    }

    const handlePublishNotice = async (e) => {
        e.preventDefault()
        await addDoc(collection(db, 'notices'), { ...newNotice, createdAt: serverTimestamp(), date: new Date().toLocaleDateString('bn-BD') })
        toast.success('Notice Published')
        setNewNotice({ title: '', content: '' })
        fetchNotices()
    }

    const saveSettings = async () => {
        await setDoc(doc(db, 'settings', 'general'), globalSettings)
        toast.success('Settings Saved')
    }

    const handleLogout = async () => {
        await signOut(auth)
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-bengali">
            {/* Undo Toast */}
            <AnimatePresence>
                {undoState.show && (
                    <motion.div initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }} className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-4 rounded-full flex gap-4">
                        <span>ডিলিট করা হচ্ছে... (Undo?)</span>
                        <button onClick={handleUndo} className="bg-white text-black px-3 rounded-lg font-bold">Undo</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar Toggle */}
            <button onClick={() => setShowSidebar(true)} className="md:hidden fixed top-4 right-4 z-50 p-3 bg-white shadow-lg rounded-full"><Menu /></button>

            {/* Sidebar */}
            <AnimatePresence>
                {(showSidebar || window.innerWidth >= 768) && (
                    <motion.aside initial={{ x: -250 }} animate={{ x: 0 }} exit={{ x: -250 }} className={`fixed inset-y-0 left-0 w-72 bg-slate-900 text-white p-6 z-40 ${showSidebar ? 'block' : 'hidden md:block'}`}>
                        <div className="flex items-center gap-3 mb-10">
                            <img src={logo} className="w-8 h-8 bg-white rounded" />
                            <h2 className="font-bold">Admin Panel</h2>
                            <button onClick={() => setShowSidebar(false)} className="md:hidden ml-auto"><X /></button>
                        </div>
                        <nav className="space-y-2">
                            <NavItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                            <NavItem icon={<FileText />} label={`Admissions (${stats.pending})`} active={activeTab === 'admissions'} onClick={() => setActiveTab('admissions')} />
                            <NavItem icon={<Users />} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                            <NavItem icon={<Bell />} label="Notices" active={activeTab === 'notices'} onClick={() => setActiveTab('notices')} />
                            <NavItem icon={<Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                        </nav>
                        <button onClick={handleLogout} className="mt-10 flex gap-2 text-rose-400"><LogOut /> Logout</button>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Content */}
            <main className="flex-1 md:pl-72 p-4 md:p-10 pb-32">
                {/* Tabs Content */}
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Pending" value={stats.pending} color="amber" onClick={() => setActiveTab('admissions')} />
                        <StatCard title="Students" value={stats.students} color="emerald" />
                        <StatCard title="Teachers" value={stats.teachers} color="indigo" />
                        <StatCard title="Notices" value={stats.notices} color="rose" />
                    </div>
                )}

                {activeTab === 'admissions' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold border-l-4 border-amber-500 pl-4">Pending Applications</h2>
                        {admissionForms.map(f => (
                            <div key={f.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-lg">{f.student_name_bn}</h4>
                                    <p className="text-xs uppercase text-slate-500">{f.admission_class} • {f.guardian_mobile}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleAdmissionAction(f.id, 'accepted', f)} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200"><CheckCircle size={20} /></button>
                                    <button onClick={() => handleAdmissionAction(f.id, 'rejected')} className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200"><XCircle size={20} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="space-y-8">
                        {/* New Teacher Form */}
                        <div className="bg-indigo-50 p-6 rounded-2xl">
                            <h3 className="font-bold mb-4">Add Teacher</h3>
                            <form onSubmit={handleAddTeacher} className="grid md:grid-cols-3 gap-4">
                                <input placeholder="Name" className="p-2 rounded-lg" value={newTeacher.name} onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })} required />
                                <input placeholder="Email" className="p-2 rounded-lg" value={newTeacher.email} onChange={e => setNewTeacher({ ...newTeacher, email: e.target.value })} required />
                                <input placeholder="Subject" className="p-2 rounded-lg" value={newTeacher.subject} onChange={e => setNewTeacher({ ...newTeacher, subject: e.target.value })} required />
                                <button className="bg-indigo-600 text-white rounded-lg font-bold">Add</button>
                            </form>
                        </div>
                        {/* Lists */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-bold text-slate-500 mb-2">Teachers</h3>
                                {usersList.teachers.map(t => (
                                    <div key={t.id} className="bg-white p-3 rounded-xl mb-2 flex justify-between">
                                        <span>{t.full_name}</span>
                                        <button onClick={() => handleDeleteWithUndo(t, 'teachers', id => setUsersList({ ...usersList, teachers: usersList.teachers.filter(x => x.id !== id) }))} className="text-rose-500"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-500 mb-2">Students</h3>
                                {usersList.students.map(s => (
                                    <div key={s.id} className="bg-white p-3 rounded-xl mb-2 flex justify-between">
                                        <span>{s.full_name}</span>
                                        <button onClick={() => handleDeleteWithUndo(s, 'students', id => setUsersList({ ...usersList, students: usersList.students.filter(x => x.id !== id) }))} className="text-rose-500"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'notices' && (
                    <div className="space-y-6">
                        <form onSubmit={handlePublishNotice} className="bg-white p-6 rounded-2xl flex flex-col gap-4">
                            <input placeholder="Notice Title" className="p-3 bg-slate-50 rounded-lg" value={newNotice.title} onChange={e => setNewNotice({ ...newNotice, title: e.target.value })} required />
                            <textarea placeholder="Content..." className="p-3 bg-slate-50 rounded-lg h-24" value={newNotice.content} onChange={e => setNewNotice({ ...newNotice, content: e.target.value })} required />
                            <button className="bg-purple-600 text-white py-3 rounded-lg font-bold">Publish</button>
                        </form>
                        <div className="space-y-2">
                            {notices.map(n => (
                                <div key={n.id} className="bg-white p-4 rounded-xl flex justify-between">
                                    <div><h4 className="font-bold">{n.title}</h4><p className="text-sm">{n.content}</p></div>
                                    <button onClick={() => handleDeleteWithUndo(n, 'notices', id => setNotices(notices.filter(x => x.id !== id)))} className="text-rose-400"><Trash2 /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="bg-white p-8 rounded-2xl space-y-4">
                        <h3 className="font-bold">Global Settings</h3>
                        <input placeholder="Super Mobile" className="w-full p-3 border rounded-lg" value={globalSettings.superMobile} onChange={e => setGlobalSettings({ ...globalSettings, superMobile: e.target.value })} />
                        <input placeholder="President Mobile" className="w-full p-3 border rounded-lg" value={globalSettings.presidentMobile} onChange={e => setGlobalSettings({ ...globalSettings, presidentMobile: e.target.value })} />
                        <textarea placeholder="Success Story" className="w-full p-3 border rounded-lg h-32" value={globalSettings.successStory} onChange={e => setGlobalSettings({ ...globalSettings, successStory: e.target.value })} />
                        <button onClick={saveSettings} className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold">Save Settings</button>
                    </div>
                )}

                {/* Fixed Footer Logic */}
                <div className="fixed bottom-0 left-0 md:left-72 right-0 bg-white/90 backdrop-blur border-t border-slate-200 p-4 flex justify-between items-center text-xs text-slate-500 z-30">
                    <div className="flex items-center gap-2">
                        <img src={logo} className="w-6 h-6" />
                        <span>Madrasha Admin Panel</span>
                    </div>
                    <DeveloperProfile />
                </div>
            </main>
        </div>
    )
}

const NavItem = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-bold ${active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
        {icon} {label}
    </button>
)
const StatCard = ({ title, value, color, onClick }) => (
    <div onClick={onClick} className={`bg-white p-6 rounded-2xl border-l-4 border-${color}-500 shadow-sm cursor-pointer`}>
        <p className="text-slate-400 text-xs uppercase font-bold">{title}</p>
        <h4 className="text-2xl font-black text-slate-800">{value}</h4>
    </div>
)

export default AdminDashboard
