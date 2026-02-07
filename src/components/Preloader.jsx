import React from 'react'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'

const Preloader = ({ progress, message }) => {
    return (
        <div className="fixed inset-0 z-[10000] bg-slate-950/40 backdrop-blur-md flex flex-col items-center justify-center font-bengali">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />

            <div className="relative flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-row items-center gap-4 mb-4"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500/30 blur-xl rounded-full animate-pulse" />
                        <img src={logo} alt="Madrasa Logo" className="w-16 h-16 object-contain relative z-10 drop-shadow-lg" />
                    </div>

                    <div className="text-left">
                        <h2 className="text-xl md:text-2xl font-black text-white tracking-wide drop-shadow-md">
                            সুফিয়া নূরীয়া দাখিল মাদ্রাসা
                        </h2>
                    </div>
                </motion.div>

                {/* Dynamic Message */}
                <motion.p
                    key={message} // Animate when message changes
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-emerald-400 font-bold text-sm md:text-base animate-pulse mb-6 text-center px-4"
                >
                    {message || 'লোডিং হচ্ছে, অপেক্ষা করুন...'}
                </motion.p>

                {/* Progress Bar or Spinner */}
                <div className="w-64">
                    {progress !== undefined ? (
                        <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-white/10">
                            <motion.div
                                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.2 }}
                            />
                        </div>
                    ) : (
                        <div className="flex justify-center gap-2">
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                                className="w-3 h-3 rounded-full bg-emerald-500"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                className="w-3 h-3 rounded-full bg-emerald-400"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                className="w-3 h-3 rounded-full bg-emerald-300"
                            />
                        </div>
                    )}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mt-6 text-slate-500 font-bold text-xs uppercase tracking-widest"
                >
                    DAKHIL MADRASAH
                </motion.p>
            </div>
        </div>
    )
}

export default Preloader

