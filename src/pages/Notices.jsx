import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Bell, Calendar } from 'lucide-react'
import BackButton from '../components/BackButton'

const Notices = () => {
    const [notices, setNotices] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNotices()
    }, [])

    const fetchNotices = async () => {
        const { data } = await supabase
            .from('notices')
            .select('*')
            .order('created_at', { ascending: false })
        setNotices(data || [])
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-slate-50 py-24 px-6 font-bengali">
            <div className="container mx-auto max-w-4xl">
                <BackButton />
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex p-4 bg-emerald-100 text-emerald-600 rounded-3xl mb-4"
                    >
                        <Bell size={32} className="animate-bounce" />
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">নোটিশ বোর্ড</h2>
                    <p className="text-slate-500 font-bold max-w-lg mx-auto">মাদ্রাসার সকল গুরুত্বপূর্ণ সংবাদ ও আপডেট সবার আগে এখানেই পাবেন।</p>
                    <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full" />
                </div>

                {loading ? (
                    <div className="grid gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white p-8 rounded-[32px] animate-pulse border border-slate-100">
                                <div className="h-4 bg-slate-100 rounded-full w-24 mb-6" />
                                <div className="h-8 bg-slate-100 rounded-full w-3/4 mb-4" />
                                <div className="h-4 bg-slate-100 rounded-full w-full" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {notices.map((notice, i) => (
                            <motion.div
                                key={notice.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[48px] border border-white/50 shadow-2xl shadow-slate-200/50 hover:shadow-emerald-900/5 transition-all duration-500"
                            >
                                {/* Date Badge */}
                                <div className="absolute top-8 right-8 flex flex-col items-center justify-center w-20 h-20 bg-emerald-50 rounded-[24px] text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                                    <span className="text-2xl font-black leading-none">{new Date(notice.created_at).getDate()}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest mt-1">
                                        {new Date(notice.created_at).toLocaleString('default', { month: 'short' })}
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 text-emerald-600">
                                        <div className="p-2 bg-emerald-100 rounded-xl group-hover:bg-white transition-colors">
                                            <Bell size={18} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">প্রাতিষ্ঠানিক নোটিশ</span>
                                    </div>

                                    <div className="space-y-4 pr-24">
                                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors">
                                            {notice.title}
                                        </h3>
                                        <p className="text-slate-500 text-lg font-medium leading-relaxed white-space-pre-line border-l-4 border-slate-100 pl-6 group-hover:border-emerald-200 transition-colors">
                                            {notice.content}
                                        </p>
                                    </div>

                                    <div className="pt-6 flex items-center justify-between border-t border-slate-100">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Calendar size={16} />
                                            <span className="text-[12px] font-black uppercase tracking-widest">
                                                প্রকাশ: {new Date(notice.created_at).getFullYear()}
                                            </span>
                                        </div>
                                        <button className="text-emerald-600 font-black text-sm uppercase tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                            বিস্তারিত পড়ুন <Calendar size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {notices.length === 0 && (
                            <div className="text-center py-24 space-y-6 bg-white/50 backdrop-blur-sm rounded-[48px] border border-dashed border-slate-200">
                                <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                    <Bell size={40} />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-2xl font-black text-slate-400">কোনো নোটিশ পাওয়া যায়নি</p>
                                    <p className="text-slate-400 font-bold">নতুন কোনো নোটিশ প্রকাশিত হলে এখানে দেখা যাবে।</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Notices

