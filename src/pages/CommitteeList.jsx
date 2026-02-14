import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import logo from '../assets/logo.png'
import BackButton from '../components/BackButton'
import Preloader from '../components/Preloader'
import { X } from 'lucide-react'

const CommitteeList = () => {
    const [committee, setCommittee] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const q = query(collection(db, 'committee'), orderBy('createdAt', 'desc'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setCommittee(list)
            setLoading(false)
        }, (error) => {
            console.error("Error fetching committee:", error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    if (loading) return <Preloader />

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12 md:py-20 pb-40 font-bengali overflow-x-hidden">
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <BackButton />

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
                        <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600 pb-2">
                            মাদ্রাসা পরিচালনা কমিটি
                        </h2>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-indigo-400 rounded-full" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {committee && committee.length > 0 ? (
                        committee.map((member, i) => (
                            <CommitteeCard key={member.id || i} member={member} index={i} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-white/50 rounded-3xl border border-dashed border-slate-200 backdrop-blur-sm">
                            <p className="text-slate-400 font-bold">কোনো তথ্য পাওয়া যায়নি।</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const CommitteeCard = ({ member, index }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isLong = member.quote && member.quote.length > 60;

    return (
        <div className="relative group">
            <div className="absolute -inset-[2px] bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-600 rounded-[26px] md:rounded-[50px] opacity-0 group-hover:opacity-100 blur-[2px] transition-all duration-500" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-white p-4 md:p-8 rounded-[24px] md:rounded-[48px] text-center shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden flex flex-col h-full"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-transparent to-purple-500/0 group-hover:shadow-[inset_0_0_60px_rgba(99,102,241,0.05)] transition-all duration-500" />

                <div className="relative inline-block mb-3 md:mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                    <img src={member.imageUrl || logo} alt={member.name} className="relative w-20 h-20 md:w-32 md:h-32 rounded-full object-cover border-4 border-slate-50 group-hover:border-indigo-500/20 shadow-xl mx-auto transition-colors duration-500" />
                </div>

                <h4 className="relative text-sm md:text-2xl font-black text-slate-800 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{member.name}</h4>
                <div className="relative inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[8px] md:text-xs uppercase tracking-widest mb-3 md:mb-4 border border-emerald-100 self-center">
                    {member.designation}
                </div>

                <div className="relative text-slate-500 text-[10px] md:text-sm font-medium leading-relaxed flex-grow">
                    <span className="text-indigo-400 text-xl font-serif">"</span>
                    {member.quote?.slice(0, 60)}
                    {isLong && '...'}
                    <span className="text-indigo-400 text-xl font-serif">"</span>
                </div>

                {isLong && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="relative mt-4 px-4 py-2 bg-slate-50 hover:bg-emerald-600 text-slate-600 hover:text-white rounded-xl text-[10px] md:text-xs font-bold transition-all duration-300 border border-slate-100 hover:border-emerald-500 self-center"
                    >
                        বিস্তারিত পড়ুন
                    </button>
                )}
            </motion.div>

            {isOpen && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsOpen(false)}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-3xl p-6 md:p-10 max-w-lg w-full relative overflow-hidden text-center shadow-2xl border border-white/20"
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-rose-100 hover:text-rose-600 transition-colors">
                            <X size={20} />
                        </button>

                        <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full border-4 border-emerald-100 mb-4 overflow-hidden shadow-xl">
                            <img src={member.imageUrl || logo} className="w-full h-full object-cover" />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-1">{member.name}</h3>
                        <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-6">{member.designation}</p>

                        <div className="bg-slate-50 p-6 md:p-8 rounded-2xl relative border border-slate-100">
                            <span className="absolute top-2 left-4 text-4xl md:text-6xl text-emerald-200 font-serif opacity-50">"</span>
                            <p className="text-slate-600 leading-relaxed relative z-10 font-medium text-sm md:text-base">
                                {member.quote}
                            </p>
                            <span className="absolute bottom-2 right-4 text-4xl md:text-6xl text-emerald-200 font-serif opacity-50">"</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default CommitteeList
