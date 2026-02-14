import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Phone } from 'lucide-react'
import AiFloatingButton from '../components/AiFloatingButton'

const About = () => {
    return (
        <div className="min-h-screen bg-white font-bengali">
            {/* Header / Hero Section */}
            <section className="relative py-32 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1577563908411-5077b6cf7624?auto=format&fit=crop&q=80&w=2000"
                        alt="Background"
                        className="w-full h-full object-cover opacity-30 scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <span className="text-emerald-400 font-black uppercase tracking-[0.3em] text-sm mb-4 block">Detailed Information</span>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">আমাদের মাদ্রাসার <br /><span className="text-emerald-400">বিস্তারিত তথ্য</span></h1>
                        <p className="text-xl md:text-2xl text-slate-300 font-bold leading-relaxed border-l-4 border-emerald-500 pl-8">
                            সুফিয়া নূরীয়া দাখিল মাদ্রাসা - দ্বীনি ও আধুনিক শিক্ষার এক অনন্য প্রতিষ্ঠান।
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Departments Section (Updated) */}
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-10"
                        >
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-slate-900">আমাদের বিভাগসমূহ</h2>
                                <div className="w-20 h-1.5 bg-emerald-500 rounded-full" />
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
                                    <h3 className="text-xl font-black text-emerald-600 mb-2">মাদ্রাসা বিভাগ</h3>
                                    <p className="text-slate-600 font-medium text-lg">
                                        এবতেদায়ী প্রথম শ্রেণী থেকে দাখিল নবম শ্রেণী পর্যন্ত।
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
                                    <h3 className="text-xl font-black text-emerald-600 mb-2">নূরানী বিভাগ</h3>
                                    <p className="text-slate-600 font-medium text-lg">
                                        শিশু শ্রেণী থেকে তৃতীয় শ্রেণী পর্যন্ত।
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
                                    <h3 className="text-xl font-black text-emerald-600 mb-2">হিফজ বিভাগ</h3>
                                    <p className="text-slate-600 font-medium text-lg">
                                        দক্ষ ও ক্বারী প্রশিক্ষণ প্রাপ্ত হাফেজ দ্বারা হিফজ বিভাগ পরিচালনা করা হয়।
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-emerald-500 rounded-[56px] blur-3xl opacity-10" />
                            <div className="relative rounded-[56px] overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1000"
                                    alt="Education"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-emerald-600/10 mix-blend-overlay" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features List Section (Updated) */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-indigo-600 font-black uppercase tracking-[0.3em] text-sm">Key Features</span>
                        <h2 className="text-4xl font-black text-slate-900">মাদ্রাসার বিশেষ বৈশিষ্ট্যসমূহ</h2>
                        <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {[
                            "দক্ষ ও অভিজ্ঞতা সম্পন্ন পরিচালনা কমিটি দ্বারা পরিচালিত।",
                            "ইসলামী ও আধুনিক শিক্ষার চমৎকার সমন্বয়।",
                            "অর্থ সহ বিশুদ্ধ কোরআন শিক্ষার বিশেষ ব্যবস্থা।",
                            "অভিজ্ঞ ও প্রশিক্ষণ প্রাপ্ত শিক্ষক মন্ডলী দ্বারা পাঠদান।",
                            "দক্ষ ও ক্বারী প্রশিক্ষণ প্রাপ্ত হাফেজ দ্বারা হিফজ বিভাগ পরিচালনা।",
                            "সমৃদ্ধ একাডেমিক ভবন ও মনোরম পরিবেশ।",
                            "কম্পিউটার প্রশিক্ষণ, আরবী ও ইংরেজী ভাষার উপর বিশেষ গুরুত্বারোপ।",
                            "নিয়মিত ক্লাস টেস্ট ও মাসিক পরীক্ষার মাধ্যমে পাঠ মূল্যায়ন।",
                            "ছাত্র-ছাত্রীদের অগ্রগতি সম্পর্কে অভিভাবকদের অবহিত করুন।",
                            "নৈতিকতা ও মূল্যবোধ শিক্ষা।",
                            "নিয়মিত সাপ্তাহিক সাংস্কৃতিক অনুষ্ঠান ও শরীর চর্চার সু-ব্যবস্থা।",
                            "বার্ষিক ক্রীড়া ও সাংস্কৃতিক অনুষ্ঠান।"
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ x: 10 }}
                                className="bg-white p-5 rounded-2xl flex items-start gap-4 shadow-sm border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all group"
                            >
                                <CheckCircle className="text-emerald-500 shrink-0 mt-1" size={20} />
                                <p className="text-slate-700 font-bold text-lg group-hover:text-emerald-700 transition-colors">{feature}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Info Footer (Added) */}
            <section className="py-12 bg-slate-900 text-white border-t border-slate-800">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <div className="inline-flex items-center gap-3 bg-emerald-500/10 px-8 py-4 rounded-full backdrop-blur-md border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                            <Phone className="text-emerald-400" size={24} />
                            <h3 className="text-xl md:text-2xl font-black tracking-wide">
                                আলাপন: <span className="text-emerald-400">01767 014 524</span>
                            </h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Assistant - Only on About Page */}
            <AiFloatingButton />
        </div>
    )
}

export default About
