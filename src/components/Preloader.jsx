import React from 'react'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'

const Preloader = ({ progress, message }) => {
    return (
        <div className="fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center font-bengali">
            {/* Animated Gradient Background Rays */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative flex flex-col items-center px-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col items-center gap-6 mb-8 text-center"
                >
                    {/* Logo and Name in One Line */}
                    <div className="flex flex-row items-center justify-center gap-4">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-emerald-500/40 blur-2xl rounded-full group-hover:scale-110 transition-transform duration-500" />
                            <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
                                <img src={logo} alt="Madrasa Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-lg" />
                            </div>
                            {/* Spinning border */}
                            <svg className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] animate-spin-slow">
                                <circle cx="50%" cy="50%" r="48%" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeDasharray="30 150" />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="#6366f1" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        <div className="text-left">
                            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight drop-shadow-2xl">
                                সুফিয়া নূরীয়া
                            </h2>
                            <div className="flex items-center gap-2">
                                <div className="h-[2px] w-6 bg-emerald-500 rounded-full" />
                                <span className="text-emerald-400 font-bold text-xs md:text-sm uppercase tracking-[0.2em]">দাখিল মাদ্রাসা</span>
                            </div>
                        </div>
                    </div>

                    {/* Message Display - Below Icon/Name */}
                    <div className="relative w-64 md:w-80 text-center space-y-3 mt-4">
                        <motion.p
                            key={message}
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-emerald-300 font-bold text-sm md:text-base tracking-wide h-6"
                        >
                            {message || 'লোডিং...'}
                        </motion.p>

                        <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                            {progress !== undefined ? (
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            ) : (
                                <motion.div
                                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                                    animate={{ left: ['-100%', '100%'] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                />
                            )}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 flex items-center gap-2 text-slate-500"
                >
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <p className="font-bold text-[10px] md:text-xs uppercase tracking-[0.4em]">Established 1975</p>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                </motion.div>
            </div>
        </div>
    )
}

export default Preloader

