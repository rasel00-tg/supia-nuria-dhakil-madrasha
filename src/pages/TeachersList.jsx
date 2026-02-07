import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import logo from '../assets/logo.png'
import BackButton from '../components/BackButton'
import Preloader from '../components/Preloader'

const TeachersList = () => {
    const [teachers, setTeachers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Changed to real-time listener (onSnapshot)
        const q = query(collection(db, 'teachers'), orderBy('createdAt', 'desc'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const teachersList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setTeachers(teachersList)
            setLoading(false)
        }, (error) => {
            console.error("Error fetching teachers:", error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    if (loading) return <Preloader />

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12 md:py-20 pb-40 font-bengali overflow-x-hidden">
            {/* Decorative Background Blobs */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <BackButton />

                {/* 1. Header Section */}
                <div className="text-center mb-16 space-y-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-white/80 backdrop-blur-xl rounded-full shadow-xl shadow-indigo-500/10 p-3 md:p-4 mb-6 border border-white"
                    >
                        <img src={logo} alt="Madrasa Logo" className="w-full h-full object-contain" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl md:text-5xl font-black text-slate-800 tracking-tight"
                    >
                        সুফিয়া নূরীয়া দাখিল মাদ্রাসা
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-block relative"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 pb-2">
                            সম্মানিত শিক্ষকবৃন্দ
                        </h2>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-600 font-medium text-sm md:text-xl max-w-2xl mx-auto italic leading-relaxed"
                    >
                        "পাঠের সীমা পেরিয়ে যারা আমাদের জীবন নির্মাণ করেন, সেই নীরব স্থপতি শিক্ষকদের প্রতি গভীর কৃতজ্ঞতা ও শ্রদ্ধা।"
                    </motion.p>
                </div>

                {/* 2. Teachers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {teachers && teachers.length > 0 ? (
                        teachers.map((teacher, i) => (
                            <TeacherCard key={teacher.id || i} teacher={teacher} index={i} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-white/50 rounded-3xl border border-dashed border-slate-200 backdrop-blur-sm">
                            <p className="text-slate-400 font-bold">কোনো শিক্ষকের তথ্য পাওয়া যায়নি।</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const TeacherCard = ({ teacher, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -10, scale: 1.02 }}
        className="bg-white/70 backdrop-blur-md rounded-3xl shadow-lg border border-white/50 overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
    >
        {/* Profile Image */}
        <div className="relative aspect-square overflow-hidden bg-slate-100 m-2 rounded-2xl">
            <img
                src={teacher.imageUrl || teacher.photoURL || logo}
                alt={teacher.full_name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Info */}
        <div className="p-5 pt-2 text-center space-y-2 flex-grow flex flex-col justify-center">
            <h3 className="text-lg md:text-xl font-black text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors" title={teacher.full_name}>
                {teacher.full_name}
            </h3>
            <p className="text-[10px] md:text-xs font-bold text-emerald-600 uppercase tracking-widest line-clamp-1 bg-emerald-50 py-1.5 px-3 rounded-full mx-auto inline-block border border-emerald-100 italic">
                {teacher.designation || 'সহকারী শিক্ষক'}
            </p>
            {teacher.email && (
                <p className="text-[10px] md:text-xs text-slate-400 font-medium break-all pt-1 opacity-80">
                    {teacher.email}
                </p>
            )}
        </div>
    </motion.div>
)

export default TeachersList;
