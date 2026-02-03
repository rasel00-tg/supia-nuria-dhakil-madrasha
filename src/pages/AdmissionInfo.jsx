import React from 'react'
import { motion } from 'framer-motion'
import { Info, CheckCircle, FileText, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const AdmissionInfo = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-32 font-bengali">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16 space-y-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-emerald-500 w-20 h-20 rounded-[28px] flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-500/20"
                        >
                            <Info size={40} />
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">ভর্তি সংক্রান্ত তথ্য</h1>
                        <p className="text-xl text-slate-500 font-bold max-w-2xl mx-auto">আমাদের মাদ্রাসায় ২০২৬ শিক্ষাবর্ষের ভর্তি কার্যক্রম শুরু হয়েছে। ভর্তির নিয়মাবলী ও প্রয়োজনীয় তথ্যাদি নিচে দেওয়া হলো।</p>
                    </div>

                    <div className="grid gap-8">
                        {[
                            { title: 'ভর্তির যোগ্যতা', items: ['সুস্থ শারীরিক ও মানসিক অবস্থা', 'পূর্ববর্তী ক্লাসের মার্কশিট', 'সঠিক বয়সের প্রমাণপত্র'] },
                            { title: 'প্রয়োজনীয় কাগজপত্র', items: ['৩ কপি পাসপোর্ট সাইজ ছবি', 'জন্ম নিবন্ধন কার্ডের ফটোকপি', 'পিতামাতার আইডি কার্ডের ফটোকপি'] },
                            { title: 'ভর্তি প্রক্রিয়া', items: ['অনলাইন আবেদন ফরম পূরণ', 'মৌখিক ও লিখিত পরীক্ষা', 'প্রাথমিক বাছাই ও ফি জমা'] }
                        ].map((section, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-10 md:p-12 rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100"
                            >
                                <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-950 rounded-2xl flex items-center justify-center text-white">
                                        <FileText size={20} />
                                    </div>
                                    {section.title}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {section.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                            <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                                            <span className="text-slate-700 font-bold">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link
                            to="/admission"
                            className="inline-flex items-center gap-4 bg-slate-950 text-white px-12 py-6 rounded-[32px] font-black text-xl hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-950/20"
                        >
                            সরাসরি আবেদন করুন <ArrowRight size={24} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdmissionInfo
