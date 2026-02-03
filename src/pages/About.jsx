import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
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
                        <span className="text-emerald-400 font-black uppercase tracking-[0.3em] text-sm mb-4 block">About Our Institution</span>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">আমাদের মাদ্রাসার <br /><span className="text-emerald-400">সাফল্যের কথা</span></h1>
                        <p className="text-xl md:text-2xl text-slate-300 font-bold leading-relaxed border-l-4 border-emerald-500 pl-8">
                            সুফিয়া নূরীয়া দাখিল মাদ্রাসা প্রতিষ্ঠার পর থেকে ইসলামী ও আধুনিক শিক্ষার এক আলোকবর্তিকা হিসেবে কাজ করে যাচ্ছে।
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
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
                                <h2 className="text-4xl font-black text-slate-900">আমাদের লক্ষ্য ও উদ্দেশ্য</h2>
                                <div className="w-20 h-1.5 bg-emerald-500 rounded-full" />
                            </div>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                আমাদের মূল লক্ষ্য হলো শিশুদের এমনভাবে গড়ে তোলা যাতে তারা একজন আদর্শ মুমিন, জ্ঞানদীপ্ত এবং দায়িত্বশীল নাগরিক হিসেবে সমাজে প্রতিষ্ঠিত হতে পারে। নৈতিক মূল্যবোধ ও ধর্মীয় শিক্ষার সমন্বয়ে আমরা আধুনিক বিশ্বের চ্যালেঞ্জ মোকাবিলায় তাদের প্রস্তুত করি।
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {[
                                    { title: 'দ্বীনি শিক্ষা', desc: 'কুরআন ও সুন্নাহর সঠিক জ্ঞান প্রদান।' },
                                    { title: 'আধুনিক শিক্ষা', desc: 'বিজ্ঞান ও তথ্য প্রযুক্তির ব্যবহার।' },
                                    { title: 'নৈতিক উন্নয়ন', desc: 'আদর্শ চরিত্র ও শৃঙ্খলা গঠন।' },
                                    { title: 'ভবিষ্যৎ নেতৃত্ব', desc: 'আগামী দিনের যোগ্য নাগরিক গড়ে তোলা।' }
                                ].map((item, i) => (
                                    <div key={i} className="group p-6 bg-slate-50 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-emerald-900/5 transition-all">
                                        <h4 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                                            <CheckCircle size={20} className="text-emerald-500" />
                                            {item.title}
                                        </h4>
                                        <p className="text-slate-500 font-medium">{item.desc}</p>
                                    </div>
                                ))}
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

            {/* Features Grid */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-indigo-600 font-black uppercase tracking-[0.3em] text-sm">Our Features</span>
                        <h2 className="text-4xl font-black text-slate-900">মাদ্রাসার বিশেষ বৈশিষ্ট্যসমূহ</h2>
                        <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'হিফজ ও দাখিল বিভাগ', icon: '📖' },
                            { title: 'আধুনিক কম্পিউটার ল্যাব', icon: '💻' },
                            { title: 'অভিজ্ঞ শিক্ষক মন্ডলী', icon: '👨‍🏫' },
                            { title: 'নিরাপদ পরিবেশ', icon: '🛡️' }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="bg-white p-10 rounded-[48px] text-center shadow-2xl shadow-slate-200/50 border border-slate-100 hover:border-indigo-100 transition-all duration-500 group"
                            >
                                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform block">{feature.icon}</div>
                                <h4 className="text-xl font-black text-slate-900">{feature.title}</h4>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Assistant - Only on About Page */}
            <AiFloatingButton />
        </div>
    )
}

export default About

