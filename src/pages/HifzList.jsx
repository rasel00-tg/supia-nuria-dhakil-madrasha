import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import logo from '../assets/logo.png'
import BackButton from '../components/BackButton'
import Preloader from '../components/Preloader'

const HifzList = () => {
    const [hafezList, setHafezList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const q = query(collection(db, 'hifz_department'), orderBy('createdAt', 'desc'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setHafezList(list)
            setLoading(false)
        }, (error) => {
            console.error("Error fetching hafez list:", error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    if (loading) return <Preloader />

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 py-12 md:py-20 pb-40 font-bengali overflow-x-hidden">
            {/* Decorative Background Blobs */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <BackButton />

                {/* 1. Header Section */}
                <div className="text-center mb-16 space-y-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-white/80 backdrop-blur-xl rounded-full shadow-xl shadow-emerald-500/10 p-3 md:p-4 mb-6 border border-white"
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
                            আমাদের সম্মানীয় হাফেজগন
                        </h2>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-600 font-medium text-sm md:text-xl max-w-2xl mx-auto italic leading-relaxed"
                    >
                        "যাঁরা পবিত্র কুরআনকে হৃদয়ে ধারণ করেছেন, তাঁরাই দুনিয়া ও আখিরাতের উজ্জ্বল নক্ষত্র। তাঁদের প্রতি আমাদের বিনম্র শ্রদ্ধা ও ভালোবাসা।"
                    </motion.p>
                </div>

                {/* 2. Hafez Grid */}
                <div className="grid grid-cols-3 gap-3 md:gap-6">
                    {hafezList && hafezList.length > 0 ? (
                        hafezList.map((hafez, i) => (
                            <HafezCard key={hafez.id || i} hafez={hafez} index={i} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-white/50 rounded-3xl border border-dashed border-slate-200 backdrop-blur-sm">
                            <p className="text-slate-400 font-bold">কোনো হাফেজের তথ্য পাওয়া যায়নি।</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const HafezCard = ({ hafez, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -10, scale: 1.02 }}
        className="bg-white/70 backdrop-blur-md rounded-xl md:rounded-3xl shadow-lg border border-white/50 overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300"
    >
        {/* Profile Image */}
        <div className="relative aspect-square overflow-hidden bg-slate-100 m-1 md:m-2 rounded-lg md:rounded-2xl">
            <img
                src={hafez.imageUrl || logo}
                alt={hafez.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Info */}
        <div className="p-2 md:p-5 pt-1 md:pt-2 text-center space-y-1 md:space-y-2 flex-grow flex flex-col justify-center">
            <h3 className="text-xs md:text-xl font-black text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors leading-tight" title={hafez.name}>
                {hafez.name}
            </h3>

            <div className="space-y-0.5 md:space-y-1">
                <p className="text-[9px] md:text-xs font-bold text-slate-500 line-clamp-1">পিতা: {hafez.fatherName}</p>
                <p className="text-[8px] md:text-xs text-slate-400 line-clamp-1">{hafez.address}</p>
            </div>
        </div>
    </motion.div>
)

export default HifzList
