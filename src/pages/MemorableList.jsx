import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import logo from '../assets/logo.png'
import BackButton from '../components/BackButton'
import Preloader from '../components/Preloader'

const MemorableList = () => {
    const [memorable, setMemorable] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const q = query(collection(db, 'memorable'), orderBy('createdAt', 'desc'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setMemorable(list)
            setLoading(false)
        }, (error) => {
            console.error("Error fetching memorable:", error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    if (loading) return <Preloader />

    return (
        <div className="min-h-screen bg-slate-900 py-12 md:py-20 pb-40 font-bengali overflow-x-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -ml-64 -mb-64" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <BackButton />

                <div className="text-center mb-16 space-y-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-white/10 backdrop-blur-xl rounded-full shadow-xl shadow-indigo-500/10 p-3 md:p-4 mb-6 border border-white/10"
                    >
                        <img src={logo} alt="Madrasa Logo" className="w-full h-full object-contain" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl md:text-5xl font-black text-white tracking-tight"
                    >
                        সুফিয়া নূরীয়া দাখিল মাদ্রাসা
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-block relative"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 pb-2">
                            সকল স্মরণীয়বৃন্দ
                        </h2>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-indigo-400 rounded-full" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {memorable && memorable.length > 0 ? (
                        memorable.map((person, i) => (
                            <MemorialCard key={person.id || i} person={person} index={i} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/20 backdrop-blur-sm">
                            <p className="text-slate-400 font-bold">কোনো তথ্য পাওয়া যায়নি।</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const MemorialCard = ({ person, index }) => {
    const [expanded, setExpanded] = useState(false);
    const isLong = person.contribution && person.contribution.length > 80;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl p-4 md:p-10 rounded-[24px] md:rounded-[48px] border border-white/10 flex flex-col items-center gap-3 md:gap-6 hover:bg-white/10 transition-all group h-full relative"
        >
            <div className="absolute top-6 left-6 w-8 h-8 md:w-12 md:h-12 border-l border-t border-emerald-500/30 rounded-tl-xl" />
            <div className="absolute bottom-6 right-6 w-8 h-8 md:w-12 md:h-12 border-r border-b border-indigo-500/30 rounded-br-xl" />

            <div className="flex items-center gap-2 md:gap-4 self-start md:self-center w-full justify-center">
                <img src={person.imageUrl || logo} alt={person.name} className="w-16 h-16 md:w-32 md:h-32 rounded-full object-cover border-2 border-emerald-500/30 group-hover:border-emerald-500 transition-colors shadow-2xl" />
                <p className="text-emerald-400 font-black text-[10px] md:text-lg">শ্রদ্ধাঞ্জলি</p>
            </div>
            <div className="text-center w-full space-y-1 md:space-y-2">
                <h4 className="text-base md:text-3xl font-black text-white">{person.name}</h4>
                <p className="text-rose-400 font-black text-[10px] md:text-sm uppercase tracking-widest">মৃত্যু: {person.year}</p>
                <div className="text-slate-300 font-medium text-[10px] md:text-base leading-relaxed mt-2 line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                    {expanded ? person.contribution : (person.contribution?.slice(0, 80) || '')}
                    {isLong && !expanded && '...'}
                </div>
                {isLong && (
                    <button onClick={() => setExpanded(!expanded)} className="text-emerald-400 text-xs font-bold mt-2 hover:underline p-2">
                        {expanded ? 'সংক্ষিপ্ত করুন' : 'বিস্তারিত পড়ুন'}
                    </button>
                )}
            </div>
        </motion.div>
    )
}

export default MemorableList
