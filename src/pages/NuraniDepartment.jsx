import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase.js'
import logo from '../assets/logo.png'
import { Users, GraduationCap, Filter, Search, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const NuraniDepartment = () => {
    const navigate = useNavigate()
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedClass, setSelectedClass] = useState('All')
    const [totalStudents, setTotalStudents] = useState(0)

    useEffect(() => {
        // Real-time listener
        setLoading(true)
        const q = query(collection(db, 'nurani_students'), orderBy('createdAt', 'desc'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot?.docs?.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) || []
            setStudents(data)
            setTotalStudents(data?.length || 0)
            setLoading(false)
        }, (error) => {
            console.error("Error fetching Nurani students:", error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    // Filter Logic
    const filteredStudents = selectedClass === 'All'
        ? students
        : students?.filter(s => s.class === selectedClass) || []

    // Unique Classes for Dropdown
    const classes = ['All', ...new Set(students?.map(s => s.class) || [])].sort()

    return (
        <div className="min-h-screen bg-slate-900 font-bengali text-white">
            {/* Header Section */}
            <div className="bg-slate-950 border-b border-slate-800 pt-8 pb-12 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
                    <div className="absolute top-20 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-0 left-4 md:left-0 flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold z-50">
                        <ArrowLeft size={20} /> ফিরে যান
                    </button>
                    <div className="flex flex-col items-center justify-center text-center mt-8">
                        <div className="flex items-center gap-4 mb-6 bg-slate-900/50 p-4 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl">
                            <img src={logo} alt="Madrasha Logo" className="w-16 h-16 object-contain" />
                            <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                                সুফিয়া নূরীয়া দাখিল মাদ্রাসা
                            </h1>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight drop-shadow-md">
                            এক নজরে নূরানী বিভাগ
                        </h2>
                        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                            শিশু শ্রেণী থেকে ৩য় শ্রেণি পর্যন্ত নূরানী বিভাগের সকল শিক্ষার্থী
                        </p>

                        {/* Auto-Counter Badge */}
                        <div className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 px-6 py-2 rounded-full backdrop-blur-md">
                            <Users maxLength={20} className="text-emerald-400" />
                            <span className="text-emerald-300 font-bold">মোট শিক্ষার্থী: <span className="text-white text-xl ml-1">{totalStudents}</span> জন</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-8">
                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-slate-950/50 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-slate-300 font-bold text-lg">
                        <Filter size={20} className="text-emerald-400" />
                        <span>ফিল্টার করুন:</span>
                    </div>

                    <div className="w-full md:w-auto flex flex-wrap gap-2">
                        {['All', 'শিশু শ্রেণি', '১ম শ্রেণি', '২য় শ্রেণি', '৩য় শ্রেণি'].map((cls) => (
                            <button
                                key={cls}
                                onClick={() => setSelectedClass(cls)}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${selectedClass === cls
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                    }`}
                            >
                                {cls === 'All' ? 'সকল ক্লাস' : cls}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-slate-400 animate-pulse">তথ্য লোড হচ্ছে...</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {/* Student Grid - 3 Columns Mobile & Desktop */}
                        <div className="grid grid-cols-3 gap-3 md:gap-6">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                    <motion.div
                                        key={student.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-slate-800/50 border border-white/5 rounded-xl md:rounded-2xl p-2 md:p-6 hover:bg-slate-800 hover:border-emerald-500/30 transition-all duration-300 group relative overflow-hidden flex flex-col items-center"
                                    >
                                        <div className="absolute top-0 right-0 w-10 h-10 md:w-20 md:h-20 bg-emerald-500/5 rounded-bl-full group-hover:bg-emerald-500/10 transition-colors" />

                                        <div className="flex flex-col items-center text-center relative z-10 w-full">
                                            <div className="w-12 h-12 md:w-24 md:h-24 rounded-full border border-emerald-500/30 p-0.5 md:p-1 mb-2 md:mb-4 overflow-hidden bg-slate-900 group-hover:border-emerald-400 transition-colors">
                                                <img
                                                    src={student.imageUrl || logo}
                                                    alt={student.name}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            </div>

                                            <h3 className="text-[10px] md:text-xl font-bold text-white mb-1 leading-tight line-clamp-1">{student.name}</h3>
                                            <div className="inline-block px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-slate-950 border border-slate-700 text-[8px] md:text-xs font-bold text-slate-300 mb-2 md:mb-3">
                                                রোল: {student.roll}
                                            </div>

                                            <div className="w-full pt-2 md:pt-3 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[8px] md:text-sm gap-1 md:gap-0">
                                                <span className="text-slate-500 hidden md:inline">শ্রেণি:</span>
                                                <span className="text-emerald-400 font-bold">{student.class}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 text-slate-500">
                                    <Search size={48} className="mx-auto mb-4 opacity-50" />
                                    <p className="text-lg">কোনো শিক্ষার্থী পাওয়া যায়নি</p>
                                </div>
                            )}
                        </div>
                    </AnimatePresence>
                )}
            </div>
        </div >
    )
}

export default NuraniDepartment
