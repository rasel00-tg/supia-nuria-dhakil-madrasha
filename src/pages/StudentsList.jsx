import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import logo from '../assets/logo.png'
import BackButton from '../components/BackButton'
import Preloader from '../components/Preloader'
import { Filter } from 'lucide-react'

const StudentsList = () => {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedClass, setSelectedClass] = useState('All')

    useEffect(() => {
        const q = query(collection(db, 'students'), orderBy('roll', 'asc'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            // Filter out nurani students if they are accidentally in this collection, 
            // but the request implies 4th-10th grade are in 'students' collection (implied by AdminDashboard students tab)
            // Admin Dashboard maps 'students' collection to 4th-10th grade management.
            setStudents(list)
            setLoading(false)
        }, (error) => {
            console.error("Error fetching students:", error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const filteredStudents = selectedClass === 'All'
        ? students
        : students.filter(s => s.class === selectedClass || s.admission_class === selectedClass)

    if (loading) return <Preloader />

    return (
        <div className="min-h-screen bg-slate-900 py-12 md:py-20 pb-40 font-bengali overflow-x-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -ml-64 -mb-64" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <BackButton />

                <div className="text-center mb-10 space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-white/10 backdrop-blur-xl rounded-full shadow-xl shadow-indigo-500/10 p-3 md:p-4 border border-white/10"
                    >
                        <img src={logo} alt="Madrasa Logo" className="w-full h-full object-contain" />
                    </motion.div>

                    <h1 className="text-3xl md:text-5xl font-black text-white px-4">
                        শিক্ষার্থী তালিকা
                    </h1>
                    <p className="text-slate-400 font-medium">৪র্থ থেকে ১০ম শ্রেণির শিক্ষার্থীদের তালিকা</p>
                </div>

                {/* Filter Section */}
                <div className="flex flex-wrap justify-center gap-2 mb-10 px-4">
                    <button
                        onClick={() => setSelectedClass('All')}
                        className={`px-4 py-2 rounded-full font-bold text-sm transition-all border ${selectedClass === 'All' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'}`}
                    >
                        সকল শ্রেণি
                    </button>
                    {['৪র্থ শ্রেণি', '৫ম শ্রেণি', '৬ষ্ঠ শ্রেণি', '৭ম শ্রেণি', '৮ম শ্রেণি', '৯ম শ্রেণি', '১০ম শ্রেণি'].map(cls => (
                        <button
                            key={cls}
                            onClick={() => setSelectedClass(cls)}
                            className={`px-4 py-2 rounded-full font-bold text-sm transition-all border ${selectedClass === cls ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'}`}
                        >
                            {cls}
                        </button>
                    ))}
                </div>

                {/* Student Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, i) => (
                            <motion.div
                                key={student.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col items-center text-center group hover:bg-white/10 transition-all relative overflow-hidden"
                            >
                                <div className="w-24 h-24 rounded-full border-2 border-indigo-500/30 overflow-hidden mb-4 group-hover:scale-105 transition-transform">
                                    <img src={student.imageUrl || logo} alt={student.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{student.name || student.full_name}</h3>
                                <div className="space-y-1 text-sm">
                                    <p className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full inline-block mb-2">
                                        {student.class || student.admission_class}
                                    </p>
                                    <p className="text-slate-400 font-bold">রোল: {student.roll}</p>
                                </div>
                                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:bg-indigo-500/20" />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                            <h3 className="text-xl font-bold text-slate-500">কোনো শিক্ষার্থী পাওয়া যায়নি</h3>
                            <p className="text-slate-600 text-sm">অন্য শ্রেণি সিলেক্ট করে চেষ্টা করুন</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StudentsList
