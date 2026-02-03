import React from 'react'
import { motion } from 'framer-motion'
import { Mail, GraduationCap } from 'lucide-react'
import BackButton from '../components/BackButton'

const TeachersList = () => {
    const teachers = [
        { name: "মাওলানা আব্দুল হাই", role: "সুপারিনটেনডেন্ট", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
        { name: "মোহাম্মদ ইব্রাহিম", role: "সহকারী শিক্ষক (গণিত)", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
        { name: "মাওলানা জসিম উদ্দিন", role: "সিনিয়র শিক্ষক (আরবি)", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
        { name: "মো ফখরুল ইসলাম", role: "সহকারী শিক্ষক (ইংরেজি)", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" },
    ]

    return (
        <div className="min-h-screen bg-white py-32 font-bengali">
            <div className="container mx-auto px-6">
                <BackButton />
                <div className="text-center mb-20 space-y-4">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-indigo-600 font-black uppercase tracking-[0.3em] text-sm"
                    >
                        Our Educators
                    </motion.span>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900">সম্মানিত শিক্ষকবৃন্দ</h2>
                    <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {teachers.map((teacher, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group"
                        >
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-indigo-600 rounded-[48px] rotate-6 scale-95 opacity-0 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-500" />
                                <div className="relative aspect-[3/4] rounded-[48px] overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                                    <img
                                        src={teacher.image}
                                        alt={teacher.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <h4 className="text-2xl font-black text-slate-900">{teacher.name}</h4>
                                <p className="text-indigo-600 font-bold uppercase tracking-wider text-sm">{teacher.role}</p>

                                <div className="flex justify-center gap-4 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                                        <Mail size={18} />
                                    </div>
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                                        <GraduationCap size={18} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TeachersList
