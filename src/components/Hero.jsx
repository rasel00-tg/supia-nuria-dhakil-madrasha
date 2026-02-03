import React from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

const Hero = () => {
    return (
        <section className="relative min-h-[60vh] lg:h-screen flex flex-col items-center justify-center text-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/background.png"
                    alt="Madrasa Background"
                    className="w-full h-full object-cover bg-center"
                />
                {/* Dark Overlay for better text visibility */}
                <div className="absolute inset-0 bg-slate-900/70" />
            </div>

            {/* User Notice Ticker */}
            <div className="absolute top-0 left-0 right-0 z-30 text-emerald-300 py-3 font-bold border-b border-white/10 bg-slate-900/30 backdrop-blur-sm">
                <div className="flex overflow-hidden">
                    <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-sm md:text-base px-4">
                        <span className="flex items-center gap-2">📢 ২০২৫ শিক্ষাবর্ষের নতুন ভর্তি চলছে! আজই যোগাযোগ করুন।</span>
                        <span className="flex items-center gap-2">✨ সুফিয়া নূরীয়া দাখিল মাদ্রাসা - দ্বীনি ও আধুনিক শিক্ষার সমন্বয়।</span>
                        <span className="flex items-center gap-2">📅 আসন্ন বার্ষিক পরীক্ষার রুটিন প্রকাশিত হয়েছে।</span>
                        <span className="flex items-center gap-2">📢 ২০২৫ শিক্ষাবর্ষের নতুন ভর্তি চলছে! আজই যোগাযোগ করুন।</span>
                        <span className="flex items-center gap-2">✨ সুফিয়া নূরীয়া দাখিল মাদ্রাসা - দ্বীনি ও আধুনিক শিক্ষার সমন্বয়।</span>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="container relative z-10 px-4 flex flex-col items-center justify-center h-full pt-20 pb-10">
                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="mb-4"
                >
                    <img
                        src={logo}
                        alt="Supia Nuria Logo"
                        className="w-16 h-16 md:w-32 md:h-32 lg:w-40 lg:h-40 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                    />
                </motion.div>

                <div className="space-y-3 max-w-full">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white drop-shadow-2xl leading-tight font-bengali whitespace-nowrap"
                    >
                        সুফিয়া নূরীয়া <span className="text-emerald-400">দাখিল মাদ্রাসা</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-white/90 font-bold text-[10px] md:text-lg font-bengali tracking-wide drop-shadow-md"
                    >
                        ঠিকানা: নতুন পল্লান পাড়া, টেকনাফ, কক্সবাজার | স্থাপিত: ১৯৭৫ সাল
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-xs sm:text-base md:text-xl lg:text-2xl text-slate-200 font-bold max-w-[95%] md:max-w-3xl mx-auto drop-shadow-lg font-bengali mt-2"
                    >
                        দ্বীনি ও আধুনিক শিক্ষার এক অপূর্ব সমন্বয়। আমরা গড়ছি আগামী দিনের আদর্শ নাগরিক।
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-row items-center justify-center gap-3 pt-6 w-full px-2"
                >
                    <Link
                        to="/admission"
                        className="group relative px-5 py-2.5 md:px-10 md:py-4 bg-emerald-600 text-white font-bold text-xs md:text-xl rounded-full shadow-lg shadow-emerald-900/40 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 active:scale-95 overflow-hidden font-bengali border border-emerald-500/50"
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <span className="flex items-center justify-center gap-1.5 relative z-10">
                            ভর্তি আবেদন
                            <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                    <a
                        href="#about"
                        className="px-5 py-2.5 md:px-10 md:py-4 bg-white/10 backdrop-blur-md text-white font-bold text-xs md:text-xl rounded-full border border-white/20 hover:bg-white hover:text-slate-900 transition-all active:scale-95 flex items-center justify-center font-bengali"
                    >
                        বিস্তারিত জানুন
                    </a>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 text-white/50 hidden md:block" // Hidden on mobile to save space
            >
                <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                    <div className="w-1 h-1.5 md:h-2 bg-white/50 rounded-full" />
                </div>
            </motion.div>
        </section>
    )
}

export default Hero
